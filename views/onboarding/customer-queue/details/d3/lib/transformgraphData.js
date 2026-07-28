// Recursively flatten the tree into nodes + edges
export function transformToGraph(data) {
  const nodes = [];
  const edges = [];

  function walk(node, depth) {
    nodes.push({
      id: node.partyId,
      label: node.partyName,
      partyType: node.partyType,
      role: node.role,
      riskRating: node.riskRating ?? "LOW",
      relationType: node.relationType,
      depth,
    });

    for (const child of node.children ?? []) {
      edges.push({
        source: node.partyId,
        target: child.partyId,
        relationType: child.relationType ?? "UNKNOWN",
        amount: child.transactions?.[0]?.amount,
      });
      walk(child, depth + 1);
    }
  }

  walk(data, 0);
  return { nodes, edges };
}
