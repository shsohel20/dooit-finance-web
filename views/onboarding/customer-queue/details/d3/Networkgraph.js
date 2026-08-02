"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { getEdgeColor, getRiskColor } from "./lib/graphColors";
import { getPartyIcon } from "./lib/icon";

const NODE_RADIUS = 28;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function nodeRadius(node) {
  return node.depth === 0 ? 40 : NODE_RADIUS;
}

function getNodeAt(nodes, px, py, transform) {
  // Convert screen px → simulation world coords
  const wx = (px - transform.x) / transform.k;
  const wy = (py - transform.y) / transform.k;
  // Iterate reversed so visually top node wins on overlap
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const r = nodeRadius(n);
    if (Math.hypot((n.x ?? 0) - wx, (n.y ?? 0) - wy) < r + 4) return n;
  }
  return null;
}

/**
 * Compass layout relative to the root:
 *   FAMILY            → top
 *   BUSINESS          → bottom
 *   transactional in  → left
 *   transactional out → right
 */
function assignLayoutZones(nodes, edges, W, H) {
  const root = nodes.find((n) => n.depth === 0);
  const rootId = root?.id;
  const cx = W / 2;
  const cy = H / 2;
  const span = Math.min(W, H) * 0.38;

  const incomingIds = new Set(); // counterparties that send money → root
  const outgoingIds = new Set(); // counterparties that receive money ← root

  for (const e of edges) {
    if (e.type !== "TRANSACTION") continue;
    const s = typeof e.source === "object" ? e.source.id : e.source;
    const t = typeof e.target === "object" ? e.target.id : e.target;
    if (!rootId) break;
    if (t === rootId) incomingIds.add(s);
    if (s === rootId) outgoingIds.add(t);
  }

  const groups = { top: [], bottom: [], left: [], right: [], other: [] };

  for (const node of nodes) {
    if (node.depth === 0) {
      node.layoutZone = "center";
      node.targetX = cx;
      node.targetY = cy;
      continue;
    }

    const rt = (node.relationType || "").toUpperCase();
    const pt = (node.partyType || "").toUpperCase();
    const hasIn = incomingIds.has(node.id);
    const hasOut = outgoingIds.has(node.id);

    let zone;
    if (rt === "FAMILY") {
      zone = "top";
    } else if (rt === "BUSINESS" || pt === "BUSINESS") {
      zone = "bottom";
    } else if (hasIn && !hasOut) {
      zone = "left";
    } else if (hasOut && !hasIn) {
      zone = "right";
    } else if (hasIn) {
      zone = "left";
    } else if (hasOut) {
      zone = "right";
    } else if (
      rt === "OWNERSHIP" ||
      rt === "CONTROL" ||
      rt === "LEGAL_STRUCTURE" ||
      pt === "LEGAL_ENTITY"
    ) {
      // Business-adjacent structural ties sit with business (bottom)
      zone = "bottom";
    } else {
      zone = "other";
    }

    node.layoutZone = zone;
    groups[zone].push(node);
  }

  const placeRow = (list, baseX, baseY, axis) => {
    const n = list.length;
    if (n === 0) return;
    const spread = Math.min(axis === "x" ? W * 0.55 : H * 0.55, Math.max(n - 1, 1) * (NODE_RADIUS * 2.8));
    list.forEach((node, i) => {
      const t = n === 1 ? 0 : i / (n - 1) - 0.5;
      if (axis === "x") {
        node.targetX = baseX + t * spread;
        node.targetY = baseY;
      } else {
        node.targetX = baseX;
        node.targetY = baseY + t * spread;
      }
      // Seed simulation so nodes start in the right quadrant
      node.x = node.targetX;
      node.y = node.targetY;
    });
  };

  placeRow(groups.top, cx, cy - span, "x");
  placeRow(groups.bottom, cx, cy + span, "x");
  placeRow(groups.left, cx - span, cy, "y");
  placeRow(groups.right, cx + span, cy, "y");

  // Leftovers: ring just outside center
  groups.other.forEach((node, i, arr) => {
    const angle = (i / Math.max(arr.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = span * 0.55;
    node.targetX = cx + Math.cos(angle) * r;
    node.targetY = cy + Math.sin(angle) * r;
    node.x = node.targetX;
    node.y = node.targetY;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function NetworkGraph({ data, onNodeClick }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const transformRef = useRef(d3.zoomIdentity);
  // Use a ref for hovered node so the draw loop always sees the latest value
  // without needing to be re-created on every render.
  const hoveredRef = useRef(null);
  // Track whether a drag moved enough to suppress the click handler
  const didDragRef = useRef(false);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startTransformRef = useRef({ x: 0, y: 0 });

  // ── 1. Simulation + draw loop ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // HiDPI / retina support — do this ONCE here
    const dpr = window.devicePixelRatio || 1;
    const W = container.clientWidth;
    const H = container.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // scale once; all subsequent draws are in CSS px

    // Compass layout: family↑ business↓ incoming← outgoing→
    assignLayoutZones(data.nodes, data.edges, W, H);

    // Pin root node to center
    const rootNode = data.nodes.find((n) => n.depth === 0);
    if (rootNode) {
      rootNode.fx = W / 2;
      rootNode.fy = H / 2;
    }

    // ── Simulation ──────────────────────────────────────────────────────────
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id((d) => d.id)
          .distance((d) => {
            const target = d.target;
            return target.depth === 1 ? 450 : target.depth === 2 ? 310 : 250;
          })
          .strength(0.35),
      )
      .force("charge", d3.forceManyBody().strength(-280))
      .force("collision", d3.forceCollide(NODE_RADIUS + 14))
      // Pull each node toward its compass zone (soft — still draggable)
      .force(
        "x",
        d3
          .forceX((d) => d.targetX ?? W / 2)
          .strength((d) => (d.depth === 0 ? 0 : 0.18)),
      )
      .force(
        "y",
        d3
          .forceY((d) => d.targetY ?? H / 2)
          .strength((d) => (d.depth === 0 ? 0 : 0.18)),
      )
      // KEY FIX: alphaDecay toward a small positive target → nodes never
      // fully freeze; they breathe gently after the initial layout settles.
      .alphaTarget(0.005)
      .alphaDecay(0.022);

    simRef.current = simulation;

    // ── Draw ────────────────────────────────────────────────────────────────
    function draw() {
      const t = transformRef.current;
      ctx.save();
      ctx.clearRect(0, 0, W, H);

      // Background

      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, W, H);

      ctx.translate(t.x, t.y);
      ctx.scale(t.k, t.k);

      // Edges
      for (const link of data.edges) {
        const s = link.source;
        const tg = link.target;
        if (s.x == null || tg.x == null) continue;

        const color = getEdgeColor(link.relationType);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tg.x, tg.y);
        ctx.strokeStyle = color + "50"; //opacity
        ctx.lineWidth = link.edgeOpacity ?? 0.4;
        ctx.stroke();
      }

      // Nodes
      for (const node of data.nodes) {
        if (node.x == null) continue;

        const color = getRiskColor(node.riskRating);
        const isRoot = node.depth === 0;
        const isHovered = hoveredRef.current?.id === node.id;
        const r = nodeRadius(node);

        // Glow
        if (isRoot || isHovered) {
          const grad = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r + 18);
          grad.addColorStop(0, color + "44");
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 18, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Circle fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isRoot ? "#FFDF20" : "#ECFCCA";
        ctx.fill();

        // Border
        ctx.strokeStyle = isHovered ? "#ffffff" : color;
        ctx.lineWidth = isRoot ? 2.5 : isHovered ? 2 : 1;
        ctx.stroke();

        // Party type icon (centered in circle)
        const icon = getPartyIcon(node.partyType);
        ctx.font = `${isRoot ? 28 : 22}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icon, node.x, node.y);

        // Inner ring on root
        if (isRoot) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r - 7, 0, Math.PI * 2);
          ctx.strokeStyle = color + "55";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Label below node
        ctx.fillStyle = "#171717";
        ctx.font = isRoot ? "bold 11px system-ui" : "9.5px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = node.label.length > 13 ? node.label.slice(0, 12) + "…" : node.label;
        ctx.fillText(label, node.x, node.y + r + 11);
      }

      ctx.restore();
    }

    simulation.on("tick", draw);

    return () => {
      simulation.stop();
    };
  }, [data]);

  // ── 2. Zoom (wheel / trackpad only — NOT pointer drag) ────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // IMPORTANT: filter so zoom only fires on wheel/pinch, NOT on mouse drag.
    // This prevents zoom and drag from competing for the same pointer events.
    const zoom = d3
      .zoom()
      .filter((event) => {
        // Allow wheel zoom and touch pinch; block mouse button events
        return event.type === "wheel" || event.touches?.length >= 2;
      })
      .scaleExtent([0.15, 4])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        // Lightly re-heat so nodes smoothly reposition after a zoom
        simRef.current?.alpha(Math.max(simRef.current.alpha(), 0.05)).restart();
      });

    d3.select(canvas).call(zoom);

    return () => {
      d3.select(canvas).on(".zoom", null);
    };
  }, []);

  // ── 3. Drag (pointer events, fully manual — no d3.drag) ───────────────────
  // We handle drag ourselves instead of using d3.drag() because d3.drag and
  // d3.zoom both intercept pointerdown and override each other on canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let draggingNode = null;
    let dragStartPos = { x: 0, y: 0 };

    function onMouseDown(e) {
      // Only left button
      if (e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const hit = getNodeAt(data.nodes, cx, cy, transformRef.current);

      if (hit && hit.depth !== 0) {
        draggingNode = hit;
        didDragRef.current = false;
        dragStartPos = { x: cx, y: cy };
        // Pin the node so the sim stops moving it while we drag
        hit.fx = hit.x;
        hit.fy = hit.y;
        // Warm up slightly so linked nodes respond fluidly
        simRef.current?.alphaTarget(0.3).restart();
        e.stopPropagation(); // don't let d3-zoom see this event
      }
    }

    function onMouseMove(e) {
      if (!draggingNode) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // Mark as dragged if moved more than 3px (suppresses accidental clicks)
      if (Math.hypot(cx - dragStartPos.x, cy - dragStartPos.y) > 3) {
        didDragRef.current = true;
      }

      // Convert screen → world
      const t = transformRef.current;
      draggingNode.fx = (cx - t.x) / t.k;
      draggingNode.fy = (cy - t.y) / t.k;
    }

    function onMouseUp() {
      if (!draggingNode) return;
      // Release pin so node floats back into simulation
      draggingNode.fx = null;
      draggingNode.fy = null;
      draggingNode = null;
      // Return to gentle idle target
      simRef.current?.alphaTarget(0.005);
    }

    canvas.addEventListener("mousedown", onMouseDown, { capture: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown, { capture: true });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [data]);

  // ── 4. Hover ──────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // If currently dragging, pan the canvas
      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;

        transformRef.current.x = startTransformRef.current.x + dx;
        transformRef.current.y = startTransformRef.current.y + dy;

        return;
      }

      // Otherwise, handle hover
      const rect = canvas.getBoundingClientRect();

      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const found = getNodeAt(data.nodes, cx, cy, transformRef.current);

      hoveredRef.current = found;

      canvas.style.cursor = found ? "pointer" : "grab";
    },
    [data],
  );
  // ── 5. Click ──────────────────────────────────────────────────────────────
  const handleClick = useCallback(
    (e) => {
      // Suppress click if the pointer actually dragged
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const found = getNodeAt(data.nodes, cx, cy, transformRef.current);
      if (found) onNodeClick?.(found);
    },
    [data, onNodeClick],
  );
  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    startTransformRef.current = {
      x: transformRef.current.x,
      y: transformRef.current.y,
    };

    canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    canvasRef.current.style.cursor = "grab";
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[80vh] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}
