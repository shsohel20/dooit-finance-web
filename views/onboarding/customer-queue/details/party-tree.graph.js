"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";



/* ─── Color helpers ──────────────────────────────────── */
function getRiskColor(risk) {
  switch (risk) {
    case "LOW": return "#16a34a";
    case "MEDIUM": return "#d97706";
    case "HIGH": return "#dc2626";
    default: return "#6b7280";
  }
}

function getTypeColor(type) {
  switch (type) {
    case "INDIVIDUAL": return "#2563eb";
    case "BUSINESS": return "#9333ea";
    case "LEGAL_ENTITY": return "#0d9488";
    default: return "#6b7280";
  }
}

function getTypeBg(type) {
  switch (type) {
    case "INDIVIDUAL": return "#eff6ff";
    case "BUSINESS": return "#faf5ff";
    case "LEGAL_ENTITY": return "#f0fdfa";
    default: return "#f9fafb";
  }
}

function getRelationColor(rel) {
  switch (rel) {
    case "FAMILY": return "#2563eb";
    case "SOCIAL": return "#8b5cf6";
    case "OWNERSHIP":
    case "CONTROL": return "#9333ea";
    case "LEGAL_STRUCTURE":
    case "BENEFICIAL_INTEREST": return "#0d9488";
    case "TRANSACTIONAL": return "#ea580c";
    default: return "#64748b";
  }
}

