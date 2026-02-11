"use client";

import React from "react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ─── Helpers ──────────────────────────────────────────── */

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
    case "LEGAL_ENTITY":
      return "#14b8a6";
    default:
      return "#6b7280";
  }
}

/* Build full tree registry with path-based unique keys */
function buildRegistry(node, parentKey, depth, registry, allLinks) {
  const uniqueKey = parentKey ? `${parentKey}>${node.partyId}` : node.partyId;
  const childKeys = node.children.map((c) => `${uniqueKey}>${c.partyId}`);

  registry.set(uniqueKey, {
    uniqueKey,
    id: node.partyId,
    name: node.partyName,
    partyType: node.partyType,
    role: node.role,
    riskRating: node.riskRating,
    status: node.status,
    relationship: node.relationshipToParent,
    depth,
    parentKey,
    childKeys,
    hasChildren: node.children.length > 0,
  });

  if (parentKey) {
    allLinks.push({
      sourceKey: parentKey,
      targetKey: uniqueKey,
      label: node.relationshipToParent || "",
    });
  }

  for (const child of node.children) {
    buildRegistry(child, uniqueKey, depth + 1, registry, allLinks);
  }
}

/* ─── Radial layout for visible nodes ──────────────────── */

function computeRadialPositions(registry, expandedKeys, rootKey, cx, cy, baseRadius) {
  const positions = new Map();

  // Place root at center
  positions.set(rootKey, { x: cx, y: cy });

  // BFS to place children in radial arcs
  function placeChildren(parentKey, parentAngleStart, parentAngleEnd, depth) {
    const node = registry.get(parentKey);
    if (!node || !expandedKeys.has(parentKey)) return;

    const visibleChildren = node.childKeys.filter((ck) => registry.has(ck));
    if (visibleChildren.length === 0) return;

    const radius = baseRadius * depth;
    const arcSpan = parentAngleEnd - parentAngleStart;
    const step = arcSpan / visibleChildren.length;

    visibleChildren.forEach((childKey, i) => {
      const angle = parentAngleStart + step * (i + 0.5);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      positions.set(childKey, { x, y });

      // Give each child a proportional arc for its own children
      const childArcStart = parentAngleStart + step * i;
      const childArcEnd = childArcStart + step;
      placeChildren(childKey, childArcStart, childArcEnd, depth + 1);
    });
  }

  placeChildren(rootKey, 0, 2 * Math.PI, 1);
  return positions;
}

/* ─── Component ────────────────────────────────────────── */

const NODE_RADIUS = 32;
const BASE_ORBIT_RADIUS = 160;

