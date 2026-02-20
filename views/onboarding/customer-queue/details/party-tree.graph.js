"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";


const TX_MIN_WIDTH = 1.5;
const TX_MAX_WIDTH = 8;


/* ─── Colors ────────────────────────────────────────── */
const PALETTE = {
  individual: { fill: "#2563eb", bg: "#eff6ff", ring: "#bfdbfe" },
  business: { fill: "#7c3aed", bg: "#f5f3ff", ring: "#ddd6fe" },
} ;

function palette(type) {
  return type === "individual" ? PALETTE.individual : PALETTE.business;
}

function getRelColor(rel) {
  return rel === "family" ? "#3b82f6" : "#94a3b8";
}

function fmt(amount, currency) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ${currency}`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ${currency}`;
  return `${amount} ${currency}`;
}

/* ─── Radial layout ─────────────────────────────────── */
const NODE_R = 32;
const ORBIT = 180;

function computeRadial(
  entities,
  expanded,
  cx,
  cy,
) {
  const pos = new Map();
  const kids = new Map();

  for (const e of entities) {
    if (e.invitedBy) {
      const list = kids.get(e.invitedBy) || [];
      list.push(e);
      kids.set(e.invitedBy, list);
    }
  }

  const root = entities.find((e) => e.invitedBy === null);
  if (!root) return pos;
  pos.set(root.name, { x: cx, y: cy });

  function place(parent, aS, aE, d) {
    if (!expanded.has(parent)) return;
    const ch = kids.get(parent) || [];
    if (!ch.length) return;
    const r = ORBIT * d;
    const step = (aE - aS) / ch.length;
    ch.forEach((c, i) => {
      const a = aS + step * (i + 0.5);
      pos.set(c.name, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      place(c.name, aS + step * i, aS + step * (i + 1), d + 1);
    });
  }
  place(root.name, 0, 2 * Math.PI, 1);
  return pos;
}

/* ─── Component ─────────────────────────────────────── */
export function PartyTreeGraph({
  entities,
  expandAllRef,
  collapseAllRef,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const [dims, setDims] = useState({ width: 1000, height: 700 });
  const [expanded, setExpanded] = useState(new Set());
  const [revealed, setRevealed] = useState(new Set());
  const [hoveredTx, setHoveredTx] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const [dragged, setDragged] = useState(new Map());
  const dragRef = useRef(null);
  const didDrag = useRef(false);

  const [vb, setVb] = useState({ x: 0, y: 0, w: 1000, h: 700 });
  const vbR = useRef(vb);
  vbR.current = vb;
  const [zoom, setZoom] = useState(1);
  const zR = useRef(zoom);
  zR.current = zoom;
  const panRef = useRef(null);
  const mode = useRef("none");

  /* Resize */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setDims({ width, height: Math.max(560, height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setVb({ x: 0, y: 0, w: dims.width, h: dims.height });
  }, [dims]);

  /* Maps */
  const eMap = useMemo(() => {
    const m = new Map();
    for (const e of entities) m.set(e.name, e);
    return m;
  }, [entities]);

  const kidsOf = useMemo(() => {
    const m = new Map();
    for (const e of entities) {
      if (e.invitedBy) {
        const l = m.get(e.invitedBy) || [];
        l.push(e.name);
        m.set(e.invitedBy, l);
      }
    }
    return m;
  }, [entities]);

  const rootName = useMemo(() => entities.find((e) => e.invitedBy === null)?.name ?? "", [entities]);

  const depthOf = useMemo(() => {
    const d = new Map();
    d.set(rootName, 0);
    const walk = (n, depth) => {
      for (const c of kidsOf.get(n) || []) { d.set(c, depth + 1); walk(c, depth + 1); }
    };
    walk(rootName, 0);
    return d;
  }, [rootName, kidsOf]);

  /* Expand / Collapse all */
  const expandAll = useCallback(() => {
    const all = new Set();
    for (const [n] of kidsOf) all.add(n);
    if (rootName) all.add(rootName);
    setExpanded(all);
    setDragged(new Map());
  }, [kidsOf, rootName]);

  const collapseAll = useCallback(() => {
    setExpanded(new Set());
    setDragged(new Map());
  }, []);

  useEffect(() => {
    if (expandAllRef) expandAllRef.current = expandAll;
    if (collapseAllRef) collapseAllRef.current = collapseAll;
  }, [expandAll, collapseAll, expandAllRef, collapseAllRef]);

  /* Positions */
  const radial = useMemo(
    () => computeRadial(entities, expanded, dims.width / 2, dims.height / 2),
    [entities, expanded, dims],
  );

  const nPos = useMemo(() => {
    const m = new Map();
    for (const [n, p] of radial) m.set(n, dragged.get(n) ?? p);
    return m;
  }, [radial, dragged]);

  /* Links */
  const { relLinks, txLinks } = useMemo(() => {
    const relLinks = [];
    const txLinks = [];

    for (const e of entities) {
      if (e.invitedBy && nPos.has(e.name) && nPos.has(e.invitedBy)) {
        relLinks.push({ kind: "relation", sourceName: e.invitedBy, targetName: e.name, relation: e.relation, relationType: e.relationType });
      }
    }

    // Outgoing links (red dashed): drawn from sender -> receiver
    for (const e of entities) {
      if (!nPos.has(e.name)) continue;
      for (const tx of e.outgoingTransactions) {
        if (tx.to && nPos.has(tx.to))
          txLinks.push({ kind: "outgoing", sourceName: e.name, targetName: tx.to, amount: tx.amount, currency: tx.currency, purpose: tx.purpose });
      }
    }

    // Incoming links (green solid): drawn from sender -> this entity
    // These are always drawn separately even if a matching outgoing exists,
    // because the green line represents the receiver's perspective.
    const inSeen = new Set();
    for (const e of entities) {
      if (!nPos.has(e.name)) continue;
      for (const tx of e.incomingTransactions) {
        if (tx.from && nPos.has(tx.from)) {
          // Deduplicate within incoming only (avoid drawing the same incoming twice)
          const k = `${tx.from}~${e.name}~${tx.amount}~${tx.purpose}`;
          if (!inSeen.has(k)) {
            inSeen.add(k);
            txLinks.push({ kind: "incoming", sourceName: tx.from, targetName: e.name, amount: tx.amount, currency: tx.currency, purpose: tx.purpose });
          }
        }
      }
    }

    return { relLinks, txLinks };
  }, [entities, nPos]);

  const maxAmt = useMemo(() => {
    let m = 0;
    for (const l of txLinks) if (l.amount > m) m = l.amount;
    return m || 1;
  }, [txLinks]);

  const txW = (a) => TX_MIN_WIDTH + (a / maxAmt) * (TX_MAX_WIDTH - TX_MIN_WIDTH);

  /* Node click */
  const onClick = useCallback(
    (name) => {
      if (didDrag.current) { didDrag.current = false; return; }
      const ch = kidsOf.get(name);
      if (!ch?.length) return;

      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
          const rm = (n) => { for (const c of kidsOf.get(n) || []) { next.delete(c); rm(c); } };
          rm(name);
          setDragged((d) => { const nd = new Map(d); const r = (n) => { for (const c of kidsOf.get(n) || []) { nd.delete(c); r(c); } }; r(name); return nd; });
        } else {
          next.add(name);
          setRevealed(new Set(ch));
          setTimeout(() => setRevealed(new Set()), 500);
        }
        return next;
      });
    },
    [kidsOf],
  );

  /* Pointer helpers */
  const s2svg = useCallback((cx, cy) => {
    const r = svgRef.current?.getBoundingClientRect();
    const v = vbR.current;
    if (!r) return { x: cx, y: cy };
    return { x: v.x + ((cx - r.left) / r.width) * v.w, y: v.y + ((cy - r.top) / r.height) * v.h };
  }, []);

  const onNodeDown = useCallback((name, e) => {
    e.stopPropagation(); e.preventDefault();
    mode.current = "drag";
    const pt = s2svg(e.clientX, e.clientY);
    const p = nPos.get(name);
    if (!p) return;
    dragRef.current = { name, sm: pt, sp: { ...p } };
    didDrag.current = false;
  }, [s2svg, nPos]);

  const onCanvasDown = useCallback((e) => {
    if (mode.current === "drag") return;
    mode.current = "pan";
    const v = vbR.current;
    panRef.current = { sm: { x: e.clientX, y: e.clientY }, sv: { x: v.x, y: v.y } };
  }, []);

  const onMove = useCallback((e) => {
    if (mode.current === "drag") {
      const d = dragRef.current;
      if (!d) return;
      const pt = s2svg(e.clientX, e.clientY);
      const dx = pt.x - d.sm.x;
      const dy = pt.y - d.sm.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
      const targetName = d.name;
      const newX = d.sp.x + dx;
      const newY = d.sp.y + dy;
      setDragged((prev) => {
        const next = new Map(prev);
        next.set(targetName, { x: newX, y: newY });
        return next;
      });
      return;
    }
    if (mode.current === "pan") {
      const p = panRef.current;
      if (!p) return;
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      const v = vbR.current;
      const sx = v.w / r.width;
      const sy = v.h / r.height;
      setVb({
        ...v,
        x: p.sv.x - (e.clientX - p.sm.x) * sx,
        y: p.sv.y - (e.clientY - p.sm.y) * sy,
      });
    }
  }, [s2svg]);

  const onUp = useCallback(() => { dragRef.current = null; panRef.current = null; mode.current = "none"; }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const f = e.deltaY > 0 ? 1.08 : 0.92;
    const z = zR.current;
    const v = vbR.current;
    const nz = Math.max(0.3, Math.min(4, z * f));
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const mx = v.x + ((e.clientX - r.left) / r.width) * v.w;
    const my = v.y + ((e.clientY - r.top) / r.height) * v.h;
    const nw = dims.width / nz;
    const nh = dims.height / nz;
    setVb({ x: mx - ((mx - v.x) / v.w) * nw, y: my - ((my - v.y) / v.h) * nh, w: nw, h: nh });
    setZoom(nz);
  }, [dims]);

  /* Tx line hover */
  const txEnter = useCallback((link, e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredTx({ link, x: e.clientX - r.left, y: e.clientY - r.top - 14 });
  }, []);
  const txMove = useCallback((e) => {
    if (!hoveredTx) return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredTx((p) => p ? { ...p, x: e.clientX - r.left, y: e.clientY - r.top - 14 } : null);
  }, [hoveredTx]);
  const txLeave = useCallback(() => setHoveredTx(null), []);

  /* Node hover */
    const nodeEnter = useCallback((name, e) => {
    const ent = eMap.get(name);
    if (!ent) return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredNode({ e: ent, x: e.clientX - r.left, y: e.clientY - r.top - 14 });
  }, [eMap]);
  const nodeLeave = useCallback(() => setHoveredNode(null), []);

  /* Line geometry */
  function lg(s, t, off = 0) {
    const a = nPos.get(s);
    const b = nPos.get(t);
    if (!a || !b) return null;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / d;
    const ny = dy / d;
    const px = -ny * off;
    const py = nx * off;
    return {
      x1: a.x + nx * (NODE_R + 4) + px, y1: a.y + ny * (NODE_R + 4) + py,
      x2: b.x - nx * (NODE_R + 4) + px, y2: b.y - ny * (NODE_R + 4) + py,
      mx: (a.x + b.x) / 2 + px, my: (a.y + b.y) / 2 + py,
    };
  }

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[560px] select-none overflow-hidden bg-[#fafafa]">
      <svg
        ref={svgRef}
        width={dims.width}
        height={dims.height}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={onCanvasDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onWheel={onWheel}
      >
        <defs>
          <filter id="ns" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#64748b" floodOpacity="0.12" />
          </filter>
          <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Glow filter for high-amount tx lines */}
          <filter id="txGlowRed" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0.1  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" result="cr" />
            <feMerge><feMergeNode in="cr" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="txGlowGreen" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 1 0 0 0.1  0 0 0 0 0  0 0 0 0.35 0" result="cg" />
            <feMerge><feMergeNode in="cg" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {[1, 2, 3].map((d) => (
          <g key={`o${d}`}>
            <circle cx={dims.width / 2} cy={dims.height / 2} r={ORBIT * d} fill="none" stroke="#e2e8f0" strokeWidth="0.75" strokeDasharray="4 6" opacity="0.6" />
            <text x={dims.width / 2 + ORBIT * d + 4} y={dims.height / 2 - 4} fill="#cbd5e1" fontSize="9" fontWeight="500">
              {d === 1 ? "1st" : d === 2 ? "2nd" : "3rd"}
            </text>
          </g>
        ))}

        {/* Relation links */}
        {relLinks.map((l) => {
          const g = lg(l.sourceName, l.targetName);
          if (!g) return null;
          const isNew = revealed.has(l.targetName);
          const c = getRelColor(l.relationType);
          return (
            <g key={`r~${l.sourceName}~${l.targetName}`}>
              <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke={c} strokeWidth={1.2} opacity={isNew ? 0 : 0.35} strokeLinecap="round" style={isNew ? { animation: "fiL .5s ease-out forwards" } : undefined} />
              <rect x={g.mx - 30} y={g.my - 8} width={60} height={16} rx={8} fill="white" stroke="#e2e8f0" strokeWidth="0.5" opacity={isNew ? 0 : 0.95} style={isNew ? { animation: "fiL .5s ease-out .15s forwards" } : undefined} />
              <text x={g.mx} y={g.my + 0.5} textAnchor="middle" dominantBaseline="central" fill={c} fontSize="7.5" fontWeight="500" letterSpacing="0.01em" className="pointer-events-none" opacity={isNew ? 0 : 1} style={isNew ? { animation: "fiL .5s ease-out .15s forwards" } : undefined}>
                {l.relation}
              </text>
            </g>
          );
        })}

        {/* Transaction links */}
        {txLinks.map((l, i) => {
          const isOut = l.kind === "outgoing";
          const col = isOut ? "#dc2626" : "#16a34a";
          const bgF = isOut ? "#fef2f2" : "#f0fdf4";
          const bgS = isOut ? "#fecaca" : "#bbf7d0";
          const off = isOut ? 10 : -10;
          const g = lg(l.sourceName, l.targetName, off);
          if (!g) return null;
          const hovered = hoveredTx?.link === l;
          const bw = txW(l.amount);
          const ratio = l.amount / maxAmt;
          const isLarge = ratio > 0.6;
          const isMedium = ratio > 0.3;
          const glowFilter = isLarge ? (isOut ? "url(#txGlowRed)" : "url(#txGlowGreen)") : undefined;

          // Badge size scales with amount
          const badgeW = isLarge ? 80 : isMedium ? 68 : 58;
          const badgeH = isLarge ? 20 : isMedium ? 17 : 14;
          const badgeR = badgeH / 2;
          const badgeFont = isLarge ? 9 : isMedium ? 8 : 7;

          return (
            <g key={`t~${l.kind}~${l.sourceName}~${l.targetName}~${i}`}>
              {/* Hit area */}
              <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="transparent" strokeWidth={Math.max(16, bw + 10)} className="cursor-pointer" onMouseEnter={(e) => txEnter(l, e)} onMouseMove={txMove} onMouseLeave={txLeave} />
              {/* Visible line */}
              <line
                x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
                stroke={col}
                strokeWidth={hovered ? bw + 1.5 : bw}
                strokeDasharray={isOut ? "6 3" : "none"}
                opacity={hovered ? 1 : isLarge ? 0.7 : 0.45}
                strokeLinecap="round"
                filter={hovered || isLarge ? glowFilter : undefined}
                className="pointer-events-none transition-all duration-150"
              />
              {/* Amount badge */}
              <rect
                x={g.mx - badgeW / 2} y={g.my - badgeH / 2}
                width={badgeW} height={badgeH} rx={badgeR}
                fill={hovered ? col : bgF}
                stroke={hovered ? col : bgS}
                strokeWidth={isLarge ? 1 : 0.5}
                className="pointer-events-none"
                filter={isLarge && !hovered ? glowFilter : undefined}
              />
              <text
                x={g.mx} y={g.my + 0.5}
                textAnchor="middle" dominantBaseline="central"
                fill={hovered ? "#fff" : col}
                fontSize={badgeFont}
                fontWeight={isLarge ? "800" : "700"}
                letterSpacing="0.02em"
                className="pointer-events-none"
              >
                {fmt(l.amount, l.currency)}
              </text>
              {/* Large amount visual emphasis -- small icon */}
              {isLarge && !hovered && (
                <circle cx={g.mx - badgeW / 2 + 7} cy={g.my} r={3} fill={col} opacity="0.5" className="pointer-events-none">
                  <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {Array.from(nPos.entries()).map(([name, pos]) => {
          const ent = eMap.get(name);
          if (!ent) return null;
          const isExp = expanded.has(name);
          const isNew = revealed.has(name);
          const hasK = (kidsOf.get(name) || []).length > 0;
          const p = palette(ent.type);
          const depth = depthOf.get(name) ?? 0;
          const ini = name.split(" ").map((w) => w[0]).join("").slice(0, 2);
          const tOut = ent.outgoingTransactions.reduce((s, t) => s + t.amount, 0);
          const tIn = ent.incomingTransactions.reduce((s, t) => s + t.amount, 0);

          return (
            <g
              key={name}
              className="cursor-pointer"
              onPointerDown={(e) => onNodeDown(name, e)}
              onClick={() => onClick(name)}
              onMouseEnter={(e) => nodeEnter(name, e)}
              onMouseLeave={nodeLeave}
              style={isNew ? { animation: "fiN .4s ease-out forwards", opacity: 0 } : undefined}
            >
              {/* Expanded glow */}
              {isExp && (
                <circle cx={pos.x} cy={pos.y} r={NODE_R + 8} fill="none" stroke={p.fill} strokeWidth="1.5" opacity="0.15" filter="url(#gl)" />
              )}

              {/* Main circle */}
              <circle
                cx={pos.x} cy={pos.y} r={NODE_R}
                fill={isExp ? p.fill : "#fff"}
                stroke={isExp ? p.fill : "#e2e8f0"}
                strokeWidth={isExp ? 2 : 1}
                filter="url(#ns)"
              />

              {/* Inner accent ring */}
              {isExp && <circle cx={pos.x} cy={pos.y} r={NODE_R - 2.5} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />}

              {/* Inactive dashed ring */}
              {!ent.active && <circle cx={pos.x} cy={pos.y} r={NODE_R + 3} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />}

              {/* Degree badge */}
              {depth > 0 && (
                <>
                  <circle cx={pos.x - NODE_R * 0.65} cy={pos.y - NODE_R * 0.65} r={7} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.75" />
                  <text x={pos.x - NODE_R * 0.65} y={pos.y - NODE_R * 0.65 + 0.5} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="7.5" fontWeight="600" className="pointer-events-none">{depth}</text>
                </>
              )}

              {/* Type badge */}
              <circle cx={pos.x + NODE_R * 0.65} cy={pos.y - NODE_R * 0.65} r={7} fill={p.bg} stroke={p.ring} strokeWidth="0.75" />
              <text x={pos.x + NODE_R * 0.65} y={pos.y - NODE_R * 0.65 + 0.5} textAnchor="middle" dominantBaseline="central" fill={p.fill} fontSize="7" fontWeight="700" className="pointer-events-none">
                {ent.type === "individual" ? "P" : "B"}
              </text>

              {/* Expand / Collapse badge */}
              {hasK && (
                <>
                  <circle cx={pos.x + NODE_R * 0.7} cy={pos.y + NODE_R * 0.7} r={8} fill={isExp ? p.bg : "#f8fafc"} stroke={isExp ? p.ring : "#e2e8f0"} strokeWidth="0.75" />
                  <text x={pos.x + NODE_R * 0.7} y={pos.y + NODE_R * 0.7 + 0.5} textAnchor="middle" dominantBaseline="central" fill={isExp ? p.fill : "#94a3b8"} fontSize="11" fontWeight="600" className="pointer-events-none">
                    {isExp ? "\u2212" : "+"}
                  </text>
                </>
              )}

              {/* Out / In indicators */}
              {tOut > 0 && (
                <>
                  <circle cx={pos.x - NODE_R * 0.7} cy={pos.y + NODE_R * 0.7} r={7} fill="#fef2f2" stroke="#fecaca" strokeWidth="0.5" />
                  <text x={pos.x - NODE_R * 0.7} y={pos.y + NODE_R * 0.7 + 0.5} textAnchor="middle" dominantBaseline="central" fill="#dc2626" fontSize="5.5" fontWeight="700" className="pointer-events-none">OUT</text>
                </>
              )}
              {tIn > 0 && (
                <>
                  <circle cx={pos.x - NODE_R * 0.7 + (tOut > 0 ? 16 : 0)} cy={pos.y + NODE_R * 0.7} r={7} fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="0.5" />
                  <text x={pos.x - NODE_R * 0.7 + (tOut > 0 ? 16 : 0)} y={pos.y + NODE_R * 0.7 + 0.5} textAnchor="middle" dominantBaseline="central" fill="#16a34a" fontSize="5.5" fontWeight="700" className="pointer-events-none">IN</text>
                </>
              )}

              {/* Initials */}
              <text x={pos.x} y={pos.y - 1} textAnchor="middle" dominantBaseline="central" fill={isExp ? "#fff" : "#1e293b"} fontSize="12" fontWeight="700" letterSpacing="0.02em" className="pointer-events-none">{ini}</text>

              {/* Type sublabel */}
              <text x={pos.x} y={pos.y + 11} textAnchor="middle" dominantBaseline="central" fill={isExp ? "rgba(255,255,255,0.6)" : "#94a3b8"} fontSize="6.5" className="pointer-events-none capitalize">{ent.type}</text>

              {/* Name */}
              <text x={pos.x} y={pos.y + NODE_R + 14} textAnchor="middle" fill={isExp ? "#0f172a" : "#64748b"} fontSize="9" fontWeight={isExp ? "600" : "400"} className="pointer-events-none">
                {name.length > 22 ? `${name.slice(0, 20)}...` : name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Animations */}
      <style jsx>{`
        @keyframes fiN { from { opacity:0; transform:scale(.6); } to { opacity:1; transform:scale(1); } }
        @keyframes fiL { from { opacity:0; } to { opacity:.6; } }
      `}</style>

      {/* Tx tooltip */}
      {hoveredTx && (() => {
        const isOut = hoveredTx.link.kind === "outgoing";
        const col = isOut ? "#dc2626" : "#16a34a";
        const label = isOut ? "Outgoing" : "Incoming";
        return (
          <div
            className="absolute pointer-events-none z-50 rounded-xl border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg"
            style={{ left: hoveredTx.x, top: hoveredTx.y, transform: "translate(-50%,-100%)", maxWidth: 260, borderColor: isOut ? "#fecaca" : "#bbf7d0" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-1.5 w-3 rounded-full" style={{ backgroundColor: col }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: col }}>{label}</span>
            </div>
            <div className="text-sm font-bold text-foreground">{fmt(hoveredTx.link.amount, hoveredTx.link.currency)}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{hoveredTx.link.sourceName}</span>
              <span className="mx-1 text-muted-foreground/50">{"->"}</span>
              <span className="font-medium text-foreground">{hoveredTx.link.targetName}</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{hoveredTx.link.purpose}</div>
          </div>
        );
      })()}

      {/* Node tooltip */}
      {hoveredNode && !hoveredTx && (
        <div
          className="absolute pointer-events-none z-50 rounded-xl border border-border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg"
          style={{ left: hoveredNode.x, top: hoveredNode.y, transform: "translate(-50%,-100%)", maxWidth: 280 }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: palette(hoveredNode.e.type).fill }} />
            <span className="text-sm font-semibold text-foreground">{hoveredNode.e.name}</span>
          </div>
          <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
            <div className="capitalize">{hoveredNode.e.type} &middot; {hoveredNode.e.client}</div>
            <div>Relation: <span className="font-medium" style={{ color: getRelColor(hoveredNode.e.relationType) }}>{hoveredNode.e.relation}</span></div>
            <div>Channel: {hoveredNode.e.onboardingChannel}</div>
            {hoveredNode.e.notes && <div className="italic">{hoveredNode.e.notes}</div>}
          </div>
          {(depthOf.get(hoveredNode.e.name) ?? 0) > 0 && (
            <div className="mt-1.5 text-[11px] text-muted-foreground">Degree: {depthOf.get(hoveredNode.e.name)}</div>
          )}
          {(hoveredNode.e.outgoingTransactions.length > 0 || hoveredNode.e.incomingTransactions.length > 0) && (
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              {hoveredNode.e.outgoingTransactions.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#dc2626" }}>Out ({hoveredNode.e.outgoingTransactions.length})</span>
                  {hoveredNode.e.outgoingTransactions.map((tx, i) => (
                    <div key={i} className="text-[11px] text-muted-foreground">{fmt(tx.amount, tx.currency)} to {tx.to}</div>
                  ))}
                </div>
              )}
              {hoveredNode.e.incomingTransactions.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#16a34a" }}>In ({hoveredNode.e.incomingTransactions.length})</span>
                  {hoveredNode.e.incomingTransactions.map((tx, i) => (
                    <div key={i} className="text-[11px] text-muted-foreground">{fmt(tx.amount, tx.currency)} from {tx.from}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          {(kidsOf.get(hoveredNode.e.name) || []).length > 0 && (
            <div className="mt-1.5 text-[11px] font-medium" style={{ color: palette(hoveredNode.e.type).fill }}>
              {expanded.has(hoveredNode.e.name) ? "Click to collapse" : "Click to expand"}
            </div>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
        {[
          { label: "+", fn: () => { const nz = Math.min(4, zoom * 1.25); const nw = dims.width / nz; const nh = dims.height / nz; const cx = vb.x + vb.w / 2; const cy = vb.y + vb.h / 2; setVb({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh }); setZoom(nz); } },
          { label: "\u2212", fn: () => { const nz = Math.max(0.3, zoom * 0.8); const nw = dims.width / nz; const nh = dims.height / nz; const cx = vb.x + vb.w / 2; const cy = vb.y + vb.h / 2; setVb({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh }); setZoom(nz); } },
          { label: "R", fn: () => { setVb({ x: 0, y: 0, w: dims.width, h: dims.height }); setZoom(1); setDragged(new Map()); } },
        ].map(({ label, fn }) => (
          <button
            key={label}
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-foreground text-xs font-medium shadow-sm hover:bg-accent transition-colors"
            onClick={fn}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
