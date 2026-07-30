"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Shared ownership-graph canvas (docs/65 Step 70).
 *
 * Extracted from views/companies/ownership-graph so the Trust dossier can
 * draw its own chain without a second copy of the renderer. The split is
 * along the only line that actually differs between the two:
 *
 *   SCENE  — which nodes exist, what they are called, how they are layered
 *            and what each one's detail card says. Entirely domain-specific;
 *            a trust's parties are not a company's shareholders and must not
 *            be labelled as though they were.
 *   CANVAS — fit-to-view zoom, drag, hover card, edge routing, legend. Not
 *            domain-specific at all.
 *
 * This file is the CANVAS. It takes a laid-out scene and draws it. Callers
 * build the scene with the constants and helpers exported here so both graphs
 * stay dimensionally identical — a reviewer moving between a company file and
 * a trust file should not have to re-learn the picture.
 */

export const C = {
  ink: "#1a2331",
  sub: "#79808d",
  faint: "#b0b6bd",
  line: "#e2e5df",
  navy: "#12233d",
  green: "#2f9e83",
  greenInk: "#1f6f5c",
  amberLine: "#d8b98a",
  amberBg: "#f6f4ef",
  amberChip: "#e9dcc4",
  amberInk: "#8a5615",
  amberIcon: "#a67c33",
  trustLine: "#7fada8",
  trustBg: "#f2f7f5",
  trustChip: "#d9e8e3",
  redBg: "#f9ebe8",
  redLine: "#ecc9c2",
  redInk: "#8a2b22",
  warnBg: "#fbf3e8",
  warnLine: "#f0dcbd",
  warnInk: "#8a5615",
};

// Node box vs. type size: on a graph wide enough to be width-bound, a node's
// on-screen width is ~canvasWidth/nodesPerRow whatever NODE_W is — the fit
// ratio just cancels it out. So what actually makes a node read larger is the
// TYPE-to-box ratio (and the fit floor below), not a bigger box.
export const NODE_W = 190;
export const NODE_H = 70;
export const COL_GAP = 20;
export const ROW_GAP = 112;
export const PAD_X = 30;
// Top padding clears the absolutely-positioned legend, which otherwise sits
// on top of the first row of nodes.
export const PAD_Y = 72;
// Vertical spacing of a side column — tracks NODE_H so taller nodes don't touch.
export const DIR_GAP = 80;
const CANVAS_H = 540;
// Breathing room left around the graph when fitting it to the canvas, so
// nodes on the outer edge aren't flush against the border (docs/65 Step 63).
const VIEW_PAD = 16;
// Fit-zoom bounds (docs/65 Step 64). FIT_MAX above 1 lets a sparse graph
// scale UP to fill the canvas instead of sitting small in the middle of it.
// FIT_MIN is the floor past which a graph scrolls instead of shrinking
// further; it's deliberately low, because "every node visible without
// scrolling" (Step 63) beats node size on a genuinely dense chart — the hover
// card carries the detail and one click zooms in.
const FIT_MAX = 1.3;
const FIT_MIN = 0.72;
// Hover card geometry — CARD_*_H are estimates used only to decide whether
// the card would run off the bottom of the canvas, not to size it.
const CARD_W = 264;
const CARD_BASE_H = 86;
const CARD_ROW_H = 32;
const CARD_NOTE_H = 74;

export const initials = (s = "") =>
  String(s)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "—";

export const pct = (v) => (v === undefined || v === null || v === "" ? null : `${v}%`);

/** One scene node. `kind` selects the styling; `detail` fills the hover card. */
export const mk = (id, kind, title, subtitle, detail) => ({ id, kind, title, subtitle, detail });

/** Lay a row of nodes out horizontally, centred on the scene. */
export function placeRow(nodes, y, sceneW) {
  const totalW = nodes.length * NODE_W + Math.max(0, nodes.length - 1) * COL_GAP;
  const startX = Math.max(PAD_X, (sceneW - totalW) / 2);
  return nodes.map((n, i) => ({ ...n, x: startX + i * (NODE_W + COL_GAP) + NODE_W / 2, y }));
}

/**
 * Turn a list of rows (top layer first) into placed nodes plus scene size.
 * Empty rows are dropped by the caller, so an absent layer never leaves a gap
 * in the middle of the chain.
 */
