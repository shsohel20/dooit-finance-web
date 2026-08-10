/**
 * Shared constants and small pure helpers used across the behavioral
 * clustering pipeline (feature extraction, weighting, and labeling).
 * Kept separate so buildWeightedGraph / calculateClusterLayout / the
 * labeler don't each redefine the same FX table or scoring rules.
 */

// Rough, static FX-to-USD rates. These only need to be "same order of
// magnitude" — they exist so BDT/GBP/EUR/... amounts don't get compared
// to USD amounts at face value, not to be accounting-accurate.
export const FX_TO_USD = {
  USD: 1,
  BDT: 1 / 110,
  GBP: 1.27,
  EUR: 1.09,
  CHF: 1.14,
  AED: 1 / 3.67,
  SGD: 0.74,
};

export function toUsd(amount, currency) {
  const n = Number(amount);
  const rate = FX_TO_USD[currency];
  if (!Number.isFinite(n) || !rate) return 0;
  return n * rate;
}

// Base strength for structural (party-relationship) edges by relationType.
// Tighter relationships (family, ownership, control) pull harder than a
// loose transactional link with no other tie.
export const STRUCTURAL_RELATION_WEIGHT = {
  FAMILY: 5,
  OWNERSHIP: 4.5,
  CONTROL: 4.5,
  LEGAL_STRUCTURE: 4,
  BUSINESS: 3,
  FINANCIAL: 3,
  INVESTMENT: 3,
  POLITICAL: 3,
  PROFESSIONAL: 2.5,
  GOVERNMENT: 2.5,
  SOCIAL: 2,
  REGULATORY: 2,
  TRANSACTIONAL: 1.5,
};

export const FREQUENCY_WEIGHT = {
  MONTHLY: 3,
  QUARTERLY: 2,
  SEMI_ANNUAL: 1.5,
  ANNUAL: 1,
};

export function structuralEdgeWeight(edge) {
  const key = String(edge.relationType ?? "").toUpperCase();
  return STRUCTURAL_RELATION_WEIGHT[key] ?? 1.5;
}

/**
 * Transaction edges get one weight per occurrence — repetition between the
 * same pair (handled by the caller summing these) is what signals a real
 * behavioral tie, not any single transaction's size. Amount only
 * contributes a capped, log-scaled nudge so a single large transfer can't
 * outweigh a pattern of frequent, purposeful contact.
 */
export function transactionEdgeWeight(edge) {
  const freq = FREQUENCY_WEIGHT[edge.frequency] ?? 1;
  const usd = toUsd(edge.amount, edge.currency);
  const amountFactor = Math.min(1, Math.log10(1 + Math.max(0, usd)) / 7);
  return 1 + freq * 0.6 + amountFactor * 0.8;
}

// ── Community labeling ──────────────────────────────────────────────────
// Each category is scored by how often its patterns match the community's
// aggregated signal text (relationTypes, purposes, riskFlags, roles,
// relationshipToParent). Labels are picked, never assigned up front.
// Signal text is normalized (underscores -> spaces) before matching, so
// patterns are written with spaces even though the raw fields use
// SCREAMING_SNAKE_CASE (e.g. "PARTY_LEADER" becomes "PARTY LEADER").
const CATEGORY_DEFINITIONS = [
  {
    label: "Family & Personal",
    patterns: [
      /\bFAMILY\b/,
      /\bSPOUSE\b|\bPARENT\b|\bCHILD\b|\bSIBLING\b|\bSON\b|\bDAUGHTER\b|\bSISTER\b|\bBROTHER\b/,
      /PEP FAMILY/,
      /\bPERSONAL\b/,
    ],
  },
  {
    label: "Political Network",
    patterns: [/\bPOLITICAL\b/, /PEP TO ASSOCIATE/, /CAMPAIGN|PARTY LEADER|CABINET|DIPLOMATIC/, /\bGOVERNMENT\b/],
  },
  {
    label: "Financial & Banking",
    patterns: [/\bFINANCIAL\b/, /\bBANK/, /BANKING TRANSACTION|FUND INVESTMENT|ACCOUNT DEPOSIT/, /INSURANCE|FINTECH|CENTRAL BANK/],
  },
  {
    label: "Offshore & Legal Structures",
    patterns: [/LEGAL STRUCTURE/, /\bTRUST\b|\bSHELL\b|NOMINEE/, /OFFSHORE|SHELL TRANSFER/],
  },
  {
    label: "Charitable & NGO",
    patterns: [/\bNGO\b/, /FOUNDATION|CHARIT/, /\bGRANT/],
  },
  {
    label: "Business & Ownership",
    patterns: [
      /\bOWNERSHIP\b|\bCONTROL\b/,
      /SUBSIDIARY|OWNED ENTITY|INTER COMPANY|CORPORATE PARTNERSHIP|RELATED PARTY/,
      /\bBUSINESS\b/,
    ],
  },
  {
    label: "Investment & Funds",
    patterns: [/\bINVESTMENT\b/, /FUND INVESTMENT|FUND SUBSCRIPTION/, /PORTFOLIO|PRIVATE EQUITY|PENSION FUND/],
  },
  {
    label: "Trade & Professional Services",
    patterns: [/\bPROFESSIONAL\b/, /CONSULT|ADVISOR|AUDITOR|VENDOR|SUPPLIER/, /INTERNATIONAL TRADE|EXPORT/],
  },
];

