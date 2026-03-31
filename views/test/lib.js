import { Position } from "@xyflow/react";

/**
 * Convert party data to React Flow nodes and edges
 * @param {Object} data - The party data object
 * @param {Object} options - Configuration options
 * @returns {Object} { nodes, edges }
 */
function convertToReactFlowData(data, options = {}) {
  const {
    startPosition = { x: 250, y: 50 },
    horizontalSpacing = 300,
    verticalSpacing = 150,
    levelSpacing = 200,
    showTransactions = true,
    transactionNodeSpacing = 100,
  } = options;

  const nodes = [];
  const edges = [];
  const processedParties = new Map();
  let transactionNodes = new Map();

  /**
   * Get node type styling based on party type and risk
   */
  function getNodeStyle(party) {
    const styles = {
      INDIVIDUAL: {
        background:
          party.riskRating === "HIGH"
            ? "#ffebee"
            : party.riskRating === "MEDIUM"
              ? "#fff3e0"
              : "#e8f5e9",
        border:
          party.riskRating === "HIGH"
            ? "2px solid #f44336"
            : party.riskRating === "MEDIUM"
              ? "2px solid #ff9800"
              : "2px solid #4caf50",
        icon: "👤",
      },
      BUSINESS: {
        background: "#e3f2fd",
        border: "2px solid #2196f3",
        icon: "🏢",
      },
      LEGAL_ENTITY: {
        background: "#f3e5f5",
        border: "2px solid #9c27b0",
        icon: "⚖️",
      },
    };
    return styles[party.partyType] || styles.INDIVIDUAL;
  }

  /**
   * Calculate position for party nodes in a tree layout
   */
  function calculatePosition(level, index, totalInLevel, parentPosition = null) {
    if (parentPosition) {
      // Child node - position below parent with some offset
      return {
        x: parentPosition.x + (index - totalInLevel / 2) * horizontalSpacing,
        y: parentPosition.y + verticalSpacing,
      };
    }
    // Root level - center position
    const startX = startPosition.x;
    const startY = startPosition.y + level * levelSpacing;
    const offsetX = (index - totalInLevel / 2) * horizontalSpacing;
    return { x: startX + offsetX, y: startY };
  }

  /**
   * Recursively process parties and create nodes
   */
  function processParty(
    party,
    parentId = null,
    level = 0,
    siblingsCount = 1,
    siblingIndex = 0,
    parentPosition = null,
  ) {
    if (processedParties.has(party.partyId)) return;

    // Calculate position
    let position;
    if (parentPosition) {
      // For children, position relative to parent
      const childCount = party.children?.length || 0;
      position = calculatePosition(level, siblingIndex, siblingsCount, parentPosition);
    } else {
      position = calculatePosition(level, siblingIndex, siblingsCount);
    }

    const style = getNodeStyle(party);

    // Create party node
    const partyNode = {
      id: party.partyId,
      type: "partyNode",
      position: position,
      data: {
        label: party.partyName,
        partyId: party.partyId,
        partyType: party.partyType,
        riskRating: party.riskRating,
        role: party.role,
        status: party.status,
        ipAddress: party.ipAddress,
        nationality: party.nationality,
        dateOfBirth: party.dateOfBirth,
        politicalPosition: party.politicalPosition,
        screeningStatus: party.screeningStatus,
        ownershipPercentage: party.ownershipPercentage,
        registeredCountry: party.registeredCountry,
        relationshipToParent: party.relationshipToParent,
        transactionCount: party.transactions?.length || 0,
        totalTransactionVolume: calculateTotalVolume(party.transactions),
        icon: style.icon,
        style: {
          background: style.background,
          border: style.border,
          borderRadius: "8px",
          padding: "10px",
          width: "200px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        },
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };

    nodes.push(partyNode);
    processedParties.set(party.partyId, partyNode);

    // Create edge from parent if exists
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${party.partyId}`,
        source: parentId,
        target: party.partyId,
        type: "smoothstep",
        animated: party.riskRating === "HIGH",
        style: { stroke: party.riskRating === "HIGH" ? "#f44336" : "#888", strokeWidth: 2 },
        label: party.relationshipToParent || party.relationType,
        labelStyle: { fill: "#666", fontSize: 10 },
        labelBgStyle: { fill: "white", fillOpacity: 0.7 },
        data: {
          relationshipType: party.relationType,
          specificRelationship: party.relationshipToParent,
        },
      });
    }

    // Process transactions as child nodes if enabled
    if (showTransactions && party.transactions && party.transactions.length > 0) {
      const transactionStartY = partyNode.position.y + 100;
      const transactionStartX = partyNode.position.x;

      party.transactions.forEach((transaction, idx) => {
        const transactionId = `txn-${transaction.transactionId}`;

        if (!transactionNodes.has(transactionId)) {
          const transactionNode = {
            id: transactionId,
            type: "transactionNode",
            position: {
              x: transactionStartX + (idx - party.transactions.length / 2) * transactionNodeSpacing,
              y: transactionStartY,
            },
            data: {
              label: `${transaction.type === "INCOMING" ? "⬇️" : "⬆️"} ${transaction.amount} ${transaction.currency}`,
              transactionId: transaction.transactionId,
              amount: transaction.amount,
              currency: transaction.currency,
              from: transaction.from,
              to: transaction.to,
              type: transaction.type,
              purpose: transaction.purpose,
              frequency: transaction.frequency,
              riskFlag: transaction.riskFlag,
              dateRange: transaction.dateRange,
              style: {
                background: transaction.riskFlag?.includes("PEP") ? "#ffebee" : "#f5f5f5",
                border: transaction.riskFlag?.includes("PEP")
                  ? "1px solid #f44336"
                  : "1px solid #ccc",
                borderRadius: "4px",
                padding: "5px",
                width: "150px",
                fontSize: "10px",
              },
            },
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
          };

          nodes.push(transactionNode);
          transactionNodes.set(transactionId, transactionNode);

          // Create edge between party and transaction
          edges.push({
            id: `edge-${party.partyId}-${transactionId}`,
            source: party.partyId,
            target: transactionId,
            type: "smoothstep",
            animated: transaction.riskFlag?.includes("PEP"),
            style: {
              stroke: transaction.type === "INCOMING" ? "#4caf50" : "#ff9800",
              strokeWidth: 1.5,
              strokeDasharray: transaction.riskFlag?.includes("PEP") ? "5,5" : "none",
            },
            label: transaction.type,
            labelStyle: { fill: "#666", fontSize: 8 },
            data: {
              transactionType: transaction.type,
              amount: transaction.amount,
            },
          });
        }
      });
    }

    // Process children recursively
    if (party.children && party.children.length > 0) {
      const childCount = party.children.length;
      party.children.forEach((child, idx) => {
        processParty(child, party.partyId, level + 1, childCount, idx, partyNode.position);
      });
    }
  }

  // Helper function to calculate total transaction volume
  function calculateTotalVolume(transactions) {
    if (!transactions) return 0;
    return transactions.reduce((total, txn) => total + txn.amount, 0);
  }

  // Start processing from root
  processParty(data);

  // Add connection edges between parties through transactions
  if (showTransactions) {
    addTransactionConnectionEdges();
  }

  /**
   * Add edges connecting parties through shared transactions
   */
  function addTransactionConnectionEdges() {
    const transactionMap = new Map();

    // Group transactions by transaction ID across all parties
    nodes.forEach((node) => {
      if (node.type === "transactionNode") {
        const txnId = node.data.transactionId;
        if (!transactionMap.has(txnId)) {
          transactionMap.set(txnId, {
            transaction: node,
            parties: [],
          });
        }
      }
    });

    // Find parties connected to each transaction
    nodes.forEach((node) => {
      if (node.type === "partyNode") {
        const partyData = processedParties.get(node.id);
        if (partyData && partyData.data.transactions) {
          partyData.data.transactions.forEach((txn) => {
            if (transactionMap.has(txn.transactionId)) {
              const txnData = transactionMap.get(txn.transactionId);
              if (!txnData.parties.includes(node.id)) {
                txnData.parties.push(node.id);
              }
            }
          });
        }
      }
    });

    // Create edges between parties that share transactions
    transactionMap.forEach((txnData, txnId) => {
      if (txnData.parties.length >= 2) {
        for (let i = 0; i < txnData.parties.length - 1; i++) {
          for (let j = i + 1; j < txnData.parties.length; j++) {
            const edgeId = `connection-${txnData.parties[i]}-${txnData.parties[j]}-${txnId}`;

            // Check if edge already exists
            const edgeExists = edges.some((e) => e.id === edgeId);
            if (!edgeExists) {
              edges.push({
                id: edgeId,
                source: txnData.parties[i],
                target: txnData.parties[j],
                type: "bezier",
                animated: true,
                style: { stroke: "#ff9800", strokeWidth: 1, strokeDasharray: "5,5" },
                label: "Transaction Connection",
                labelStyle: { fill: "#ff9800", fontSize: 8 },
                data: {
                  transactionId: txnId,
                  transaction: txnData.transaction.data,
                },
              });
            }
          }
        }
      }
    });
  }

  return { nodes, edges };
}

/**
 * Generate React Flow nodes with automatic layout using dagre
 */
function convertWithDagreLayout(data, options = {}) {
  const {
    direction = "TB", // TB (top-bottom) or LR (left-right)
    nodeWidth = 200,
    nodeHeight = 100,
  } = options;

  const { nodes, edges } = convertToReactFlowData(data, { showTransactions: false });

  // Use dagre for automatic layout
  const dagre = require("@dagrejs/dagre");
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(g);

  // Update node positions
  nodes.forEach((node) => {
    const nodeWithPosition = g.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
}

/**
 * Create custom node components for React Flow
 */
const customNodeTypes = {
  partyNode: ({ data }) => (
    <div style={data.style}>
      <div style={{ fontSize: "20px", textAlign: "center" }}>{data.icon}</div>
      <div style={{ fontWeight: "bold", fontSize: "12px", textAlign: "center" }}>{data.label}</div>
      <div style={{ fontSize: "10px", marginTop: "5px" }}>
        <div>ID: {data.partyId}</div>
        <div>Type: {data.partyType}</div>
        <div>Risk: {data.riskRating}</div>
        {data.transactionCount > 0 && <div>💰 {data.transactionCount} txn(s)</div>}
        {data.totalTransactionVolume > 0 && (
          <div>💵 ${data.totalTransactionVolume.toLocaleString()}</div>
        )}
      </div>
    </div>
  ),

  transactionNode: ({ data }) => (
    <div style={data.style}>
      <div style={{ fontWeight: "bold", fontSize: "11px" }}>{data.label}</div>
      <div style={{ fontSize: "9px", marginTop: "3px" }}>
        <div>
          {data.from} → {data.to}
        </div>
        <div>{data.purpose}</div>
        <div style={{ color: data.riskFlag?.includes("PEP") ? "#f44336" : "#666" }}>
          ⚠️ {data.riskFlag}
        </div>
      </div>
    </div>
  ),
};

// Export everything
export { convertToReactFlowData, convertWithDagreLayout, customNodeTypes };