export function layoutRows(rows, { sideColumn = [], sideRowIndex = 0, minWidth = 720 } = {}) {
  const widest = Math.max(...rows.map((r) => r.length), 1);
  const sideColW = sideColumn.length ? NODE_W + 60 : 0;
  const sceneW = Math.max(minWidth, widest * NODE_W + (widest - 1) * COL_GAP + PAD_X * 2 + sideColW);
  const graphW = sceneW - sideColW;

  const placed = [];
  rows.forEach((row, ri) => placed.push(...placeRow(row, PAD_Y + ri * ROW_GAP, graphW)));

  const anchorY = PAD_Y + sideRowIndex * ROW_GAP;
  sideColumn.forEach((n, i) => {
    placed.push({
      ...n,
      x: graphW + sideColW / 2 - 10,
      y: anchorY - ((sideColumn.length - 1) * DIR_GAP) / 2 + i * DIR_GAP,
    });
  });

  const maxY = Math.max(...placed.map((n) => n.y), PAD_Y);
  return { nodes: placed, sceneW, sceneH: maxY + NODE_H + PAD_Y };
}

const DEFAULT_LEGEND = [
  ["Trust", C.trustBg, C.trustLine, 3],
  ["Subject", C.navy, C.green, 3],
  ["Entity", C.amberBg, C.amberLine, 3],
  ["Person", "#f7f8f6", C.faint, "50%"],
];