const MIN_LABEL_CONFIDENCE = 0.2;

/**
 * communities: Map<partyId, communityId>
 * normalizedGraph: { partyById, allEdges } from normalizeGraphData
 *
 * Returns Map<communityId, { id, label, size, memberIds, confidence }>
 */
export function labelCommunities(communities, normalizedGraph) {
  const buckets = new Map();

  const bucketFor = (commId) => {
    if (!buckets.has(commId)) buckets.set(commId, { id: commId, memberIds: [], texts: [] });
    return buckets.get(commId);
  };

  for (const [partyId, commId] of communities) {
    const bucket = bucketFor(commId);
    bucket.memberIds.push(partyId);
    const party = normalizedGraph.partyById.get(partyId);
    if (party) {
      bucket.texts.push(party.partyType, party.role, party.relationshipToParent, party.relationType);
    }
  }

  for (const e of normalizedGraph.allEdges) {
    const cs = communities.get(e.source);
    const ct = communities.get(e.target);
    if (cs != null && buckets.has(cs)) {
      bucketFor(cs).texts.push(e.relationType, e.purpose, e.riskFlag, e.relationshipToParent);
    }
    if (ct != null && ct !== cs && buckets.has(ct)) {
      bucketFor(ct).texts.push(e.relationType, e.purpose, e.riskFlag, e.relationshipToParent);
    }
  }

  const result = new Map();
  for (const bucket of buckets.values()) {
    const text = bucket.texts.filter(Boolean).join(" | ").toUpperCase().replace(/_/g, " ");
    let best = null;
    for (const cat of CATEGORY_DEFINITIONS) {
      const hits = cat.patterns.reduce((sum, re) => sum + (text.match(re) ? 1 : 0), 0);
      const score = hits / cat.patterns.length;
      if (!best || score > best.score) best = { label: cat.label, score };
    }
    const label =
      best && best.score >= MIN_LABEL_CONFIDENCE
        ? best.label
        : bucket.memberIds.length === 1
          ? normalizedGraph.partyById.get(bucket.memberIds[0])?.label || "Behavioral Cluster"
          : "Behavioral Cluster";

    result.set(bucket.id, {
      id: bucket.id,
      label,
      size: bucket.memberIds.length,
      memberIds: bucket.memberIds,
      confidence: best?.score ?? 0,
    });
  }
  return result;
}

// Muted, low-saturation palette for optional cluster hulls/labels — kept
// visually secondary to the existing node/edge design.
const CLUSTER_PALETTE = [
  "100,116,139", // slate
  "180,83,9", // amber-ish
  "37,99,235", // blue
  "22,163,74", // green
  "168,85,247", // purple
  "220,38,38", // red
  "13,148,136", // teal
  "202,138,4", // yellow
  "219,39,119", // pink
  "75,85,99", // gray
];

export function clusterColor(index) {
  return CLUSTER_PALETTE[index % CLUSTER_PALETTE.length];
}
