"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { getRiskColor } from "./lib/graphColors";

const NODE_RADIUS = 19;
const ROOT_RADIUS = 26;
const CELL = NODE_RADIUS * 2 + 6; // packing pitch: diameter + gap
const EDGE_HIT_PX = 6; // hover tolerance around a line, in screen px

// ── Light palette ────────────────────────────────────────────────────────────
const C = {
  bg: "#f7f8fa",
  nodeFill: "#ffffff",
  nodeFillHover: "#eef2f7",
  nodeRim: "rgba(15,23,42,0.16)",
  nodeRimHover: "#0f172a",
  rootFill: "#f5b301",
  rootRim: "#c98a00",
  label: "#334155",
  rootLabel: "#3b2a00",
  out: "220,38,38", // red  — money leaving root
  in: "22,163,74", // green — money entering root
  tipBg: "rgba(255,255,255,0.97)",
  tipRim: "rgba(15,23,42,0.14)",
  tipText: "#0f172a",
  tipSub: "#64748b",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function nodeRadius(node) {
  return node.depth === 0 ? ROOT_RADIUS : NODE_RADIUS;
}

function toWorld(px, py, t) {
  return { x: (px - t.x) / t.k, y: (py - t.y) / t.k };
}

function getNodeAt(nodes, px, py, t) {
  const { x: wx, y: wy } = toWorld(px, py, t);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (Math.hypot((n.x ?? 0) - wx, (n.y ?? 0) - wy) < nodeRadius(n) + 3) return n;
  }
  return null;
}

