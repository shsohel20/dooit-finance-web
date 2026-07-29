// // Recursively flatten the tree into nodes + edges
// export function transformToGraph(data) {
//   const nodes = [];
//   const edges = [];

//   function walk(node, depth) {
//     nodes.push({
//       id: node.partyId,
//       label: node.partyName,
//       partyType: node.partyType,
//       role: node.role,
//       riskRating: node.riskRating ?? "LOW",
//       relationType: node.relationType,
//       depth,
//     });

//     for (const child of node.children ?? []) {
//       edges.push({
//         source: node.partyId,
//         target: child.partyId,
//         relationType: child.relationType ?? "UNKNOWN",
//         amount: child.transactions?.[0]?.amount,
//       });
//       walk(child, depth + 1);
//     }
//   }

//   walk(data, 0);
//   return { nodes, edges };
// }

export function transformToGraph(data) {
  const nodes = [];
  const edges = [];

  // Prevent duplicate party nodes
  const nodeMap = new Map();

  // Used to resolve transaction "from"/"to" names to party IDs
  const partyMap = new Map();

  function addNode(node, depth) {
    if (!node?.partyId) return;

    // Register party name -> partyId
    partyMap.set(node.partyName, node.partyId);

    if (!nodeMap.has(node.partyId)) {
      nodeMap.set(node.partyId, {
        id: node.partyId,
        label: node.partyName,
        partyType: node.partyType,
        role: node.role,
        riskRating: node.riskRating ?? "LOW",
        status: node.status,
        relationType: node.relationType,
        relationshipToParent: node.relationshipToParent,
        ownershipPercentage: node.ownershipPercentage,
        depth,
      });
    }

    // First recursively collect all parties
    for (const child of node.children ?? []) {
      addNode(child, depth + 1);
    }
  }

  function addRelationships(node) {
    if (!node?.partyId) return;

    // --------------------------------
    // Structural relationship
    // --------------------------------

    for (const child of node.children ?? []) {
      edges.push({
        id: `relationship-${node.partyId}-${child.partyId}`,
        source: node.partyId,
        target: child.partyId,

        type: "RELATIONSHIP",
        relationType: child.relationType ?? "UNKNOWN",
        relationshipToParent: child.relationshipToParent,
        ownershipPercentage: child.ownershipPercentage,
      });

      addRelationships(child);
    }

    // --------------------------------
    // Transaction relationships
    // --------------------------------

    for (const transaction of node.transactions ?? []) {
      const sourceId = partyMap.get(transaction.from);
      const targetId = partyMap.get(transaction.to);

      // Only create transaction edge when both parties
      // exist in the graph.
      if (!sourceId || !targetId) {
        return;
      }
      const isRiskyAmount = transaction.amount > 1000000;

      edges.push({
        id: transaction.transactionId,

        source: sourceId,
        target: targetId,

        type: "TRANSACTION",
        relationType:
          transaction.type === "INCOMING" ? "TRANSACTIONAL_INCOMING" : "TRANSACTIONAL_OUTGOING",

        amount: transaction.amount,
        currency: transaction.currency,
        edgeOpacity: isRiskyAmount ? 0.8 : 0.3,

        frequency: transaction.frequency,
        purpose: transaction.purpose,
        riskFlag: transaction.riskFlag,

        transactionType: transaction.type,
        dateRange: transaction.dateRange,
      });
    }
  }

  // 1. Collect all party nodes first
  addNode(data, 0);

  // 2. Then create relationships and transactions
  addRelationships(data);

  return {
    nodes: [...nodeMap.values()],
    edges,
  };
}
