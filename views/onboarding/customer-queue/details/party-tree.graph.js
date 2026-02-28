"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TX_MIN_W = 1.5;
const TX_MAX_W = 8;
const NODE_R = 30;
const ORBIT = 170;

/* ─── Colors ─────────────────────────────────────────── */
const PAL = {
  INDIVIDUAL: { fill: "#2563eb", bg: "#eff6ff", ring: "#bfdbfe" },
  BUSINESS: { fill: "#7c3aed", bg: "#f5f3ff", ring: "#ddd6fe" },
  LEGAL_ENTITY: { fill: "#0d9488", bg: "#f0fdfa", ring: "#99f6e4" },
};

function pal(t) {
  if (t === "INDIVIDUAL") return PAL.INDIVIDUAL;
  if (t === "LEGAL_ENTITY") return PAL.LEGAL_ENTITY;
  return PAL.BUSINESS;
}

function relColor(t) {
  switch (t) {
    case "FAMILY":
      return "#3b82f6";
    case "SOCIAL":
      return "#a855f7";
    case "OWNERSHIP":
    case "CONTROL":
      return "#7c3aed";
    case "LEGAL_STRUCTURE":
      return "#0d9488";
    default:
      return "#94a3b8";
  }
}

function riskColor(r) {
  if (r === "HIGH") return "#ef4444";
  if (r === "MEDIUM") return "#f59e0b";
  return "#22c55e";
}

function fmt(n, c) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ${c}`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K ${c}`;
  return `${n} ${c}`;
}

function getSubnet(ip) {
  const parts = ip.split(".");
  return parts.slice(0, 2).join(".");
}

