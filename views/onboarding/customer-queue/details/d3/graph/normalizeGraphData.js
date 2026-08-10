/**
 * Normalizes the render-ready {nodes, edges} produced by transformToGraph
 * into a shape the behavioral-clustering pipeline can consume.
 *
 * transformToGraph already does the hard part: it walks demo.json's
 * `children[]` recursively, dedupes parties by partyId, and resolves
 * transaction `from`/`to` names to partyIds. Re-parsing the raw JSON a
 * second time here would just duplicate that logic, so this module treats
 * that output as the canonical party/entity registry and only adds the
 * lookups/splits the clustering stages need (id map, name map, edges split
 * by RELATIONSHIP vs TRANSACTION).
 *
 * Nothing here mutates `nodes`/`edges` — it builds new Maps/arrays that
 * only reference them for reads.
 */

function idOf(v) {
  return v && typeof v === "object" ? v.id : v;
}

export function normalizeGraphData(nodes, edges) {
  const partyById = new Map();
  const partyByName = new Map();

  for (const n of nodes ?? []) {
    partyById.set(n.id, n);
    partyByName.set(n.label, n.id);
  }

  const structuralEdges = [];
  const transactionEdges = [];

  for (const e of edges ?? []) {
    const source = idOf(e.source);
    const target = idOf(e.target);
    if (!source || !target || source === target) continue;
    if (!partyById.has(source) || !partyById.has(target)) continue;

    const rec = { ...e, source, target };
    if (e.type === "TRANSACTION") transactionEdges.push(rec);
    else structuralEdges.push(rec);
  }

  return {
    partyById,
    partyByName,
    structuralEdges,
    transactionEdges,
    allEdges: [...structuralEdges, ...transactionEdges],
  };
}
