import { toUsd } from "./clusterUtils";

/**
 * Builds a per-party behavioral feature record from the normalized graph:
 * counterparties, transaction purposes/riskFlags/relationTypes/currencies,
 * direction (in/out) counts and volume, plus the party's own categorical
 * attributes (partyType, role, relationshipToParent).
 *
 * The root party is excluded — it's the anchor of the whole graph, not a
 * candidate for community membership (see calculateClusterLayout).
 *
 * Returns Map<partyId, feature record>.
 */
export function buildBehavioralFeatures(normalizedGraph, rootId) {
  const features = new Map();

  const get = (id) => {
    let f = features.get(id);
    if (!f) {
      f = {
        purposes: new Map(),
        riskFlags: new Map(),
        relationTypes: new Map(),
        currencies: new Map(),
        counterparties: new Set(),
        inCount: 0,
        outCount: 0,
        inVolumeUsd: 0,
        outVolumeUsd: 0,
        txCount: 0,
        partyType: undefined,
        role: undefined,
        relationshipToParent: undefined,
      };
      features.set(id, f);
    }
    return f;
  };

  const bump = (map, key) => {
    if (!key) return;
    map.set(key, (map.get(key) || 0) + 1);
  };

  for (const e of normalizedGraph.transactionEdges) {
    if (e.source === rootId && e.target === rootId) continue;
    const s = get(e.source);
    const t = get(e.target);

    if (e.source !== rootId) s.counterparties.add(e.target);
    if (e.target !== rootId) t.counterparties.add(e.source);

    bump(s.purposes, e.purpose);
    bump(t.purposes, e.purpose);
    bump(s.riskFlags, e.riskFlag);
    bump(t.riskFlags, e.riskFlag);
    bump(s.relationTypes, e.relationType);
    bump(t.relationTypes, e.relationType);
    bump(s.currencies, e.currency);
    bump(t.currencies, e.currency);

    s.txCount += 1;
    t.txCount += 1;

    const usd = toUsd(e.amount, e.currency);
    s.outCount += 1;
    s.outVolumeUsd += usd;
    t.inCount += 1;
    t.inVolumeUsd += usd;
  }

  for (const e of normalizedGraph.structuralEdges) {
    if (e.source === rootId && e.target === rootId) continue;
    const s = get(e.source);
    const t = get(e.target);
    if (e.source !== rootId) s.counterparties.add(e.target);
    if (e.target !== rootId) t.counterparties.add(e.source);
    bump(s.relationTypes, e.relationType);
    bump(t.relationTypes, e.relationType);
  }

  for (const [id, party] of normalizedGraph.partyById) {
    if (id === rootId) continue;
    const f = get(id);
    f.partyType = party.partyType;
    f.role = party.role;
    f.relationshipToParent = party.relationshipToParent;
    f.ownRelationType = party.relationType;
  }

  features.delete(rootId);
  return features;
}
