"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { getEdgeColor, getRiskColor } from "./lib/graphColors";

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
            return target.depth === 1 ? 150 : target.depth === 2 ? 110 : 80;
          })
          .strength(0.5),
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force("collision", d3.forceCollide(NODE_RADIUS + 10))
      .force("center", d3.forceCenter(W / 2, H / 2))
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
      //white
      ctx.fillStyle = "#121212";
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
        ctx.strokeStyle = color + "40";
        ctx.lineWidth = 0.8;
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
        ctx.fillStyle = isRoot ? "#1a1e30" : "#111526";
        ctx.fill();

        // Border
        ctx.strokeStyle = isHovered ? "#ffffff" : color;
        ctx.lineWidth = isRoot ? 2.5 : isHovered ? 2 : 1;
        ctx.stroke();

        // Inner ring on root
        if (isRoot) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r - 7, 0, Math.PI * 2);
          ctx.strokeStyle = color + "55";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "#94a3b8";
        ctx.font = isRoot ? "bold 11px system-ui" : "9.5px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (isRoot) {
          const words = node.label.split(" ");
          const mid = Math.ceil(words.length / 2);
          ctx.fillStyle = "#f1f5f9";
          ctx.fillText(words.slice(0, mid).join(" "), node.x, node.y - 5);
          ctx.fillText(words.slice(mid).join(" "), node.x, node.y + 7);
        } else {
          const label = node.label.length > 13 ? node.label.slice(0, 12) + "…" : node.label;
          ctx.fillText(label, node.x, node.y + r + 11);
        }
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
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const found = getNodeAt(data.nodes, cx, cy, transformRef.current);
      hoveredRef.current = found;
      canvasRef.current.style.cursor = found ? "pointer" : "grab";
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

  return (
    <div ref={containerRef} className="w-full h-[80vh] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
}
