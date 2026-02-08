"use client";

import React from "react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function getRiskColor(risk) {
  switch (risk) {
    case "LOW":
      return "#22c55e";
    case "MEDIUM":
      return "#f59e0b";
    case "HIGH":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

function getTypeColor(type) {
  switch (type) {
    case "INDIVIDUAL":
      return "#0ea5e9";
    case "BUSINESS":
      return "#a855f7";
    default:
      return "#6b7280";
  }
}

function flattenTree(node, parentId, depth, nodes, links) {
  const flatNode = {
    id: node.partyId,
    name: node.partyName,
    partyType: node.partyType,
    role: node.role,
    riskRating: node.riskRating,
    status: node.status,
    relationship: node.relationshipToParent,
    x: 0,
    y: 0,
    depth,
    parentId,
    childIds: node.children.map((c) => c.partyId),
  };

  nodes.set(node.partyId, flatNode);

  if (parentId) {
    links.push({ sourceId: parentId, targetId: node.partyId });
  }

  for (const child of node.children) {
    flattenTree(child, node.partyId, depth + 1, nodes, links);
  }
}

function layoutTree(nodes, rootId, width, height) {
  const depthMap = new Map();
  for (const [id, node] of nodes) {
    if (!depthMap.has(node.depth)) depthMap.set(node.depth, []);
    depthMap.get(node.depth).push(id);
  }

  const maxDepth = Math.max(...depthMap.keys());
  const verticalSpacing = height / (maxDepth + 2);

  for (const [depth, ids] of depthMap) {
    const horizontalSpacing = width / (ids.length + 1);
    ids.forEach((id, index) => {
      const node = nodes.get(id);
      node.x = horizontalSpacing * (index + 1);
      node.y = verticalSpacing * (depth + 1);
    });
  }
}

function getDescendantIds(nodes, nodeId) {
  const descendants = new Set();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    const node = nodes.get(current);
    if (node) {
      for (const childId of node.childIds) {
        descendants.add(childId);
        queue.push(childId);
      }
    }
  }
  return descendants;
}

