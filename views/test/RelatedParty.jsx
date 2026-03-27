import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { convertToReactFlowData, customNodeTypes } from "./lib";
import partyData from "../onboarding/customer-queue/details/demo.json";

function PartyFlowDiagram() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!partyData) return { nodes: [], edges: [] };
    return convertToReactFlowData(partyData, {
      showTransactions: true,
      horizontalSpacing: 300,
      verticalSpacing: 150,
    });
  }, [partyData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Update nodes when party data changes
  React.useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const nodeTypes = useMemo(() => customNodeTypes, []);
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  //   [],
  // );

  return (
    <div className="w-full h-[80vh] border rounded-md">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          // defaultEdgeOptions={{
          //   type: "smoothstep",
          //   animated: true,
          //   style: { stroke: "#888", strokeWidth: 2 },
          // }}
        >
          <Background />
          <Controls />
          <MiniMap
          // nodeStrokeWidth={3}
          // zoomable
          // pannable
          // nodeColor={(node) => {
          //   if (node.type === "partyNode") {
          //     return node.data.riskRating === "HIGH"
          //       ? "#ffebee"
          //       : node.data.riskRating === "MEDIUM"
          //         ? "#fff3e0"
          //         : "#e8f5e9";
          //   }
          //   return "#f5f5f5";
          // }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default PartyFlowDiagram;