/** Shortest distance from point p to segment ab. */
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function getEdgeAt(edges, px, py, t) {
  const { x: wx, y: wy } = toWorld(px, py, t);
  const tol = EDGE_HIT_PX / t.k; // keep tolerance constant in screen px
  let best = null;
  let bestD = Infinity;

  for (const e of edges) {
    const s = e.source;
    const tg = e.target;
    if (s?.x == null || tg?.x == null) continue;
    const d = distToSegment(wx, wy, s.x, s.y, tg.x, tg.y);
    if (d < tol && d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

function edgeAmount(e) {
  return Number(e.amount ?? e.totalAmount ?? e.value ?? 0);
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatAmount(v) {
  if (!Number.isFinite(v) || v === 0) return null;
  return money.format(v);
}

/** BENEFICIAL_OWNER → "Beneficial owner" */
function humanize(raw) {
  if (!raw) return null;
  const words = String(raw).replace(/[_-]+/g, " ").trim().toLowerCase();
  if (!words) return null;
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * What to show in the tooltip headline.
 *
 * Transactions carry a value, so the amount is the headline. Everything
 * else (family, ownership, control, legal structure) has no amount, so
 * fall back to the relationship itself — an edge with no label at all is
 * still worth naming rather than showing a bare dash.
 */
function edgeHeadline(edge) {
  const amount = formatAmount(edgeAmount(edge));
  if (amount) return { text: amount, kind: "amount" };

  const rel =
    humanize(edge.relationLabel) ??
    humanize(edge.relationType) ??
    humanize(edge.relationshipType) ??
    humanize(edge.type);

  if (rel && rel.toLowerCase() !== "transaction") {
    return { text: rel, kind: "relation" };
  }
  // A transaction whose amount never came through
  return { text: rel ? "Transaction" : "Connected", kind: "relation" };
}

/**
 * Replace edge.source / edge.target ID strings with the real node objects.
 *
 * d3.forceLink normally does this as a side effect of being added to the
 * simulation. This layout doesn't use forceLink (link forces fight the
 * packing), so the resolution has to happen here — otherwise every edge
 * still holds a string, has no .x/.y, and nothing renders.
 *
 * Returns the edges that resolved on both ends; dangling references to
 * missing nodes are dropped rather than silently skipped every frame.
 */
function resolveEdges(nodes, edges) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const resolved = [];

  for (const e of edges) {
    const s = typeof e.source === "object" ? e.source : byId.get(e.source);
    const t = typeof e.target === "object" ? e.target : byId.get(e.target);
    if (!s || !t) continue; // edge points at a node we don't have
    e.source = s;
    e.target = t;
    resolved.push(e);
  }

  if (resolved.length !== edges.length) {
    console.warn(
      `NetworkGraph: dropped ${edges.length - resolved.length} edge(s) with unknown endpoints`,
    );
  }
  return resolved;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout: dense wedge packing
// ─────────────────────────────────────────────────────────────────────────────
function packWedge(list, cx, cy, angleStart, angleEnd, startRadius) {
  const wedge = angleEnd - angleStart;
  let i = 0;
  let r = startRadius;

  while (i < list.length) {
    const capacity = Math.max(1, Math.floor((wedge * r) / CELL));
    const take = Math.min(capacity, list.length - i);

    for (let k = 0; k < take; k++) {
      const slot = take === 1 ? 0.5 : (k + 0.5) / take;
      const angle = angleStart + slot * wedge;
      const node = list[i++];
      node.targetX = cx + Math.cos(angle) * r;
      node.targetY = cy + Math.sin(angle) * r;
      node.x = node.targetX;
      node.y = node.targetY;
    }
    r += CELL * 0.94;
  }
}

function layoutGraph(nodes, edges, W, H) {
  const root = nodes.find((n) => n.depth === 0);
  const rootId = root?.id;
  const cx = W / 2;
  const cy = H / 2;
  const idOf = (v) => (typeof v === "object" ? v?.id : v);

  const flow = new Map();
  const bump = (id, key, amt) => {
    if (!id || id === rootId) return;
    const rec = flow.get(id) || { in: 0, out: 0, volume: 0, degree: 0 };
    rec[key] += 1;
    rec.degree += 1;
    rec.volume += amt || 0;
    flow.set(id, rec);
  };

  for (const e of edges) {
    const s = idOf(e.source);
    const t = idOf(e.target);
    const amt = edgeAmount(e);
    if (s === rootId) bump(t, "out", amt);
    if (t === rootId) bump(s, "in", amt);
  }

  const outgoing = [];
  const incoming = [];

  for (const node of nodes) {
    if (node.depth === 0) {
      node.x = node.targetX = cx;
      node.y = node.targetY = cy;
      continue;
    }
    const rec = flow.get(node.id) || { in: 0, out: 0, volume: 0, degree: 0 };
    node.flowVolume = rec.volume;
    node.flowDegree = rec.degree;
    if (rec.in > rec.out) {
      node.flowDir = "in";
      incoming.push(node);
    } else {
      node.flowDir = "out";
      outgoing.push(node);
    }
  }

  const byImportance = (a, b) =>
    (b.flowVolume || 0) - (a.flowVolume || 0) || (b.flowDegree || 0) - (a.flowDegree || 0);
  outgoing.sort(byImportance);
  incoming.sort(byImportance);

  const inner = ROOT_RADIUS + CELL * 1.6;
  packWedge(outgoing, cx, cy, -1.36, 1.36, inner);
  packWedge(incoming, cx, cy, Math.PI - 1.42, Math.PI + 1.42, inner);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function NetworkGraph({ data, onNodeClick }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const transformRef = useRef(d3.zoomIdentity);
  const edgesRef = useRef([]); // resolved edges, shared with hover handlers

  const hoveredRef = useRef(null); // hovered node
  const hoverEdgeRef = useRef(null); // hovered edge
  const pointerRef = useRef({ x: 0, y: 0 }); // screen px, for tooltip anchor

  const didDragRef = useRef(false);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const panOriginRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const W = container.clientWidth;
    const H = container.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // Resolve ID strings → node objects BEFORE anything reads .x/.y
    const edges = resolveEdges(data.nodes, data.edges);
    edgesRef.current = edges;

    layoutGraph(data.nodes, edges, W, H);

    const rootNode = data.nodes.find((n) => n.depth === 0);
    if (rootNode) {
      rootNode.fx = W / 2;
      rootNode.fy = H / 2;
    }

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => nodeRadius(d) + 1.5)
          .strength(0.7)
          .iterations(2),
      )
      .force(
        "x",
        d3.forceX((d) => d.targetX).strength((d) => (d.depth === 0 ? 0 : 0.9)),
      )
      .force(
        "y",
        d3.forceY((d) => d.targetY).strength((d) => (d.depth === 0 ? 0 : 0.9)),
      )
      .alpha(0.4)
      .alphaDecay(0.04)
      .alphaMin(0.001);

    simRef.current = simulation;

    // ── Tooltip, drawn in screen space (never scaled by zoom) ─────────────
    function drawTooltip(edge) {
      const headline = edgeHeadline(edge);
      const title = headline.text;

      const srcLabel = edge.source?.label ?? "";
      const tgtLabel = edge.target?.label ?? "";
      const trim = (s) => (s.length > 16 ? s.slice(0, 15) + "…" : s);
      // Money flows in one direction; a relationship just links two parties.
      const glyph = headline.kind === "amount" ? "→" : "—";
      const sub = `${trim(srcLabel)}  ${glyph}  ${trim(tgtLabel)}`;

      ctx.font = "600 14px system-ui";
      const titleW = ctx.measureText(title).width;
      ctx.font = "11px system-ui";
      const subW = ctx.measureText(sub).width;

      const padX = 12;
      const padY = 10;
      const boxW = Math.max(titleW, subW) + padX * 2;
      const boxH = 46;

      // Anchor near cursor, flipped when close to an edge of the canvas
      let bx = pointerRef.current.x + 14;
      let by = pointerRef.current.y - boxH - 10;
      if (bx + boxW > W - 8) bx = pointerRef.current.x - boxW - 14;
      if (by < 8) by = pointerRef.current.y + 16;

      ctx.save();
      ctx.shadowColor = "rgba(15,23,42,0.18)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 3;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 8);
      ctx.fillStyle = C.tipBg;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = C.tipRim;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = C.tipText;
      ctx.font = "600 14px system-ui";
      ctx.fillText(title, bx + padX, by + padY - 1);

      ctx.fillStyle = C.tipSub;
      ctx.font = "11px system-ui";
      ctx.fillText(sub, bx + padX, by + padY + 18);
      ctx.restore();
    }

    function draw() {
      const t = transformRef.current;
      const hovered = hoveredRef.current;
      const hoverEdge = hoverEdgeRef.current;

      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.translate(t.x, t.y);
      ctx.scale(t.k, t.k);

      // ── Edges ───────────────────────────────────────────────────────────
      // On a light background, "lighter" blending washes lines out, so we
      // draw normally and lean on alpha for the density gradient instead.
      for (const link of edges) {
        const s = link.source;
        const tg = link.target;
        if (s?.x == null || tg?.x == null) continue;

        const spoke = s.depth === 0 ? tg : s;
        const rgb = spoke.flowDir === "in" ? C.in : C.out;

        const isHotEdge = hoverEdge === link;
        const touchesHotNode = hovered && (hovered.id === s.id || hovered.id === tg.id);
        const anyHover = hoverEdge || hovered;
        const dim = anyHover && !isHotEdge && !touchesHotNode;

        let alpha = 0.3;
        if (isHotEdge) alpha = 0.95;
        else if (touchesHotNode) alpha = 0.7;
        else if (dim) alpha = 0.07;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tg.x, tg.y);
        ctx.strokeStyle = `rgba(${rgb},${alpha})`;
        ctx.lineWidth = isHotEdge ? 2.4 : touchesHotNode ? 1.4 : 0.7;
        ctx.stroke();
      }

      // ── Nodes ───────────────────────────────────────────────────────────
      for (const node of data.nodes) {
        if (node.x == null) continue;

        const isRoot = node.depth === 0;
        const isHovered = hovered?.id === node.id;
        const onHotEdge =
          hoverEdge && (hoverEdge.source?.id === node.id || hoverEdge.target?.id === node.id);
        const r = nodeRadius(node);
        const risk = getRiskColor(node.riskRating);

        ctx.save();
        if (isRoot || isHovered || onHotEdge) {
          ctx.shadowColor = "rgba(15,23,42,0.18)";
          ctx.shadowBlur = isRoot ? 14 : 10;
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isRoot ? C.rootFill : isHovered || onHotEdge ? C.nodeFillHover : C.nodeFill;
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = isRoot ? C.rootRim : isHovered || onHotEdge ? C.nodeRimHover : C.nodeRim;
        ctx.lineWidth = isRoot ? 2 : isHovered || onHotEdge ? 1.8 : 1;
        ctx.stroke();

        if (!isRoot && risk) {
          const pa = Math.PI * 0.28;
          ctx.beginPath();
          ctx.arc(node.x + Math.cos(pa) * r, node.y + Math.sin(pa) * r, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = risk;
          ctx.fill();
          ctx.strokeStyle = C.bg;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        const raw = node.label ?? "";
        const label = raw.length > 7 ? raw.slice(0, 6) + "…" : raw;
        ctx.font = isRoot ? "bold 9px system-ui" : "8px system-ui";
        ctx.fillStyle = isRoot ? C.rootLabel : C.label;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, node.x, node.y);
      }

      ctx.restore(); // back to screen space

      if (hoverEdge) drawTooltip(hoverEdge);
    }

    simulation.on("tick", draw);
    // Expose so pointer handlers can repaint without waiting for a tick
    canvas.__redraw = draw;
    draw();

    return () => {
      simulation.stop();
      delete canvas.__redraw;
    };
  }, [data]);

  const repaint = () => canvasRef.current?.__redraw?.();

  // ── Zoom ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const zoom = d3
      .zoom()
      .filter((e) => e.type === "wheel" || e.touches?.length >= 2)
      .scaleExtent([0.08, 5])
      .on("zoom", (e) => {
        transformRef.current = e.transform;
        canvas.__redraw?.();
      });
    d3.select(canvas).call(zoom);
    return () => d3.select(canvas).on(".zoom", null);
  }, []);

  // ── Node drag ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let node = null;
    let start = { x: 0, y: 0 };

    const down = (e) => {
      if (e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const hit = getNodeAt(data.nodes, px, py, transformRef.current);
      if (hit && hit.depth !== 0) {
        node = hit;
        didDragRef.current = false;
        start = { x: px, y: py };
        hit.fx = hit.x;
        hit.fy = hit.y;
        simRef.current?.alphaTarget(0.25).restart();
        e.stopPropagation();
      }
    };
    const move = (e) => {
      if (!node) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (Math.hypot(px - start.x, py - start.y) > 3) didDragRef.current = true;
      const t = transformRef.current;
      node.fx = (px - t.x) / t.k;
      node.fy = (py - t.y) / t.k;
    };
    const up = () => {
      if (!node) return;
      node.fx = null;
      node.fy = null;
      node = null;
      simRef.current?.alphaTarget(0);
    };

    canvas.addEventListener("mousedown", down, { capture: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      canvas.removeEventListener("mousedown", down, { capture: true });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [data]);

  // ── Hover (nodes first, then edges) + pan ─────────────────────────────────
  const handleMouseMove = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerRef.current = { x: px, y: py };

      if (isPanningRef.current) {
        const t = transformRef.current;
        transformRef.current = d3.zoomIdentity
          .translate(
            panOriginRef.current.x + (e.clientX - panStartRef.current.x),
            panOriginRef.current.y + (e.clientY - panStartRef.current.y),
          )
          .scale(t.k);
        canvas.__redraw?.();
        return;
      }

      const node = getNodeAt(data.nodes, px, py, transformRef.current);
      // Only test edges when no node is under the cursor
      const edge = node ? null : getEdgeAt(edgesRef.current, px, py, transformRef.current);

      const changed = node?.id !== hoveredRef.current?.id || edge !== hoverEdgeRef.current;

      hoveredRef.current = node;
      hoverEdgeRef.current = edge;
      canvas.style.cursor = node ? "pointer" : edge ? "crosshair" : "grab";

      // Repaint on change, and also while an edge is hovered so the
      // tooltip follows the cursor.
      if (changed || edge) canvas.__redraw?.();
    },
    [data],
  );

  const handleMouseLeave = useCallback(() => {
    isPanningRef.current = false;
    hoveredRef.current = null;
    hoverEdgeRef.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
      canvasRef.current.__redraw?.();
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      if (didDragRef.current) {
        didDragRef.current = false;
        return;
      }
      const rect = canvasRef.current.getBoundingClientRect();
      const found = getNodeAt(
        data.nodes,
        e.clientX - rect.left,
        e.clientY - rect.top,
        transformRef.current,
      );
      if (found) onNodeClick?.(found);
    },
    [data, onNodeClick],
  );

  const handleMouseDown = useCallback((e) => {
    isPanningRef.current = true;
    panStartRef.current = { x: e.clientX, y: e.clientY };
    panOriginRef.current = {
      x: transformRef.current.x,
      y: transformRef.current.y,
    };
    canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[80vh] overflow-hidden bg-[#f7f8fa]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