export function PartyTreeGraph({ data }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(500, rect.height) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { nodes, links } = useMemo(() => {
    const nodes = new Map();
    const links = [];
    flattenTree(data, null, 0, nodes, links);
    layoutTree(nodes, data.partyId, dimensions.width, dimensions.height);
    return { nodes, links };
  }, [data, dimensions]);

  const highlightedIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const descendants = getDescendantIds(nodes, selectedNodeId);
    descendants.add(selectedNodeId);
    return descendants;
  }, [selectedNodeId, nodes]);

  const highlightedLinks = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const descendants = getDescendantIds(nodes, selectedNodeId);
    const linkKeys = new Set();
    for (const link of links) {
      if (
        (link.sourceId === selectedNodeId && descendants.has(link.targetId)) ||
        (descendants.has(link.sourceId) && descendants.has(link.targetId))
      ) {
        linkKeys.add(`${link.sourceId}-${link.targetId}`);
      }
    }
    return linkKeys;
  }, [selectedNodeId, links, nodes]);

  const handleNodeClick = useCallback((nodeId) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const handleNodeHover = useCallback(
    (nodeId, event) => {
      setHoveredNodeId(nodeId);
      if (nodeId && event && nodes.has(nodeId)) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          setTooltip({
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top - 12,
            node: nodes.get(nodeId),
          });
        }
      } else {
        setTooltip(null);
      }
    },
    [nodes],
  );

  const nodeRadius = 32;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px]">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#334155" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#0ea5e9" />
          </marker>
        </defs>

        {/* Links */}
        {links.map((link) => {
          const source = nodes.get(link.sourceId);
          const target = nodes.get(link.targetId);
          const linkKey = `${link.sourceId}-${link.targetId}`;
          const isHighlighted = highlightedLinks.has(linkKey);
          const isActive = selectedNodeId !== null;
          const isDimmed = isActive && !isHighlighted;

          const midY = (source.y + target.y) / 2;

          return (
            <g key={linkKey}>
              <path
                d={`M ${source.x} ${source.y + nodeRadius} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y - nodeRadius}`}
                fill="none"
                stroke={isHighlighted ? "#0ea5e9" : "#1e293b"}
                strokeWidth={isHighlighted ? 3 : 1.5}
                opacity={isDimmed ? 0.15 : 1}
                filter={isHighlighted ? "url(#glow)" : undefined}
                className="transition-all duration-500"
                markerEnd={isHighlighted ? "url(#arrowhead-active)" : "url(#arrowhead)"}
              />
              {/* Relationship label */}
              {target.x !== undefined && (
                <text
                  x={(source.x + target.x) / 2}
                  y={midY - 6}
                  textAnchor="middle"
                  fill={isHighlighted ? "#94a3b8" : "#475569"}
                  fontSize="11"
                  fontFamily="var(--font-sans), sans-serif"
                  opacity={isDimmed ? 0.15 : 1}
                  className="transition-all duration-500 pointer-events-none select-none"
                >
                  {nodes.get(link.targetId)?.relationship || ""}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {Array.from(nodes.values()).map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isHighlighted = highlightedIds.has(node.id);
          const isActive = selectedNodeId !== null;
          const isDimmed = isActive && !isHighlighted;
          const isHovered = hoveredNodeId === node.id;
          const typeColor = getTypeColor(node.partyType);
          const riskColor = getRiskColor(node.riskRating);

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-all duration-500"
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={(e) => handleNodeHover(node.id, e)}
              onMouseLeave={() => handleNodeHover(null)}
              opacity={isDimmed ? 0.2 : 1}
            >
              {/* Outer ring glow for selected */}
              {isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius + 8}
                  fill="none"
                  stroke={typeColor}
                  strokeWidth="2"
                  opacity="0.4"
                  filter="url(#glow-strong)"
                  className="animate-pulse"
                />
              )}

              {/* Outer ring for highlighted children */}
              {isHighlighted && !isSelected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius + 4}
                  fill="none"
                  stroke={typeColor}
                  strokeWidth="1.5"
                  opacity="0.5"
                  filter="url(#glow)"
                />
              )}

              {/* Background circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={isSelected ? typeColor : "#0f172a"}
                stroke={isHighlighted ? typeColor : isHovered ? "#475569" : "#1e293b"}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                filter={isHighlighted ? "url(#glow)" : undefined}
                className="transition-all duration-300"
              />

              {/* Risk rating indicator */}
              <circle
                cx={node.x + nodeRadius * 0.65}
                cy={node.y - nodeRadius * 0.65}
                r={6}
                fill={riskColor}
                stroke="#0f172a"
                strokeWidth="2"
              />

              {/* Status indicator */}
              {node.status === "INACTIVE" && (
                <circle
                  cx={node.x - nodeRadius * 0.65}
                  cy={node.y - nodeRadius * 0.65}
                  r={5}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* Initials */}
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? "#0f172a" : "#e2e8f0"}
                fontSize="13"
                fontWeight="bold"
                fontFamily="var(--font-sans), sans-serif"
                className="pointer-events-none select-none"
              >
                {node.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </text>

              {/* Name label below */}
              <text
                x={node.x}
                y={node.y + nodeRadius + 16}
                textAnchor="middle"
                fill={isHighlighted ? "#e2e8f0" : "#94a3b8"}
                fontSize="12"
                fontWeight={isHighlighted ? "600" : "400"}
                fontFamily="var(--font-sans), sans-serif"
                className="pointer-events-none select-none transition-all duration-500"
              >
                {node.name}
              </text>

              {/* Role label */}
              <text
                x={node.x}
                y={node.y + nodeRadius + 30}
                textAnchor="middle"
                fill={isHighlighted ? "#64748b" : "#475569"}
                fontSize="10"
                fontFamily="var(--font-sans), sans-serif"
                className="pointer-events-none select-none transition-all duration-500"
              >
                {node.role.replace(/_/g, " ")}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 rounded-lg border border-border bg-card px-4 py-3 shadow-xl"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-sm font-semibold text-foreground">{tooltip.node.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: getTypeColor(tooltip.node.partyType) }}
            />
            <span className="text-xs text-muted-foreground">{tooltip.node.partyType}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: getRiskColor(tooltip.node.riskRating) }}
            />
            <span className="text-xs text-muted-foreground">Risk: {tooltip.node.riskRating}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Status: {tooltip.node.status}</div>
          {tooltip.node.relationship && (
            <div className="text-xs text-muted-foreground mt-1">
              Relation: {tooltip.node.relationship}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-1">ID: {tooltip.node.id}</div>
        </div>
      )}
    </div>
  );
}
