import { structuralEdgeWeight, transactionEdgeWeight } from "./clusterUtils";

function pairKey(a, b) {
  return a < b ? `${a}__${b}` : `${b}__${a}`;
}

function jaccard(setA, setB) {
  if (!setA.size && !setB.size) return 0;
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

function mapJaccard(mapA, mapB) {
  return jaccard(new Set(mapA.keys()), new Set(mapB.keys()));
}

/**
 * Composite behavioral similarity in [0, 1]. Purpose/riskFlag overlap
 * dominates (what they do, and how risky it's flagged); relationType and
 * shared counterparties add a smaller boost; raw categorical matches
 * (partyType/role) are just a tiebreaker nudge.
 */
function behavioralSimilarity(fa, fb) {
  let score = 0;
  score += mapJaccard(fa.purposes, fb.purposes) * 0.28;
  score += mapJaccard(fa.riskFlags, fb.riskFlags) * 0.28;
  score += mapJaccard(fa.relationTypes, fb.relationTypes) * 0.16;
  score += mapJaccard(fa.currencies, fb.currencies) * 0.08;
  score += jaccard(fa.counterparties, fb.counterparties) * 0.12;
  if (fa.partyType && fa.partyType === fb.partyType) score += 0.04;
  if (fa.role && fa.role === fb.role) score += 0.04;
  return score;
}

/**
 * Builds the weighted undirected graph community detection runs on, among
 * non-root parties only (the root is handled separately — see
 * computeRootWeights).
 *
 * Two kinds of edges feed in:
 *  1. Direct ties — structural relationships and transactions between two
 *     parties, aggregated so repeated/frequent/high-value contact compounds
 *     into a stronger edge.
 *  2. Behavioral-similarity ties — added between parties that are NOT
 *     directly connected but look alike (same purposes, risk flags, shared
 *     counterparties, ...). Without these, parties that only ever touch the
 *     root (e.g. several unrelated banks) would each sit in their own
 *     singleton community even when they clearly belong together. Capped
 *     to each party's top-K most similar peers so this can't drown out real
 *     connectivity.
 */
export function buildWeightedGraph(
  normalizedGraph,
  features,
  rootId,
  { similarityTopK = 4, similarityMinScore = 0.28 } = {},
) {
  const weights = new Map();
  const add = (a, b, w) => {
    if (!a || !b || a === b || a === rootId || b === rootId || !w) return;
    const k = pairKey(a, b);
    weights.set(k, (weights.get(k) || 0) + w);
  };

  for (const e of normalizedGraph.structuralEdges) {
    add(e.source, e.target, structuralEdgeWeight(e));
  }
  for (const e of normalizedGraph.transactionEdges) {
    add(e.source, e.target, transactionEdgeWeight(e));
  }

  const ids = [...features.keys()];
  for (let i = 0; i < ids.length; i++) {
    const a = ids[i];
    const fa = features.get(a);
    const scored = [];
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue;
      const b = ids[j];
      const sim = behavioralSimilarity(fa, features.get(b));
      if (sim >= similarityMinScore) scored.push([b, sim]);
    }
    scored.sort((x, y) => y[1] - x[1]);
    for (const [b, sim] of scored.slice(0, similarityTopK)) {
      add(a, b, sim * 2.2);
    }
  }

  const edges = [];
  for (const [key, weight] of weights) {
    const [source, target] = key.split("__");
    edges.push({ source, target, weight });
  }
  return edges;
}

/**
 * Aggregated tie strength from each non-root party directly to the root,
 * used only to decide how close a party's community should sit to the
 * root in the final layout — never used for community membership itself.
 */
export function computeRootWeights(normalizedGraph, rootId) {
  const weights = new Map();
  const add = (id, w) => {
    if (!id || id === rootId || !w) return;
    weights.set(id, (weights.get(id) || 0) + w);
  };

  for (const e of normalizedGraph.allEdges) {
    if (e.source !== rootId && e.target !== rootId) continue;
    const other = e.source === rootId ? e.target : e.source;
    const w = e.type === "TRANSACTION" ? transactionEdgeWeight(e) : structuralEdgeWeight(e);
    add(other, w);
  }
  return weights;
}