function formatCurrency(amount) {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

/* ─── Build registry ─────────────────────────────────── */
function buildRegistry(
  node,
  parentKey,
  depth,
  registry,
  allLinks
) {
  const uniqueKey = parentKey ? `${parentKey}>${node.partyId}` : node.partyId;
  const childKeys = node.children.map((c) => `${uniqueKey}>${c.partyId}`);

  const txs = node.transactions || [];

  registry.set(uniqueKey, {
    uniqueKey,
    id: node.partyId,
    name: node.partyName,
    partyType: node.partyType,
    role: node.role,
    riskRating: node.riskRating,
    status: node.status,
    relationship: node.relationshipToParent,
    relationType: node.relationType,
    ownershipPercentage: node.ownershipPercentage,
    depth,
    parentKey,
    childKeys,
    hasChildren: node.children.length > 0,
    transactions: txs,
  });

  if (parentKey) {
    // Find a transaction on this node from parent to this child
    const tx = txs.length > 0 ? txs[0] : undefined;
    allLinks.push({
      sourceKey: parentKey,
      targetKey: uniqueKey,
      label: node.relationshipToParent || "",
      relationType: node.relationType,
      transaction: tx,
    });
  }

  for (const child of node.children) {
    buildRegistry(child, uniqueKey, depth + 1, registry, allLinks);
  }
}

/* ─── Radial layout ──────────────────────────────────── */
function computeRadialPositions(
  registry,
  expandedKeys,
  rootKey,
  cx,
  cy,
  baseRadius
) {
  const positions = new Map();
  positions.set(rootKey, { x: cx, y: cy });

  function placeChildren(
    parentKey,
    angleStart,
    angleEnd,
    depth
  ) {
    const node = registry.get(parentKey);
    if (!node || !expandedKeys.has(parentKey)) return;

    const visibleChildren = node.childKeys.filter((ck) => registry.has(ck));
    if (visibleChildren.length === 0) return;

    const radius = baseRadius * depth;
    const arcSpan = angleEnd - angleStart;
    const step = arcSpan / visibleChildren.length;

    visibleChildren.forEach((childKey, i) => {
      const angle = angleStart + step * (i + 0.5);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      positions.set(childKey, { x, y });
      placeChildren(childKey, angleStart + step * i, angleStart + step * (i + 1), depth + 1);
    });
  }

  placeChildren(rootKey, 0, 2 * Math.PI, 1);
  return positions;
}

/* ─── Main component ─────────────────────────────────── */
const NODE_RADIUS = 36;
const BASE_ORBIT_RADIUS = 180;

export function PartyTreeGraph({
  data,
  viewMode,
  expandAllRef,
  collapseAllRef,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [recentlyRevealed, setRecentlyRevealed] = useState(new Set());
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [draggedPositions, setDraggedPositions] = useState(new Map());
  const dragRef = useRef(null);
  const hasDraggedRef = useRef(false);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 1000, h: 600 });
  const viewBoxRef = useRef(viewBox);
  viewBoxRef.current = viewBox;
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const panRef = useRef(null);
  const interactionMode = useRef("none");

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

  useEffect(() => {
    setViewBox({ x: 0, y: 0, w: dimensions.width, h: dimensions.height });
  }, [dimensions]);

  const rootKey = data.partyId;

  const { registry, allLinks } = useMemo(() => {
    const registry = new Map();
    const allLinks = [];
    buildRegistry(data, null, 0, registry, allLinks);
    return { registry, allLinks };
  }, [data]);

  /* ─── Expand / Collapse All ─────────────────────────── */
  const expandAll = useCallback(() => {
    const allKeys = new Set();
    for (const [key, node] of registry) {
      if (node.hasChildren) allKeys.add(key);
    }
    setExpandedKeys(allKeys);
    setDraggedPositions(new Map());
  }, [registry]);

  const collapseAll = useCallback(() => {
    setExpandedKeys(new Set());
    setDraggedPositions(new Map());
  }, []);

  useEffect(() => {
    if (expandAllRef) expandAllRef.current = expandAll;
    if (collapseAllRef) collapseAllRef.current = collapseAll;
  }, [expandAll, collapseAll, expandAllRef, collapseAllRef]);

  const radialPositions = useMemo(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    return computeRadialPositions(registry, expandedKeys, rootKey, cx, cy, BASE_ORBIT_RADIUS);
  }, [registry, expandedKeys, rootKey, dimensions]);

  const nodePositions = useMemo(() => {
    const merged = new Map();
    for (const [key, pos] of radialPositions) {
      merged.set(key, draggedPositions.get(key) ?? pos);
    }
    return merged;
  }, [radialPositions, draggedPositions]);

  // Build visible links based on view mode
  const visibleLinks = useMemo(() => {
    const links = [];
    for (const key of nodePositions.keys()) {
      const node = registry.get(key);
      if (node?.parentKey && nodePositions.has(node.parentKey)) {
        const linkData = allLinks.find((l) => l.sourceKey === node.parentKey && l.targetKey === key);
        if (linkData) {
          // In transaction mode, only show links that have transactions
          if (viewMode === "transaction") {
            if (linkData.transaction) links.push(linkData);
          } else {
            links.push(linkData);
          }
        }
      }
    }
    return links;
  }, [nodePositions, registry, allLinks, viewMode]);

  /* ─── Node click ───────────────────────────────────── */
  const handleNodeClick = useCallback(
    (key) => {
      if (hasDraggedRef.current) { hasDraggedRef.current = false; return; }
      const node = registry.get(key);
      if (!node || !node.hasChildren) return;

      setExpandedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
          const removeDesc = (k) => {
            const n = registry.get(k);
            if (n) for (const ck of n.childKeys) { next.delete(ck); removeDesc(ck); }
          };
          removeDesc(key);
          setDraggedPositions((prev) => {
            const next = new Map(prev);
            const removePos = (k) => {
              const n = registry.get(k);
              if (n) for (const ck of n.childKeys) { next.delete(ck); removePos(ck); }
            };
            removePos(key);
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
    [registry]
  );

  /* ─── Coordinate conversion (uses ref to avoid stale closures) */
  const screenToSVG = useCallback(
    (clientX, clientY) => {
      const rect = svgRef.current?.getBoundingClientRect();
      const vb = viewBoxRef.current;
      if (!rect) return { x: clientX, y: clientY };
      return {
        x: vb.x + ((clientX - rect.left) / rect.width) * vb.w,
        y: vb.y + ((clientY - rect.top) / rect.height) * vb.h,
      };
    },
    []
  );

  /* ─── Node drag start ──────────────────────────────── */
  const handlePointerDown = useCallback(
    (key, e) => {
      e.stopPropagation();
      e.preventDefault();
      interactionMode.current = "drag";
      const svgPt = screenToSVG(e.clientX, e.clientY);
      const pos = nodePositions.get(key);
      if (!pos) return;
      dragRef.current = { key, startMouse: svgPt, startPos: { ...pos } };
      hasDraggedRef.current = false;
    },
    [screenToSVG, nodePositions]
  );

  /* ─── Canvas pan start ─────────────────────────────── */
  const handleCanvasPointerDown = useCallback(
    (e) => {
      if (interactionMode.current === "drag") return;
      interactionMode.current = "pan";
      const vb = viewBoxRef.current;
      panRef.current = {
        startMouse: { x: e.clientX, y: e.clientY },
        startViewBox: { x: vb.x, y: vb.y },
      };
    },
    []
  );

  /* ─── Unified pointer move ─────────────────────────── */
  const handlePointerMove = useCallback(
      (e) => {
      if (interactionMode.current === "drag" && dragRef.current) {
        const svgPt = screenToSVG(e.clientX, e.clientY);
        const dx = svgPt.x - dragRef.current.startMouse.x;
        const dy = svgPt.y - dragRef.current.startMouse.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDraggedRef.current = true;
        setDraggedPositions((prev) => {
          const next = new Map(prev);
          next.set(dragRef.current.key, {
            x: dragRef.current.startPos.x + dx,
            y: dragRef.current.startPos.y + dy,
          });
          return next;
        });
        return;
      }
      if (interactionMode.current === "pan" && panRef.current) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const vb = viewBoxRef.current;
        const sx = vb.w / rect.width;
        const sy = vb.h / rect.height;
        const newX = panRef.current.startViewBox.x - (e.clientX - panRef.current.startMouse.x) * sx;
        const newY = panRef.current.startViewBox.y - (e.clientY - panRef.current.startMouse.y) * sy;
        setViewBox({ ...vb, x: newX, y: newY });
      }
    },
    [screenToSVG]
  );

  /* ─── Unified pointer up ──────────────────────────── */
  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    panRef.current = null;
    interactionMode.current = "none";
  }, []);

  /* ─── Zoom via wheel ──────────────────────────────── */
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      const z = zoomRef.current;
      const vb = viewBoxRef.current;
      const newZoom = Math.max(0.3, Math.min(4, z * factor));
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = vb.x + ((e.clientX - rect.left) / rect.width) * vb.w;
      const my = vb.y + ((e.clientY - rect.top) / rect.height) * vb.h;
      const newW = dimensions.width / newZoom;
      const newH = dimensions.height / newZoom;
      setViewBox({
        x: mx - ((mx - vb.x) / vb.w) * newW,
        y: my - ((my - vb.y) / vb.h) * newH,
        w: newW,
        h: newH,
      });
      setZoom(newZoom);
    },
    [dimensions]
  );

  /* ─── Tooltip ──────────────────────────────────────── */
  const handleNodeHover = useCallback(
    (key, event) => {
      setHoveredKey(key);
      if (key && event) {
        const node = registry.get(key);
        if (node) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            // Find link to this node
            const link = allLinks.find((l) => l.targetKey === key);
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top - 14,
              node,
              link,
            });
          }
        }
      } else {
        setTooltip(null);
      }
    },
    [registry, allLinks]
  );

  /* ─── Render ───────────────────────────────────────── */
  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[560px] select-none overflow-hidden">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <defs>
          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.25" />
          </filter>
          <filter id="glow-ring" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrow" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 3 L 0 6 z" fill="#94a3b8" />
          </marker>
          <marker id="arrow-tx" viewBox="0 0 10 6" refX="10" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 3 L 0 6 z" fill="#ea580c" />
          </marker>
        </defs>

        {/* Degree-of-separation orbit rings */}
        {[1, 2, 3, 4].map((d) => {
          const cx = dimensions.width / 2;
          const cy = dimensions.height / 2;
          const r = BASE_ORBIT_RADIUS * d;
          return (
            <g key={`orbit-${d}`}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
              <text x={cx + r + 6} y={cy - 4} fill="#94a3b8" fontSize="10" fontWeight="500">
                {d === 1 ? "1st degree" : d === 2 ? "2nd degree" : d === 3 ? "3rd degree" : `${d}th degree`}
              </text>
            </g>
          );
        })}

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

          const sx = s.x + nx * (NODE_RADIUS + 2);
          const sy = s.y + ny * (NODE_RADIUS + 2);
          const tx = t.x - nx * (NODE_RADIUS + 2);
          const ty = t.y - ny * (NODE_RADIUS + 2);

          const lx = (sx + tx) / 2;
          const ly = (sy + ty) / 2;

          const isTransaction = viewMode === "transaction" && link.transaction;
          const linkColor = isTransaction ? "#ea580c" : getRelationColor(link.relationType);
          const linkWidth = isTransaction ? 2.5 : 1.5;

          return (
            <g key={`${link.sourceKey}~${link.targetKey}`}>
              <line
                x1={sx}
                y1={sy}
                x2={tx}
                y2={ty}
                stroke={linkColor}
                strokeWidth={linkWidth}
                opacity={isNew ? 0 : 0.7}
                markerEnd={isTransaction ? "url(#arrow-tx)" : "url(#arrow)"}
                style={isNew ? { animation: "fadeInLink 0.5s ease-out forwards" } : undefined}
              />

              {/* Relationship / Transaction label */}
              <rect
                x={lx - 44}
                y={ly - 18}
                width={88}
                height={isTransaction ? 32 : 18}
                rx={4}
                fill="white"
                stroke={isTransaction ? "#fed7aa" : "#e2e8f0"}
                strokeWidth="1"
                opacity={isNew ? 0 : 0.95}
                style={isNew ? { animation: "fadeInLink 0.5s ease-out 0.15s forwards" } : undefined}
              />
              <text
                x={lx}
                y={ly - (isTransaction ? 6 : 7)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={linkColor}
                fontSize="8"
                fontWeight="600"
                className="pointer-events-none"
                opacity={isNew ? 0 : 1}
                style={isNew ? { animation: "fadeInLink 0.5s ease-out 0.15s forwards" } : undefined}
              >
                {link.label}
              </text>
              {isTransaction && link.transaction && (
                <text
                  x={lx}
                  y={ly + 7}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#c2410c"
                  fontSize="9"
                  fontWeight="700"
                  className="pointer-events-none"
                  opacity={isNew ? 0 : 1}
                  style={isNew ? { animation: "fadeInLink 0.5s ease-out 0.15s forwards" } : undefined}
                >
                  {formatCurrency(link.transaction.amount)} {link.transaction.currency}
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
          const typeBg = getTypeBg(node.partyType);
          const riskColor = getRiskColor(node.riskRating);
          const initials = node.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

          // In transaction mode, dim nodes without transactions if not root
          const hasTx = node.transactions.length > 0 || key === rootKey;
          const dimmed = viewMode === "transaction" && !hasTx && !isExpanded;

          return (
            <g
              key={key}
              className="cursor-pointer"
              onPointerDown={(e) => handlePointerDown(key, e)}
              onClick={() => handleNodeClick(key)}
              onMouseEnter={(e) => handleNodeHover(key, e)}
              onMouseLeave={() => handleNodeHover(null)}
              style={isNew ? { animation: "fadeInNode 0.45s ease-out forwards", opacity: 0 } : { opacity: dimmed ? 0.4 : 1 }}
            >
              {/* Expanded outer ring */}
              {isExpanded && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS + 10} fill="none" stroke={typeColor} strokeWidth="1" opacity="0.12" />
                  <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS + 5} fill="none" stroke={typeColor} strokeWidth="1.5" opacity="0.25" filter="url(#glow-ring)" />
                </>
              )}

              {/* Hover ring */}
              {isHovered && !isExpanded && (
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS + 4} fill="none" stroke={typeColor} strokeWidth="1" opacity="0.3" />
              )}

              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                fill={isExpanded ? typeColor : typeBg}
                stroke={isExpanded ? typeColor : isHovered ? typeColor : "#cbd5e1"}
                strokeWidth={isExpanded ? 2.5 : 1.5}
                filter="url(#node-shadow)"
              />

              {/* Inner border */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS - 3}
                fill="none"
                stroke={isExpanded ? "rgba(255,255,255,0.2)" : typeColor}
                strokeWidth="0.5"
                opacity={isExpanded ? 1 : 0.15}
              />

              {/* Risk dot */}
              <circle
                cx={pos.x + NODE_RADIUS * 0.62}
                cy={pos.y - NODE_RADIUS * 0.62}
                r={5}
                fill={riskColor}
                stroke="white"
                strokeWidth="2"
              />

              {/* Inactive dashed ring */}
              {node.status === "INACTIVE" && (
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS + 2} fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" />
              )}

              {/* Degree badge (top-left) */}
              {node.depth > 0 && (
                <>
                  <circle
                    cx={pos.x - NODE_RADIUS * 0.62}
                    cy={pos.y - NODE_RADIUS * 0.62}
                    r={8}
                    fill="white"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x - NODE_RADIUS * 0.62}
                    y={pos.y - NODE_RADIUS * 0.62 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#64748b"
                    fontSize="8"
                    fontWeight="700"
                    className="pointer-events-none"
                  >
                    {node.depth}
                  </text>
                </>
              )}

              {/* Expand/collapse badge */}
              {node.hasChildren && !isExpanded && (
                <>
                  <circle cx={pos.x + NODE_RADIUS * 0.7} cy={pos.y + NODE_RADIUS * 0.7} r={9} fill="white" stroke="#cbd5e1" strokeWidth="1" />
                  <text x={pos.x + NODE_RADIUS * 0.7} y={pos.y + NODE_RADIUS * 0.7 + 1} textAnchor="middle" dominantBaseline="central" fill="#64748b" fontSize="12" fontWeight="bold" className="pointer-events-none">+</text>
                </>
              )}
              {node.hasChildren && isExpanded && (
                <>
                  <circle cx={pos.x + NODE_RADIUS * 0.7} cy={pos.y + NODE_RADIUS * 0.7} r={9} fill={typeColor} opacity="0.15" stroke={typeColor} strokeWidth="1" />
                  <text x={pos.x + NODE_RADIUS * 0.7} y={pos.y + NODE_RADIUS * 0.7 + 1} textAnchor="middle" dominantBaseline="central" fill={typeColor} fontSize="14" fontWeight="bold" className="pointer-events-none">-</text>
                </>
              )}

              {/* Transaction indicator in transaction mode */}
              {viewMode === "transaction" && node.transactions.length > 0 && (
                <>
                  <circle cx={pos.x - NODE_RADIUS * 0.7} cy={pos.y + NODE_RADIUS * 0.7} r={9} fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
                  <text x={pos.x - NODE_RADIUS * 0.7} y={pos.y + NODE_RADIUS * 0.7 + 0.5} textAnchor="middle" dominantBaseline="central" fill="#ea580c" fontSize="8" fontWeight="700" className="pointer-events-none">$</text>
                </>
              )}

              {/* Initials */}
              <text
                x={pos.x}
                y={pos.y - 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isExpanded ? "white" : "#1e293b"}
                fontSize="13"
                fontWeight="700"
                className="pointer-events-none"
              >
                {initials}
              </text>

              {/* Type label */}
              <text
                x={pos.x}
                y={pos.y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isExpanded ? "rgba(255,255,255,0.65)" : "#94a3b8"}
                fontSize="7"
                fontWeight="500"
                className="pointer-events-none"
              >
                {node.partyType}
              </text>

              {/* Name below */}
              <text
                x={pos.x}
                y={pos.y + NODE_RADIUS + 16}
                textAnchor="middle"
                fill={isExpanded ? "#1e293b" : "#64748b"}
                fontSize="10"
                fontWeight={isExpanded ? "600" : "400"}
                className="pointer-events-none"
              >
                {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInNode {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInLink {
          from { opacity: 0; }
          to { opacity: 0.7; }
        }
      `}</style>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50 rounded-lg border border-border bg-card px-4 py-3 shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)", maxWidth: 280 }}
        >
          <div className="text-sm font-semibold text-foreground">{tooltip.node.name}</div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: getTypeColor(tooltip.node.partyType) }} />
            <span className="text-xs text-muted-foreground">{tooltip.node.partyType}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: getRiskColor(tooltip.node.riskRating) }} />
            <span className="text-xs text-muted-foreground">Risk: {tooltip.node.riskRating}</span>
          </div>
          {tooltip.node.depth > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              Degree of separation: {tooltip.node.depth}
            </div>
          )}
          {tooltip.node.relationship && (
            <div className="text-xs text-muted-foreground mt-1">Relation: {tooltip.node.relationship}</div>
          )}
          {tooltip.node.relationType && (
            <div className="text-xs text-muted-foreground mt-1">Type: {tooltip.node.relationType.replace(/_/g, " ")}</div>
          )}
          {tooltip.node.ownershipPercentage != null && (
            <div className="text-xs text-muted-foreground mt-1">Ownership: {tooltip.node.ownershipPercentage}%</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">Role: {tooltip.node.role.replace(/_/g, " ")}</div>
          {tooltip.node.transactions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="text-xs font-semibold" style={{ color: "#ea580c" }}>Transactions:</div>
              {tooltip.node.transactions.map((tx) => (
                <div key={tx.transactionId} className="mt-1 text-xs text-muted-foreground">
                  <div>{tx.from} {"-->"} {tx.to}</div>
                  <div className="font-semibold" style={{ color: "#c2410c" }}>
                    {formatCurrency(tx.amount)} {tx.currency} ({tx.frequency})
                  </div>
                  <div>{tx.purpose}</div>
                </div>
              ))}
            </div>
          )}
          {tooltip.node.hasChildren && (
            <div className="text-xs mt-1.5 font-medium" style={{ color: getTypeColor(tooltip.node.partyType) }}>
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
            const nz = Math.min(4, zoom * 1.25);
            const nw = dimensions.width / nz;
            const nh = dimensions.height / nz;
            const cx = viewBox.x + viewBox.w / 2;
            const cy = viewBox.y + viewBox.h / 2;
            setViewBox({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
            setZoom(nz);
          }}
        >
          +
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground text-sm font-bold hover:bg-secondary transition-colors"
          onClick={() => {
            const nz = Math.max(0.3, zoom * 0.8);
            const nw = dimensions.width / nz;
            const nh = dimensions.height / nz;
            const cx = viewBox.x + viewBox.w / 2;
            const cy = viewBox.y + viewBox.h / 2;
            setViewBox({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
            setZoom(nz);
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