export function PartyTreeGraph({ data }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [recentlyRevealed, setRecentlyRevealed] = useState(new Set());
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Dragging state: stores user-overridden positions
  const [draggedPositions, setDraggedPositions] = useState(new Map());
  const dragRef = useRef(null);
  const hasDraggedRef = useRef(false);

  // Pan & zoom
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 600 });
  const [zoom, setZoom] = useState(1);
  const panRef = useRef(null);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width, height: Math.max(560, height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Sync viewBox with dimensions
  useEffect(() => {
    setViewBox({ x: 0, y: 0, w: dimensions.width, h: dimensions.height });
  }, [dimensions]);

  const rootKey = data.partyId;

  const { registry } = useMemo(() => {
    const registry = new Map();
    const allLinks = [];
    buildRegistry(data, null, 0, registry, allLinks);
    return { registry, allLinks };
  }, [data]);

  // Compute radial positions for visible nodes
  const radialPositions = useMemo(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    return computeRadialPositions(registry, expandedKeys, rootKey, cx, cy, BASE_ORBIT_RADIUS);
  }, [registry, expandedKeys, rootKey, dimensions]);

  // Merge radial positions with drag overrides
  const nodePositions = useMemo(() => {
    const merged = new Map();
    for (const [key, pos] of radialPositions) {
      const override = draggedPositions.get(key);
      merged.set(key, override ?? pos);
    }
    return merged;
  }, [radialPositions, draggedPositions]);

  // Get visible links
  const visibleLinks = useMemo(() => {
    const links = [];
    for (const key of nodePositions.keys()) {
      const node = registry.get(key);
      if (node?.parentKey && nodePositions.has(node.parentKey)) {
        links.push({
          sourceKey: node.parentKey,
          targetKey: key,
          label: node.relationship || "",
        });
      }
    }
    return links;
  }, [nodePositions, registry]);

  /* ─── Node click (expand/collapse) ──────────────────── */
  const handleNodeClick = useCallback(
    (key) => {
      // Skip click if we just finished a drag
      if (hasDraggedRef.current) {
        hasDraggedRef.current = false;
        return;
      }
      const node = registry.get(key);
      if (!node || !node.hasChildren) return;

      setExpandedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          // Collapse this + all descendants
          next.delete(key);
          const removeDescendants = (k) => {
            const n = registry.get(k);
            if (n) {
              for (const ck of n.childKeys) {
                next.delete(ck);
                removeDescendants(ck);
              }
            }
          };
          removeDescendants(key);

          // Clear drag overrides for collapsed children
          setDraggedPositions((prev) => {
            const next = new Map(prev);
            const removePositions = (k) => {
              const n = registry.get(k);
              if (n) {
                for (const ck of n.childKeys) {
                  next.delete(ck);
                  removePositions(ck);
                }
              }
            };
            removePositions(key);
            return next;
          });
        } else {
          next.add(key);
          if (node) {
            setRecentlyRevealed(new Set(node.childKeys));
            setTimeout(() => setRecentlyRevealed(new Set()), 500);
          }
        }
        return next;
      });
    },
    [registry],
  );

  /* ─── Node drag ─────────────────────────────────────── */
  const screenToSVG = useCallback(
    (clientX, clientY) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { x: clientX, y: clientY };
      const sx = viewBox.w / rect.width;
      const sy = viewBox.h / rect.height;
      return {
        x: viewBox.x + (clientX - rect.left) * sx,
        y: viewBox.y + (clientY - rect.top) * sy,
      };
    },
    [viewBox],
  );

  const handlePointerDown = useCallback(
    (key, e) => {
      e.stopPropagation();
      e.target.setPointerCapture(e.pointerId);
      const svgPt = screenToSVG(e.clientX, e.clientY);
      const pos = nodePositions.get(key);
      if (!pos) return;
      dragRef.current = {
        key,
        startMouse: svgPt,
        startPos: { ...pos },
      };
      hasDraggedRef.current = false;
    },
    [screenToSVG, nodePositions],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (dragRef.current) {
        const svgPt = screenToSVG(e.clientX, e.clientY);
        const dx = svgPt.x - dragRef.current.startMouse.x;
        const dy = svgPt.y - dragRef.current.startMouse.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasDraggedRef.current = true;
        }
        const newPos = {
          x: dragRef.current.startPos.x + dx,
          y: dragRef.current.startPos.y + dy,
        };
        setDraggedPositions((prev) => {
          const next = new Map(prev);
          next.set(dragRef.current.key, newPos);
          return next;
        });
        return;
      }
      // Canvas pan
      if (panRef.current) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const sx = viewBox.w / rect.width;
        const sy = viewBox.h / rect.height;
        const dx = (e.clientX - panRef.current.startMouse.x) * sx;
        const dy = (e.clientY - panRef.current.startMouse.y) * sy;
        setViewBox((prev) => ({
          ...prev,
          x: panRef.current.startViewBox.x - dx,
          y: panRef.current.startViewBox.y - dy,
        }));
      }
    },
    [screenToSVG, viewBox],
  );

  const handlePointerUp = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null;
      return;
    }
    panRef.current = null;
  }, []);

  /* ─── Canvas pan ────────────────────────────────────── */
  const handleCanvasPointerDown = useCallback(
    (e) => {
      if (dragRef.current) return;
      panRef.current = {
        startMouse: { x: e.clientX, y: e.clientY },
        startViewBox: { x: viewBox.x, y: viewBox.y },
      };
    },
    [viewBox],
  );

  /* ─── Zoom ──────────────────────────────────────────── */
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      const newZoom = Math.max(0.3, Math.min(4, zoom * factor));

      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Zoom toward mouse position
      const mx = viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.w;
      const my = viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.h;

      const newW = dimensions.width / newZoom;
      const newH = dimensions.height / newZoom;
      setViewBox({
        x: mx - ((mx - viewBox.x) / viewBox.w) * newW,
        y: my - ((my - viewBox.y) / viewBox.h) * newH,
        w: newW,
        h: newH,
      });
      setZoom(newZoom);
    },
    [zoom, viewBox, dimensions],
  );

  /* ─── Tooltip ───────────────────────────────────────── */
  const handleNodeHover = useCallback(
    (key, event) => {
      setHoveredKey(key);
      if (key && event) {
        const node = registry.get(key);
        if (node) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top - 14,
              node,
            });
          }
        }
      } else {
        setTooltip(null);
      }
    },
    [registry],
  );

  /* ─── Render ────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[560px] select-none overflow-hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Links */}
        {visibleLinks.map((link) => {
          const s = nodePositions.get(link.sourceKey);
          const t = nodePositions.get(link.targetKey);
          if (!s || !t) return null;

          const isNew = recentlyRevealed.has(link.targetKey);
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);

          // Shorten line by node radius on each end
          const sx = s.x + nx * NODE_RADIUS;
          const sy = s.y + ny * NODE_RADIUS;
          const tx = t.x - nx * NODE_RADIUS;
          const ty = t.y - ny * NODE_RADIUS;

          // Curve control point (perpendicular offset)
          const mx = (sx + tx) / 2;
          const my = (sy + ty) / 2;
          const curvature = 0.2;
          const cpx = mx + -ny * dist * curvature;
          const cpy = my + nx * dist * curvature;

          // Label position along curve
          const lx = 0.25 * sx + 0.5 * cpx + 0.25 * tx;
          const ly = 0.25 * sy + 0.5 * cpy + 0.25 * ty;

          return (
            <g
              key={`${link.sourceKey}~${link.targetKey}`}
              className={isNew ? "animate-fade-in-link" : ""}
            >
              <path
                d={`M ${sx} ${sy} Q ${cpx} ${cpy} ${tx} ${ty}`}
                fill="none"
                stroke="#334155"
                strokeWidth={1.5}
                opacity={isNew ? 0 : 0.7}
                style={
                  isNew
                    ? {
                        animation: "fadeInLink 0.5s ease-out forwards",
                      }
                    : undefined
                }
              />
              {/* Arrow head */}
              <circle cx={tx} cy={ty} r={3} fill="#475569" opacity={0.6} />

              {/* Relationship label */}
              {link.label && (
                <text
                  x={lx}
                  y={ly - 6}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                  fontWeight="500"
                  className="pointer-events-none"
                  opacity={isNew ? 0 : 0.85}
                  style={
                    isNew
                      ? {
                          animation: "fadeInLink 0.5s ease-out 0.15s forwards",
                        }
                      : undefined
                  }
                >
                  {link.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {Array.from(nodePositions.entries()).map(([key, pos]) => {
          const node = registry.get(key);
          if (!node) return null;

          const isExpanded = expandedKeys.has(key);
          const isHovered = hoveredKey === key;
          const isNew = recentlyRevealed.has(key);
          const typeColor = getTypeColor(node.partyType);
          const riskColor = getRiskColor(node.riskRating);
          const initials = node.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);

          return (
            <g
              key={key}
              className="cursor-pointer"
              onPointerDown={(e) => handlePointerDown(key, e)}
              onClick={() => handleNodeClick(key)}
              onMouseEnter={(e) => handleNodeHover(key, e)}
              onMouseLeave={() => handleNodeHover(null)}
              style={
                isNew
                  ? {
                      animation: "fadeInNode 0.45s ease-out forwards",
                      opacity: 0,
                    }
                  : { opacity: 1 }
              }
            >
              {/* Outer glow ring when expanded */}
              {isExpanded && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_RADIUS + 10}
                    fill="none"
                    stroke={typeColor}
                    strokeWidth="1"
                    opacity="0.15"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_RADIUS + 5}
                    fill="none"
                    stroke={typeColor}
                    strokeWidth="1.5"
                    opacity="0.3"
                    filter="url(#glow)"
                  />
                </>
              )}

              {/* Hover ring */}
              {isHovered && !isExpanded && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS + 4}
                  fill="none"
                  stroke={typeColor}
                  strokeWidth="1"
                  opacity="0.35"
                />
              )}

              {/* Main node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                fill={isExpanded ? typeColor : "#0f172a"}
                stroke={isExpanded ? typeColor : isHovered ? typeColor : "#1e293b"}
                strokeWidth={isExpanded ? 2.5 : 1.5}
                filter="url(#shadow)"
              />

              {/* Inner gradient-like ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS - 3}
                fill="none"
                stroke={isExpanded ? "rgba(0,0,0,0.15)" : typeColor}
                strokeWidth="0.5"
                opacity={isExpanded ? 1 : 0.2}
              />

              {/* Risk indicator dot */}
              <circle
                cx={pos.x + NODE_RADIUS * 0.62}
                cy={pos.y - NODE_RADIUS * 0.62}
                r={5}
                fill={riskColor}
                stroke="#0f172a"
                strokeWidth="2"
              />

              {/* Inactive dashed ring */}
              {node.status === "INACTIVE" && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_RADIUS + 2}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Expand badge */}
              {node.hasChildren && !isExpanded && (
                <>
                  <circle
                    cx={pos.x + NODE_RADIUS * 0.7}
                    cy={pos.y + NODE_RADIUS * 0.7}
                    r={9}
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x + NODE_RADIUS * 0.7}
                    y={pos.y + NODE_RADIUS * 0.7 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    +
                  </text>
                </>
              )}

              {/* Collapse badge */}
              {node.hasChildren && isExpanded && (
                <>
                  <circle
                    cx={pos.x + NODE_RADIUS * 0.7}
                    cy={pos.y + NODE_RADIUS * 0.7}
                    r={9}
                    fill={typeColor}
                    opacity="0.25"
                    stroke={typeColor}
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x + NODE_RADIUS * 0.7}
                    y={pos.y + NODE_RADIUS * 0.7 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={typeColor}
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    -
                  </text>
                </>
              )}

              {/* Initials */}
              <text
                x={pos.x}
                y={pos.y - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isExpanded ? "#0f172a" : "#e2e8f0"}
                fontSize="13"
                fontWeight="700"
                className="pointer-events-none"
              >
                {initials}
              </text>

              {/* Tiny type label inside node */}
              <text
                x={pos.x}
                y={pos.y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isExpanded ? "rgba(0,0,0,0.5)" : "#475569"}
                fontSize="7"
                fontWeight="500"
                className="pointer-events-none"
              >
                {node.partyType}
              </text>

              {/* Name label below */}
              <text
                x={pos.x}
                y={pos.y + NODE_RADIUS + 16}
                textAnchor="middle"
                fill={isExpanded ? "#091326" : "#0E5964"}
                fontSize="12"
                fontWeight={isExpanded ? "600" : "500"}
                className="pointer-events-none"
              >
                {node.name.length > 18 ? `${node.name.slice(0, 16)}...` : node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInNode {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInLink {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.7;
          }
        }
      `}</style>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 rounded-lg border border-border bg-card px-4 py-3 shadow-2xl"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-sm font-semibold text-foreground">{tooltip.node.name}</div>
          <div className="mt-1.5 flex items-center gap-2">
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
          <div className="text-xs text-muted-foreground mt-1">
            Role: {tooltip.node.role.replace(/_/g, " ")}
          </div>
          {tooltip.node.hasChildren && (
            <div className="text-xs mt-1.5 text-accent font-medium">
              {expandedKeys.has(tooltip.node.uniqueKey) ? "Click to collapse" : "Click to expand"}
            </div>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground text-sm font-bold hover:bg-secondary transition-colors"
          onClick={() => {
            const newZoom = Math.min(4, zoom * 1.25);
            const newW = dimensions.width / newZoom;
            const newH = dimensions.height / newZoom;
            const cx = viewBox.x + viewBox.w / 2;
            const cy = viewBox.y + viewBox.h / 2;
            setViewBox({ x: cx - newW / 2, y: cy - newH / 2, w: newW, h: newH });
            setZoom(newZoom);
          }}
        >
          +
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground text-sm font-bold hover:bg-secondary transition-colors"
          onClick={() => {
            const newZoom = Math.max(0.3, zoom * 0.8);
            const newW = dimensions.width / newZoom;
            const newH = dimensions.height / newZoom;
            const cx = viewBox.x + viewBox.w / 2;
            const cy = viewBox.y + viewBox.h / 2;
            setViewBox({ x: cx - newW / 2, y: cy - newH / 2, w: newW, h: newH });
            setZoom(newZoom);
          }}
        >
          -
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground text-xs hover:bg-secondary transition-colors"
          onClick={() => {
            setViewBox({ x: 0, y: 0, w: dimensions.width, h: dimensions.height });
            setZoom(1);
            setDraggedPositions(new Map());
          }}
        >
          R
        </button>
      </div>
    </div>
  );
}