/* ─── Radial layout ──────────────────────────────────── */
function computeRadial(entities, expanded, cx, cy) {
  const pos = new Map();
  const kids = new Map();
  for (const e of entities) {
    if (e.parentName) {
      const list = kids.get(e.parentName) || [];
      list.push(e);
      kids.set(e.parentName, list);
    }
  }
  const root = entities.find((e) => e.parentName === null);
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

/* ─── Component ──────────────────────────────────────── */
export function PartyTreeGraph({ entities, filterMode = "all", expandAllRef, collapseAllRef }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ width: 1000, height: 700 });
  const [expanded, setExpanded] = useState(new Set());
  const [revealed, setRevealed] = useState(new Set());
  const [hoveredTx, setHoveredTx] = useState(null);
  const [hoveredIp, setHoveredIp] = useState(null);
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

  const eMap = useMemo(() => {
    const m = new Map();
    for (const e of entities) m.set(e.name, e);
    return m;
  }, [entities]);
  const kidsOf = useMemo(() => {
    const m = new Map();
    for (const e of entities) {
      if (e.parentName) {
        const l = m.get(e.parentName) || [];
        l.push(e.name);
        m.set(e.parentName, l);
      }
    }
    return m;
  }, [entities]);
  const rootName = useMemo(
    () => entities.find((e) => e.parentName === null)?.name ?? "",
    [entities],
  );
  const depthOf = useMemo(() => {
    const d = new Map();
    d.set(rootName, 0);
    const walk = (n, dep) => {
      for (const c of kidsOf.get(n) || []) {
        d.set(c, dep + 1);
        walk(c, dep + 1);
      }
    };
    walk(rootName, 0);
    return d;
  }, [rootName, kidsOf]);

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

  const radial = useMemo(
    () => computeRadial(entities, expanded, dims.width / 2, dims.height / 2),
    [entities, expanded, dims],
  );
  const nPos = useMemo(() => {
    const m = new Map();
    for (const [n, p] of radial) m.set(n, dragged.get(n) ?? p);
    return m;
  }, [radial, dragged]);

  /* ─── Build links ──────────────────────────────────── */
  const { relLinks, txLinks, ipLinks, maxAmt } = useMemo(() => {
    const relLinks = [];
    const txLinks = [];
    const ipLinks = [];

    // Relation links
    for (const e of entities) {
      if (e.parentName && nPos.has(e.name) && nPos.has(e.parentName)) {
        relLinks.push({
          sourceName: e.parentName,
          targetName: e.name,
          relation: e.relation,
          relationType: e.relationType,
        });
      }
    }

    // Transaction links
    const txSeen = new Set();
    for (const e of entities) {
      if (!nPos.has(e.name)) continue;
      for (const tx of e.transactions) {
        const other = tx.type === "OUTGOING" ? tx.to : tx.from;
        if (!nPos.has(other)) continue;
        const src = tx.type === "OUTGOING" ? e.name : other;
        const tgt = tx.type === "OUTGOING" ? other : e.name;
        const key = `${tx.type}~${src}~${tgt}~${tx.amount}~${tx.purpose}`;
        if (txSeen.has(key)) continue;
        txSeen.add(key);
        txLinks.push({
          kind: tx.type,
          sourceName: src,
          targetName: tgt,
          amount: tx.amount,
          currency: tx.currency,
          purpose: tx.purpose,
          riskFlag: tx.riskFlag,
          frequency: tx.frequency,
        });
      }
    }

    // IP links (entities sharing same subnet)
    const visibleEntities = entities.filter((e) => nPos.has(e.name));
    const ipSeen = new Set();
    for (let i = 0; i < visibleEntities.length; i++) {
      for (let j = i + 1; j < visibleEntities.length; j++) {
        const a = visibleEntities[i];
        const b = visibleEntities[j];
        const sa = getSubnet(a.ipAddress);
        const sb = getSubnet(b.ipAddress);
        if (sa === sb) {
          const key = `${a.name}~${b.name}`;
          if (!ipSeen.has(key)) {
            ipSeen.add(key);
            ipLinks.push({
              sourceName: a.name,
              targetName: b.name,
              sourceIp: a.ipAddress,
              targetIp: b.ipAddress,
              subnet: sa + ".*.*",
            });
          }
        }
      }
    }

    let maxAmt = 0;
    for (const l of txLinks) if (l.amount > maxAmt) maxAmt = l.amount;
    return { relLinks, txLinks, ipLinks, maxAmt: maxAmt || 1 };
  }, [entities, nPos]);

  const txW = (a) => TX_MIN_W + (a / maxAmt) * (TX_MAX_W - TX_MIN_W);

  /* ─── Node click ───────────────────────────────────── */
  const onClick = useCallback(
    (name) => {
      if (didDrag.current) {
        didDrag.current = false;
        return;
      }
      const ch = kidsOf.get(name);
      if (!ch?.length) return;
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(name)) {
          next.delete(name);
          const rm = (n) => {
            for (const c of kidsOf.get(n) || []) {
              next.delete(c);
              rm(c);
            }
          };
          rm(name);
          setDragged((d) => {
            const nd = new Map(d);
            const r = (n) => {
              for (const c of kidsOf.get(n) || []) {
                nd.delete(c);
                r(c);
              }
            };
            r(name);
            return nd;
          });
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

  /* ─── Pointer ──────────────────────────────────────── */
  const s2svg = useCallback((cx, cy) => {
    const r = svgRef.current?.getBoundingClientRect();
    const v = vbR.current;
    if (!r) return { x: cx, y: cy };
    return { x: v.x + ((cx - r.left) / r.width) * v.w, y: v.y + ((cy - r.top) / r.height) * v.h };
  }, []);

  const onNodeDown = useCallback(
    (name, e) => {
      e.stopPropagation();
      e.preventDefault();
      mode.current = "drag";
      const pt = s2svg(e.clientX, e.clientY);
      const p = nPos.get(name);
      if (!p) return;
      dragRef.current = { name, sm: pt, sp: { ...p } };
      didDrag.current = false;
    },
    [s2svg, nPos],
  );

  const onCanvasDown = useCallback((e) => {
    if (mode.current === "drag") return;
    mode.current = "pan";
    panRef.current = {
      sm: { x: e.clientX, y: e.clientY },
      sv: { x: vbR.current.x, y: vbR.current.y },
    };
  }, []);

  const onMove = useCallback(
    (e) => {
      if (mode.current === "drag") {
        const d = dragRef.current;
        if (!d) return;
        const pt = s2svg(e.clientX, e.clientY);
        const dx = pt.x - d.sm.x;
        const dy = pt.y - d.sm.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
        const name = d.name;
        const nx = d.sp.x + dx;
        const ny = d.sp.y + dy;
        setDragged((prev) => {
          const next = new Map(prev);
          next.set(name, { x: nx, y: ny });
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
        setVb({
          ...v,
          x: p.sv.x - (e.clientX - p.sm.x) * (v.w / r.width),
          y: p.sv.y - (e.clientY - p.sm.y) * (v.h / r.height),
        });
      }
    },
    [s2svg],
  );

  const onUp = useCallback(() => {
    dragRef.current = null;
    panRef.current = null;
    mode.current = "none";
  }, []);

  const handleWheel = useCallback(
    (e) => {
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
    },
    [dims],
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ─── Hover handlers ───────────────────────────────── */
  const txEnter = useCallback((link, e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredTx({ link, x: e.clientX - r.left, y: e.clientY - r.top - 14 });
  }, []);
  const txMove = useCallback((e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredTx((p) => (p ? { ...p, x: e.clientX - r.left, y: e.clientY - r.top - 14 } : null));
  }, []);
  const txLeave = useCallback(() => setHoveredTx(null), []);

  const ipEnter = useCallback((link, e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredIp({ link, x: e.clientX - r.left, y: e.clientY - r.top - 14 });
  }, []);
  const ipMove = useCallback((e) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setHoveredIp((p) => (p ? { ...p, x: e.clientX - r.left, y: e.clientY - r.top - 14 } : null));
  }, []);
  const ipLeave = useCallback(() => setHoveredIp(null), []);

  const nodeEnter = useCallback(
    (name, e) => {
      const ent = eMap.get(name);
      if (!ent) return;
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      setHoveredNode({ e: ent, x: e.clientX - r.left, y: e.clientY - r.top - 14 });
    },
    [eMap],
  );
  const nodeLeave = useCallback(() => setHoveredNode(null), []);

  /* ─── Line geometry helper ─────────────────────────── */
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
      x1: a.x + nx * (NODE_R + 4) + px,
      y1: a.y + ny * (NODE_R + 4) + py,
      x2: b.x - nx * (NODE_R + 4) + px,
      y2: b.y - ny * (NODE_R + 4) + py,
      mx: (a.x + b.x) / 2 + px,
      my: (a.y + b.y) / 2 + py,
    };
  }

  const showRel = filterMode === "all" || filterMode === "relations";
  const showTx = filterMode === "all" || filterMode === "transactions";
  const showIp = filterMode === "all" || filterMode === "ip";

  /* ─── Render ────────���──────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[560px] select-none overflow-hidden bg-background"
    >
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
      >
        <defs>
          <filter id="ns" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="2.5"
              floodColor="#64748b"
              floodOpacity="0.1"
            />
          </filter>
          <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="txGlowR" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="1 0 0 0 0.1  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
              result="cr"
            />
            <feMerge>
              <feMergeNode in="cr" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="txGlowG" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0.1  0 0 0 0 0  0 0 0 0.35 0"
              result="cg"
            />
            <feMerge>
              <feMergeNode in="cg" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {[1, 2, 3].map((d) => (
          <g key={`o${d}`}>
            <circle
              cx={dims.width / 2}
              cy={dims.height / 2}
              r={ORBIT * d}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
              strokeDasharray="4 6"
              opacity="0.5"
            />
            <text
              x={dims.width / 2 + ORBIT * d + 4}
              y={dims.height / 2 - 4}
              fill="#cbd5e1"
              fontSize="8"
              fontWeight="500"
            >
              {d === 1 ? "1st" : d === 2 ? "2nd" : "3rd"}
            </text>
          </g>
        ))}

        {/* ── Relation links ── */}
        {showRel &&
          relLinks.map((l) => {
            const g = lg(l.sourceName, l.targetName);
            if (!g) return null;
            const isNew = revealed.has(l.targetName);
            const c = relColor(l.relationType);
            return (
              <g key={`r~${l.sourceName}~${l.targetName}`}>
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={c}
                  strokeWidth={1.2}
                  opacity={isNew ? 0 : 0.35}
                  strokeLinecap="round"
                  style={isNew ? { animation: "fiL .5s ease-out forwards" } : undefined}
                />
                <rect
                  x={g.mx - 30}
                  y={g.my - 8}
                  width={60}
                  height={16}
                  rx={8}
                  fill="white"
                  stroke="#e2e8f0"
                  strokeWidth="0.5"
                  opacity={isNew ? 0 : 0.95}
                  style={isNew ? { animation: "fiL .5s ease-out .15s forwards" } : undefined}
                />
                <text
                  x={g.mx}
                  y={g.my + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={c}
                  fontSize="7"
                  fontWeight="600"
                  letterSpacing="0.02em"
                  className="pointer-events-none"
                  opacity={isNew ? 0 : 1}
                  style={isNew ? { animation: "fiL .5s ease-out .15s forwards" } : undefined}
                >
                  {l.relation.toUpperCase()}
                </text>
              </g>
            );
          })}

        {/* ── Transaction links ── */}
        {showTx &&
          txLinks.map((l, i) => {
            const isOut = l.kind === "OUTGOING";
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
            const isMed = ratio > 0.3;
            const glow = isLarge ? (isOut ? "url(#txGlowR)" : "url(#txGlowG)") : undefined;
            const badgeW = isLarge ? 78 : isMed ? 66 : 56;
            const badgeH = isLarge ? 18 : isMed ? 15 : 13;
            const badgeFont = isLarge ? 8.5 : isMed ? 7.5 : 6.5;
            return (
              <g key={`t~${l.kind}~${l.sourceName}~${l.targetName}~${i}`}>
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="transparent"
                  strokeWidth={Math.max(16, bw + 10)}
                  className="cursor-pointer"
                  onMouseEnter={(e) => txEnter(l, e)}
                  onMouseMove={txMove}
                  onMouseLeave={txLeave}
                />
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={col}
                  strokeWidth={hovered ? bw + 1.5 : bw}
                  strokeDasharray={isOut ? "6 3" : "none"}
                  opacity={hovered ? 1 : isLarge ? 0.7 : 0.45}
                  strokeLinecap="round"
                  filter={hovered || isLarge ? glow : undefined}
                  className="pointer-events-none transition-all duration-150"
                />
                <rect
                  x={g.mx - badgeW / 2}
                  y={g.my - badgeH / 2}
                  width={badgeW}
                  height={badgeH}
                  rx={badgeH / 2}
                  fill={hovered ? col : bgF}
                  stroke={hovered ? col : bgS}
                  strokeWidth={isLarge ? 1 : 0.5}
                  className="pointer-events-none"
                />
                <text
                  x={g.mx}
                  y={g.my + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hovered ? "#fff" : col}
                  fontSize={badgeFont}
                  fontWeight={isLarge ? "800" : "700"}
                  letterSpacing="0.02em"
                  className="pointer-events-none"
                >
                  {fmt(l.amount, l.currency)}
                </text>
                {isLarge && !hovered && (
                  <circle
                    cx={g.mx - badgeW / 2 + 7}
                    cy={g.my}
                    r={3}
                    fill={col}
                    opacity="0.5"
                    className="pointer-events-none"
                  >
                    <animate
                      attributeName="r"
                      values="2.5;4;2.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.5;0.2;0.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

        {/* ── IP links ── */}
        {/* {showIp && ipLinks.map((l, i) => {
          const g = lg(l.sourceName, l.targetName, filterMode === "ip" ? 0 : -16);
          if (!g) return null;
          const hovered = hoveredIp?.link === l;
          return (
            <g key={`ip~${l.sourceName}~${l.targetName}~${i}`}>
              <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="transparent" strokeWidth={14} className="cursor-pointer" onMouseEnter={(e) => ipEnter(l, e)} onMouseMove={ipMove} onMouseLeave={ipLeave} />
              <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="#f97316" strokeWidth={hovered ? 2.5 : 1.5} strokeDasharray="3 4" opacity={hovered ? 1 : 0.5} strokeLinecap="round" className="pointer-events-none transition-all duration-150" />
              <rect x={g.mx - 28} y={g.my - 7} width={56} height={14} rx={7} fill={hovered ? "#f97316" : "#fff7ed"} stroke={hovered ? "#f97316" : "#fed7aa"} strokeWidth="0.5" className="pointer-events-none" />
              <text x={g.mx} y={g.my + 0.5} textAnchor="middle" dominantBaseline="central" fill={hovered ? "#fff" : "#ea580c"} fontSize="6.5" fontWeight="700" className="pointer-events-none">{l.subnet}</text>
            </g>
          );
        })} */}

        {/* ── Nodes ── */}
        {Array.from(nPos.entries()).map(([name, pos]) => {
          const ent = eMap.get(name);
          if (!ent) return null;
          const isExp = expanded.has(name);
          const isNew = revealed.has(name);
          const hasK = (kidsOf.get(name) || []).length > 0;
          const p = pal(ent.partyType);
          const depth = depthOf.get(name) ?? 0;
          const ini = name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2);
          const rc = riskColor(ent.riskRating);

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
              {isExp && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R + 7}
                  fill="none"
                  stroke={p.fill}
                  strokeWidth="1.5"
                  opacity="0.12"
                  filter="url(#gl)"
                />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_R}
                fill={isExp ? p.fill : "#fff"}
                stroke={isExp ? p.fill : "#e2e8f0"}
                strokeWidth={isExp ? 2 : 1}
                filter="url(#ns)"
              />
              {isExp && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R - 2}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                />
              )}

              {/* Risk dot */}
              <circle
                cx={pos.x - NODE_R * 0.65}
                cy={pos.y - NODE_R * 0.65}
                r={5}
                fill={rc}
                opacity="0.85"
              />

              {/* PEP badge */}
              {ent.pepFlag && (
                <>
                  <rect
                    x={pos.x + NODE_R * 0.3}
                    y={pos.y - NODE_R - 12}
                    width={22}
                    height={12}
                    rx={6}
                    fill="#fef2f2"
                    stroke="#fecaca"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x + NODE_R * 0.3 + 11}
                    y={pos.y - NODE_R - 6}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#dc2626"
                    fontSize="6"
                    fontWeight="800"
                    className="pointer-events-none"
                  >
                    PEP
                  </text>
                </>
              )}

              {/* Degree badge */}
              {depth > 0 && (
                <>
                  <circle
                    cx={pos.x + NODE_R * 0.65}
                    cy={pos.y - NODE_R * 0.65}
                    r={7}
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x + NODE_R * 0.65}
                    y={pos.y - NODE_R * 0.65 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#94a3b8"
                    fontSize="7"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {depth}
                  </text>
                </>
              )}

              {/* Expand/Collapse */}
              {hasK && (
                <>
                  <circle
                    cx={pos.x + NODE_R * 0.7}
                    cy={pos.y + NODE_R * 0.7}
                    r={7.5}
                    fill={isExp ? p.bg : "#f8fafc"}
                    stroke={isExp ? p.ring : "#e2e8f0"}
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x + NODE_R * 0.7}
                    y={pos.y + NODE_R * 0.7 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isExp ? p.fill : "#94a3b8"}
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {isExp ? "\u2212" : "+"}
                  </text>
                </>
              )}

              {/* IP indicator (when in IP mode) */}
              {filterMode === "ip" && (
                <>
                  <rect
                    x={pos.x - NODE_R * 0.9}
                    y={pos.y + NODE_R * 0.45}
                    width={NODE_R * 1.8}
                    height={11}
                    rx={5.5}
                    fill="#fff7ed"
                    stroke="#fed7aa"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + NODE_R * 0.45 + 5.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ea580c"
                    fontSize="5.5"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {ent.ipAddress}
                  </text>
                </>
              )}

              {/* Initials */}
              <text
                x={pos.x}
                y={pos.y - 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isExp ? "#fff" : "#1e293b"}
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.02em"
                className="pointer-events-none"
              >
                {ini}
              </text>
              <text
                x={pos.x}
                y={pos.y + 10}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isExp ? "rgba(255,255,255,0.5)" : "#94a3b8"}
                fontSize="5.5"
                fontWeight="500"
                className="pointer-events-none capitalize"
              >
                {ent.partyType.replace("_", " ")}
              </text>

              {/* Name below */}
              <text
                x={pos.x}
                y={pos.y + NODE_R + 12}
                textAnchor="middle"
                fill={isExp ? "#0f172a" : "#64748b"}
                fontSize="8.5"
                fontWeight={isExp ? "600" : "400"}
                className="pointer-events-none"
              >
                {name.length > 24 ? `${name.slice(0, 22)}...` : name}
              </text>
            </g>
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes fiN {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fiL {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.6;
          }
        }
      `}</style>

      {/* Tx tooltip */}
      {hoveredTx &&
        (() => {
          const isOut = hoveredTx.link.kind === "OUTGOING";
          const col = isOut ? "#dc2626" : "#16a34a";
          const label = isOut ? "Outgoing Transaction" : "Incoming Transaction";
          return (
            <div
              className="absolute pointer-events-none z-50 rounded-xl border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg"
              style={{
                left: hoveredTx.x,
                top: hoveredTx.y,
                transform: "translate(-50%,-100%)",
                maxWidth: 280,
                borderColor: isOut ? "#fecaca" : "#bbf7d0",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block h-1.5 w-3 rounded-full"
                  style={{ backgroundColor: col }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: col }}
                >
                  {label}
                </span>
              </div>
              <div className="text-sm font-bold text-foreground">
                {fmt(hoveredTx.link.amount, hoveredTx.link.currency)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{hoveredTx.link.sourceName}</span>
                <span className="mx-1 text-muted-foreground/50">{"->"}</span>
                <span className="font-medium text-foreground">{hoveredTx.link.targetName}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{hoveredTx.link.purpose}</span>
                <span className="text-muted-foreground/30">|</span>
                <span>{hoveredTx.link.frequency}</span>
              </div>
              <div className="mt-1 inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
                {hoveredTx.link.riskFlag}
              </div>
            </div>
          );
        })()}

      {/* IP tooltip */}
      {hoveredIp && (
        <div
          className="absolute pointer-events-none z-50 rounded-xl border border-orange-200 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg"
          style={{
            left: hoveredIp.x,
            top: hoveredIp.y,
            transform: "translate(-50%,-100%)",
            maxWidth: 260,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-1.5 w-3 rounded-full bg-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">
              Shared IP Subnet
            </span>
          </div>
          <div className="text-xs font-bold text-foreground">{hoveredIp.link.subnet}</div>
          <div className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{hoveredIp.link.sourceName}</span> --{" "}
              {hoveredIp.link.sourceIp}
            </div>
            <div>
              <span className="font-medium text-foreground">{hoveredIp.link.targetName}</span> --{" "}
              {hoveredIp.link.targetIp}
            </div>
          </div>
        </div>
      )}

      {/* Node tooltip */}
      {hoveredNode && !hoveredTx && !hoveredIp && (
        <div
          className="absolute pointer-events-none z-50 rounded-xl border border-border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-lg"
          style={{
            left: hoveredNode.x,
            top: hoveredNode.y,
            transform: "translate(-50%,-100%)",
            maxWidth: 300,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: pal(hoveredNode.e.partyType).fill }}
            />
            <span className="text-sm font-semibold text-foreground">{hoveredNode.e.name}</span>
            {hoveredNode.e.pepFlag && (
              <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1 py-px">
                PEP
              </span>
            )}
          </div>
          <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
            <div>
              {hoveredNode.e.partyType.replace("_", " ")} -- {hoveredNode.e.role.replace(/_/g, " ")}
            </div>
            <div>
              Risk:{" "}
              <span
                className="font-semibold"
                style={{ color: riskColor(hoveredNode.e.riskRating) }}
              >
                {hoveredNode.e.riskRating}
              </span>
            </div>
            <div>
              IP: <span className="font-mono text-[11px]">{hoveredNode.e.ipAddress}</span>
            </div>
            {hoveredNode.e.ownershipPercentage && (
              <div>Ownership: {hoveredNode.e.ownershipPercentage}%</div>
            )}
          </div>
          {hoveredNode.e.transactions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Transactions ({hoveredNode.e.transactions.length})
              </div>
              <div className="flex gap-3">
                <div className="text-xs">
                  <span className="font-semibold" style={{ color: "#dc2626" }}>
                    Out:{" "}
                    {fmt(
                      hoveredNode.e.transactions
                        .filter((t) => t.type === "OUTGOING")
                        .reduce((s, t) => s + t.amount, 0),
                      "USD",
                    )}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold" style={{ color: "#16a34a" }}>
                    In:{" "}
                    {fmt(
                      hoveredNode.e.transactions
                        .filter((t) => t.type === "INCOMING")
                        .reduce((s, t) => s + t.amount, 0),
                      "USD",
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          {(kidsOf.get(hoveredNode.e.name) || []).length > 0 && (
            <div
              className="mt-1.5 text-[11px] font-medium"
              style={{ color: pal(hoveredNode.e.partyType).fill }}
            >
              {expanded.has(hoveredNode.e.name) ? "Click to collapse" : "Click to expand"}
            </div>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-28 right-4 flex flex-col gap-1">
        {[
          {
            label: "+",
            fn: () => {
              const nz = Math.min(4, zoom * 1.25);
              const nw = dims.width / nz;
              const nh = dims.height / nz;
              const cx = vb.x + vb.w / 2;
              const cy = vb.y + vb.h / 2;
              setVb({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
              setZoom(nz);
            },
          },
          {
            label: "\u2212",
            fn: () => {
              const nz = Math.max(0.3, zoom * 0.8);
              const nw = dims.width / nz;
              const nh = dims.height / nz;
              const cx = vb.x + vb.w / 2;
              const cy = vb.y + vb.h / 2;
              setVb({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
              setZoom(nz);
            },
          },
          {
            label: "R",
            fn: () => {
              setVb({ x: 0, y: 0, w: dims.width, h: dims.height });
              setZoom(1);
              setDragged(new Map());
            },
          },
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