export default function GraphCanvas({ nodes, edges, sceneW, sceneH, legend = DEFAULT_LEGEND }) {
  // `zoom` is derived: null means "fit to view", which is the default and
  // what the reset button returns to (docs/65 Step 63). An explicit +/- sets
  // an override, and only an override above the fit ratio can overflow.
  const [zoomOverride, setZoomOverride] = useState(null);
  const [hover, setHover] = useState(null); // { id, left, top }
  const [drag, setDrag] = useState({}); // id -> {dx, dy}
  const dragState = useRef(null);
  const frameRef = useRef(null);
  const [frameW, setFrameW] = useState(0);

  // Track the canvas width so the default zoom can fit the whole graph
  // (docs/65 Step 63) — the scene is as wide as the record makes it, so the
  // fit ratio can only be known once the card has been laid out.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    setFrameW(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setFrameW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // "Everything visible, as large as that allows" (docs/65 Step 64) — a
  // sparse graph scales up to fill the canvas rather than sitting small in
  // the middle of it, bounded both ways by FIT_MAX/FIT_MIN.
  const fitZoom = useMemo(() => {
    if (!frameW) return 1;
    return Math.max(FIT_MIN, Math.min(FIT_MAX, (frameW - VIEW_PAD) / sceneW, (CANVAS_H - VIEW_PAD) / sceneH));
  }, [frameW, sceneW, sceneH]);
  const zoom = zoomOverride ?? fitZoom;
  const atFit = zoomOverride === null || Math.abs(zoom - fitZoom) < 0.001;

  const posOf = (n) => (n ? { x: n.x + (drag[n.id]?.dx || 0), y: n.y + (drag[n.id]?.dy || 0) } : { x: 0, y: 0 });

  const onPointerDown = (e, id) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { id, startX: e.clientX, startY: e.clientY, base: drag[id] || { dx: 0, dy: 0 }, moved: false };
  };
  const onPointerMove = (e) => {
    const s = dragState.current;
    if (!s) return;
    const dx = (e.clientX - s.startX) / zoom;
    const dy = (e.clientY - s.startY) / zoom;
    if (Math.abs(dx) + Math.abs(dy) > 3 && !s.moved) {
      s.moved = true;
      // Once it's a real drag, the card would just follow the cursor around
      // and cover the canvas — drop it until the pointer settles again.
      setHover(null);
    }
    setDrag((d) => ({ ...d, [s.id]: { dx: s.base.dx + dx, dy: s.base.dy + dy } }));
  };
  const onPointerUp = (e, n) => {
    const s = dragState.current;
    dragState.current = null;
    // The card was dropped when the drag began; the pointer is still over the
    // node, so no enter event will fire — bring it back explicitly.
    if (s?.moved) onNodeEnter(e, n);
  };

  // Hover detail (docs/65 Step 63). Anchored off the node's real screen rect
  // rather than its scene coordinates, so it lands correctly whatever the
  // zoom and scroll position are, and flips/clamps to stay inside the canvas.
  const onNodeEnter = (e, n) => {
    if (dragState.current) return;
    const frame = frameRef.current;
    if (!frame) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    const cardH = CARD_BASE_H + n.detail.rows.length * CARD_ROW_H + n.detail.notes.length * CARD_NOTE_H;
    const right = r.right - f.left + 12;
    const left = right + CARD_W > f.width ? r.left - f.left - CARD_W - 12 : right;
    setHover({
      id: n.id,
      left: Math.max(8, Math.min(left, f.width - CARD_W - 8)),
      top: Math.max(8, Math.min(r.top - f.top - 6, f.height - cardH - 8)),
    });
  };

  const nodeStyle = (kind, isHovered) => {
    const base = {
      position: "absolute",
      width: NODE_W,
      transform: "translate(-50%, -50%)",
      borderRadius: 13,
      padding: "12px 14px",
      background: "#fff",
      border: `1px solid ${C.line}`,
      cursor: "grab",
      touchAction: "none",
      boxShadow: isHovered ? `0 0 0 3px rgba(47,158,131,.35)` : "0 1px 2px rgba(20,30,45,.06)",
    };
    if (kind === "subject") return { ...base, background: C.navy, border: `2px solid ${C.green}` };
    if (kind === "trust") return { ...base, background: C.trustBg, border: `1px solid ${C.trustLine}` };
    if (kind === "entity") return { ...base, background: C.amberBg, border: `1px solid ${C.amberLine}` };
    if (kind === "person" || kind === "person-flag" || kind === "person-dashed")
      return { ...base, background: "#f7f8f6", border: `1px dashed ${C.faint}` };
    return base;
  };

  const avatarFor = (n) => {
    if (n.kind === "subject") return { bg: C.green, fg: "#fff", radius: 8 };
    if (n.kind === "trust") return { bg: C.trustChip, fg: C.greenInk, radius: 8 };
    if (n.kind === "entity") return { bg: C.amberChip, fg: C.amberIcon, radius: 8 };
    if (n.kind.startsWith("person")) return { bg: "#e6ebe9", fg: "#8a92a0", radius: "50%" };
    return { bg: "#e6ebe9", fg: "#3f4756", radius: 8 };
  };

  const hovered = hover && nodes.find((n) => n.id === hover.id);

  return (
    <div style={{ marginBottom: 22 }}>
      <div ref={frameRef} style={{ position: "relative", border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden", background: "#fbfbfa" }}>
        <div
          // Scrolls only when zoomed past the fit ratio — at the default zoom
          // the sizer below is exactly the viewport size, so there is nothing
          // to scroll (docs/65 Step 63). A scroll would leave the hover card
          // stranded, so it's dismissed on scroll.
          onScroll={() => setHover(null)}
          style={{
            height: CANVAS_H,
            overflow: "auto",
            backgroundImage: "radial-gradient(circle, #e3e6e1 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          {/* A CSS transform doesn't change layout size, so the scroll area
              would still reserve the unscaled scene and show scrollbars at
              any zoom. This sizer carries the SCALED dimensions. `margin: 0
              auto` centres a graph narrower than the canvas — and, unlike
              flex centring, collapses to 0 rather than clipping the left
              edge once the content is wider than the viewport. */}
          <div style={{ width: sceneW * zoom, height: sceneH * zoom, position: "relative", margin: "0 auto" }}>
            <div
              style={{
                position: "relative",
                width: sceneW,
                height: sceneH,
                transform: `scale(${zoom})`,
                transformOrigin: "0 0",
                transition: "transform .18s ease",
              }}
            >
              <svg style={{ position: "absolute", inset: 0, width: sceneW, height: sceneH, pointerEvents: "none" }}>
                {edges.map((e, i) => {
                  const a = posOf(nodes.find((n) => n.id === e.from));
                  const b = posOf(nodes.find((n) => n.id === e.to));
                  const dx = Math.abs(b.x - a.x);
                  const dy = Math.abs(b.y - a.y);
                  // Curve along the dominant axis, as the design does.
                  const d =
                    dx > dy * 0.8
                      ? `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`
                      : `M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`;
                  return <path key={i} d={d} stroke={e.stroke} strokeWidth={e.width} fill="none" strokeDasharray={e.dash || undefined} />;
                })}
              </svg>

              {edges
                .filter((e) => e.label)
                .map((e, i) => {
                  const a = posOf(nodes.find((n) => n.id === e.from));
                  const b = posOf(nodes.find((n) => n.id === e.to));
                  return (
                    <div
                      key={`l${i}`}
                      style={{
                        position: "absolute",
                        left: (a.x + b.x) / 2 + 10,
                        top: (a.y + b.y) / 2,
                        transform: "translateY(-50%)",
                        fontFamily: "var(--font-mono, ui-monospace, monospace)",
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#3f4756",
                        background: "#eef0ee",
                        padding: "1px 6px",
                        borderRadius: 5,
                        pointerEvents: "none",
                      }}
                    >
                      {e.label}
                    </div>
                  );
                })}

              {nodes.map((n) => {
                const p = posOf(n);
                const av = avatarFor(n);
                const isSubject = n.kind === "subject";
                return (
                  <div
                    key={n.id}
                    style={{ ...nodeStyle(n.kind, hover?.id === n.id), left: p.x, top: p.y }}
                    onPointerDown={(e) => onPointerDown(e, n.id)}
                    onPointerMove={onPointerMove}
                    onPointerUp={(e) => onPointerUp(e, n)}
                    onPointerEnter={(e) => onNodeEnter(e, n)}
                    onPointerLeave={() => setHover((h) => (h?.id === n.id ? null : h))}
                    title={n.title}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: av.radius,
                          background: av.bg,
                          color: av.fg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 11.5,
                          fontWeight: 700,
                        }}
                      >
                        {initials(n.title)}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: isSubject ? "#fff" : C.ink,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: isSubject ? "#9db0cc" : n.kind === "entity" ? C.amberInk : C.sub,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {n.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hover detail (docs/65 Step 63) — replaces the click-driven rail.
            pointerEvents:none on purpose: it's read-only, and a card that
            could take the pointer would steal the leave event and flicker. */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              left: hover.left,
              top: hover.top,
              width: CARD_W,
              maxHeight: CANVAS_H - 16,
              overflow: "hidden",
              background: "#fff",
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 10px 28px rgba(20,30,45,.14)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: avatarFor(hovered).radius,
                  background: avatarFor(hovered).bg,
                  color: avatarFor(hovered).fg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 11.5,
                  flexShrink: 0,
                }}
              >
                {initials(hovered.title)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, wordBreak: "break-word" }}>{hovered.title}</div>
                <div style={{ fontSize: 11.5, color: C.sub }}>{hovered.detail.role}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 1, background: "#eef0ec", border: "1px solid #eef0ec", borderRadius: 10, overflow: "hidden" }}>
              {hovered.detail.rows.map(([k, v]) => (
                <div key={k} style={{ background: "#fff", padding: "8px 11px", display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontSize: 11.5, color: "#8a92a0", flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
                </div>
              ))}
            </div>
            {hovered.detail.notes.map((n, i) => (
              <div key={i} style={{ marginTop: 10, padding: "10px 12px", background: n[0], border: `1px solid ${n[1]}`, borderRadius: 11 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: n[2] }}>{n[3]}</div>
                <div style={{ fontSize: 11, color: "#7c6b52", marginTop: 3, lineHeight: 1.5 }}>{n[4]}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["+", () => setZoomOverride(Math.min(zoom + 0.2, 2.5)), "Zoom in"],
            [atFit ? "FIT" : `${Math.round(zoom * 100)}%`, () => setZoomOverride(null), "Fit the whole graph in view"],
            ["−", () => setZoomOverride(Math.max(zoom - 0.2, 0.3)), "Zoom out"],
          ].map(([label, fn, tip], i) => (
            <button
              key={i}
              type="button"
              onClick={fn}
              title={tip}
              style={{
                width: 34,
                height: i === 1 ? 22 : 34,
                border: `1px solid #dfe3dc`,
                background: "#fff",
                borderRadius: 8,
                color: "#5b6474",
                cursor: "pointer",
                fontFamily: i === 1 ? "var(--font-mono, ui-monospace, monospace)" : "inherit",
                fontSize: i === 1 ? 9.5 : 16,
                fontWeight: i === 1 ? 600 : 400,
                boxShadow: "0 2px 6px rgba(20,30,45,.08)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ position: "absolute", top: 12, left: 14, display: "flex", gap: 12, flexWrap: "wrap", fontSize: 10.5, color: C.sub }}>
          {legend.map(([label, bg, bd, r]) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: r, background: bg, border: `1px solid ${bd}` }} />
              {label}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 10.5, color: C.faint, pointerEvents: "none" }}>
          Hover a node for its detail · drag to rearrange
        </div>
      </div>
    </div>
  );
}
