/**
 * Louvain community detection over a weighted, undirected graph.
 *
 * Standard two-phase algorithm (Blondel et al., 2008):
 *  1. Local moving — each node greedily joins whichever neighboring
 *     community (including staying put) most increases modularity, until
 *     no move helps.
 *  2. Aggregation — communities from phase 1 collapse into super-nodes,
 *     inter/intra-community weight becomes edge/self-loop weight on the
 *     new graph, and phase 1 repeats on that smaller graph.
 * Repeats until aggregation stops shrinking the node count.
 *
 * No external dependency: for ~200 nodes this is a couple hundred lines of
 * well-understood graph math, not worth pulling in a library for.
 */

function addSymmetric(adj, a, b, w) {
  if (a === b) {
    adj.get(a).set(a, (adj.get(a).get(a) || 0) + w);
    return;
  }
  adj.get(a).set(b, (adj.get(a).get(b) || 0) + w);
  adj.get(b).set(a, (adj.get(b).get(a) || 0) + w);
}

function buildAdjacency(nodeIds, edges) {
  const adj = new Map(nodeIds.map((id) => [id, new Map()]));
  for (const { source, target, weight } of edges) {
    if (!adj.has(source) || !adj.has(target) || source === target || !weight) continue;
    addSymmetric(adj, source, target, weight);
  }
  return adj;
}

/** Weighted degree of a node — a self-loop counts twice, per convention. */
function weightedDegree(adj, node) {
  let d = 0;
  for (const [nb, w] of adj.get(node)) d += nb === node ? 2 * w : w;
  return d;
}

/**
 * One run of phase 1 (local moving) on a given weighted graph.
 * Returns { commOf: Map<node, communityId>, improved: boolean }.
 */
function localMoving(nodes, adj, maxPasses) {
  const commOf = new Map(nodes.map((n) => [n, n]));
  const degree = new Map(nodes.map((n) => [n, weightedDegree(adj, n)]));

  let m2 = 0;
  for (const d of degree.values()) m2 += d;
  const m = m2 / 2;
  if (m === 0) return { commOf, improved: false };

  const commTot = new Map(nodes.map((n) => [n, degree.get(n)]));
  const sortedNodes = [...nodes].sort();

  let improvedAny = false;
  for (let pass = 0; pass < maxPasses; pass++) {
    let improvedThisPass = false;

    for (const n of sortedNodes) {
      const curComm = commOf.get(n);
      const ki = degree.get(n);
      commTot.set(curComm, commTot.get(curComm) - ki);

      const neighborWeight = new Map();
      for (const [nb, w] of adj.get(n)) {
        if (nb === n) continue;
        const c = commOf.get(nb);
        neighborWeight.set(c, (neighborWeight.get(c) || 0) + w);
      }

      let bestComm = curComm;
      let bestGain = 0;
      const candidates = new Set([...neighborWeight.keys(), curComm]);
      for (const c of candidates) {
        const kiIn = neighborWeight.get(c) || 0;
        const tot = commTot.get(c) || 0;
        const gain = kiIn - (tot * ki) / (2 * m);
        if (gain > bestGain) {
          bestGain = gain;
          bestComm = c;
        }
      }

      commOf.set(n, bestComm);
      commTot.set(bestComm, (commTot.get(bestComm) || 0) + ki);
      if (bestComm !== curComm) improvedThisPass = true;
    }

    if (improvedThisPass) improvedAny = true;
    else break;
  }

  return { commOf, improved: improvedAny };
}

/** Collapses `nodes`/`adj` into one super-node per community from `commOf`. */
function aggregate(nodes, adj, commOf) {
  const newNodesSet = new Set();
  for (const n of nodes) newNodesSet.add(commOf.get(n));
  const newNodes = [...newNodesSet];
  const newAdj = new Map(newNodes.map((c) => [c, new Map()]));

  for (const n of nodes) {
    const cn = commOf.get(n);
    for (const [nb, w] of adj.get(n)) {
      if (nb === n) {
        addSymmetric(newAdj, cn, cn, w);
        continue;
      }
      const cnb = commOf.get(nb);
      addSymmetric(newAdj, cn, cnb, w / 2);
    }
  }

  return { nodes: newNodes, adj: newAdj };
}

function computeModularity(nodeIds, edges, communities) {
  let m = 0;
  const degree = new Map(nodeIds.map((id) => [id, 0]));
  for (const { source, target, weight } of edges) {
    if (!degree.has(source) || !degree.has(target)) continue;
    degree.set(source, degree.get(source) + weight);
    degree.set(target, degree.get(target) + weight);
    m += weight;
  }
  if (m === 0) return 0;

  const commIn = new Map();
  const commTot = new Map();
  for (const id of nodeIds) {
    const c = communities.get(id);
    commTot.set(c, (commTot.get(c) || 0) + degree.get(id));
  }
  for (const { source, target, weight } of edges) {
    const cs = communities.get(source);
    const ct = communities.get(target);
    if (cs === ct) commIn.set(cs, (commIn.get(cs) || 0) + weight);
  }

  let Q = 0;
  const twoM = 2 * m;
  for (const c of new Set(communities.values())) {
    const in_ = commIn.get(c) || 0;
    const tot = commTot.get(c) || 0;
    Q += in_ / m - (tot / twoM) ** 2;
  }
  return Q;
}

/**
 * nodeIds: array of node ids to partition (root should already be excluded
 * by the caller — see buildBehavioralFeatures).
 * edges: [{ source, target, weight }] — from buildWeightedGraph.
 *
 * Returns { communities: Map<nodeId, communityId>, modularity, communityCount }.
 * communityId is a compact 0-based integer, stable only within this call.
 */
export function detectCommunities(nodeIds, edges, { maxPasses = 20, maxLevels = 10 } = {}) {
  if (!nodeIds.length) return { communities: new Map(), modularity: 0, communityCount: 0 };

  let membership = new Map(nodeIds.map((id) => [id, id]));
  let curNodes = [...nodeIds];
  let curAdj = buildAdjacency(curNodes, edges);

  for (let level = 0; level < maxLevels; level++) {
    const { commOf, improved } = localMoving(curNodes, curAdj, maxPasses);
    for (const [orig, cur] of membership) membership.set(orig, commOf.get(cur));
    if (!improved) break;

    const { nodes: newNodes, adj: newAdj } = aggregate(curNodes, curAdj, commOf);
    if (newNodes.length === curNodes.length) break;
    curNodes = newNodes;
    curAdj = newAdj;
  }

  const idMap = new Map();
  let next = 0;
  const communities = new Map();
  for (const [orig, comm] of membership) {
    if (!idMap.has(comm)) idMap.set(comm, next++);
    communities.set(orig, idMap.get(comm));
  }

  const modularity = computeModularity(nodeIds, edges, communities);
  return { communities, modularity, communityCount: next };
}
