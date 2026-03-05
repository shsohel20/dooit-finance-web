"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TX_MIN_W = 2;
const TX_MAX_W = 10;
const BASE_NODE_R = 32;
const BASE_ORBIT = 170;
const MIN_NODE_R = 18;
const MIN_ORBIT = 90;

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
  return ip.split(".").slice(0, 2).join(".");
}

/* ─── Force-directed collision resolution ─────────────── */
function resolveCollisions(pos, nodeRadius, iterations = 50) {
  const result = new Map();
  for (const [k, v] of pos) result.set(k, { ...v });

  const names = Array.from(result.keys());
  const minDist = nodeRadius * 2 + 15; // Minimum distance between node centers

  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const a = result.get(names[i]);
        const b = result.get(names[j]);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDist && dist > 0.01) {
          const overlap = minDist - dist;
          const pushX = (dx / dist) * overlap * 0.5;
          const pushY = (dy / dist) * overlap * 0.5;

          a.x -= pushX;
          a.y -= pushY;
          b.x += pushX;
          b.y += pushY;
          moved = true;
        } else if (dist < 0.01) {
          // Nodes at same position - push apart randomly
          const angle = Math.random() * Math.PI * 2;
          a.x += Math.cos(angle) * minDist * 0.5;
          a.y += Math.sin(angle) * minDist * 0.5;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  return result;
}

/* ─── Radial layout (normal mode) with adaptive spacing ─ */
function computeRadial(entities, expanded, cx, cy, width, height) {
  const pos = new Map();
  const kids = new Map();
  for (const e of entities) {
    if (e.parentName) {
      const l = kids.get(e.parentName) || [];
      l.push(e);
      kids.set(e.parentName, l);
    }
  }
  const root = entities.find((e) => e.parentName === null);
  if (!root) return { positions: pos, nodeRadius: BASE_NODE_R, orbitSpacing: BASE_ORBIT };

  // Count total visible nodes
  let totalVisible = 1;
  const countVisible = (name) => {
    if (!expanded.has(name)) return;
    const ch = kids.get(name) || [];
    totalVisible += ch.length;
    for (const c of ch) countVisible(c.name);
  };
  countVisible(root.name);

  // Count max nodes at any single level
  let maxNodesAtLevel = 1;
  const levelCounts = new Map();
  levelCounts.set(0, 1);
  const countLevels = (name, depth) => {
    if (!expanded.has(name)) return;
    const ch = kids.get(name) || [];
    const curr = levelCounts.get(depth + 1) || 0;
    levelCounts.set(depth + 1, curr + ch.length);
    maxNodesAtLevel = Math.max(maxNodesAtLevel, curr + ch.length);
    for (const c of ch) countLevels(c.name, depth + 1);
  };
  countLevels(root.name, 0);

  // Adaptive node sizing - more aggressive shrinking for large datasets
  const scaleFactor = Math.max(0.35, Math.min(1, 20 / Math.max(totalVisible, 1)));
  const nodeRadius = Math.max(MIN_NODE_R, Math.round(BASE_NODE_R * scaleFactor));
  const minGap = 15;
  const minArcLength = 2 * nodeRadius + minGap;

  // Calculate orbit spacing based on most crowded level
  const maxDepth = Math.max(...Array.from(levelCounts.keys()));
  let orbitSpacing = BASE_ORBIT;

  // Find the level with most nodes and calculate required orbit for that level
  for (const [level, count] of levelCounts) {
    if (level === 0 || count <= 1) continue;
    // Circumference at level = 2 * PI * orbitSpacing * level
    // Required spacing = count * minArcLength / (2 * PI * level)
    const requiredOrbit = (count * minArcLength) / (2 * Math.PI * level);
    orbitSpacing = Math.max(orbitSpacing, requiredOrbit);
  }

  // Cap orbit spacing to reasonable bounds
  orbitSpacing = Math.max(MIN_ORBIT, Math.min(BASE_ORBIT * 2, orbitSpacing));

  pos.set(root.name, { x: cx, y: cy });

  function place(parent, aS, aE, d) {
    if (!expanded.has(parent)) return;
    const ch = kids.get(parent) || [];
    if (!ch.length) return;
    const r = orbitSpacing * d;

    // Calculate arc weights based on subtree sizes
    const childWeights = ch.map((c) => {
      let weight = 1;
      const countDescendants = (name) => {
        if (!expanded.has(name)) return 0;
        const grandkids = kids.get(name) || [];
        return grandkids.length + grandkids.reduce((sum, gk) => sum + countDescendants(gk.name), 0);
      };
      weight += countDescendants(c.name) * 0.5;
      return Math.max(weight, 1);
    });
    const totalWeight = childWeights.reduce((sum, w) => sum + w, 0);

    let currentAngle = aS;
    ch.forEach((c, i) => {
      const arcSpan = ((aE - aS) * childWeights[i]) / totalWeight;
      const a = currentAngle + arcSpan / 2;
      pos.set(c.name, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      place(c.name, currentAngle, currentAngle + arcSpan, d + 1);
      currentAngle += arcSpan;
    });
  }
  place(root.name, 0, 2 * Math.PI, 1);

  // Apply collision resolution to push overlapping nodes apart
  const resolved = resolveCollisions(pos, nodeRadius, 30);

  return { positions: resolved, nodeRadius, orbitSpacing };
}

/* ─── Transaction-specific layout with adaptive spacing ── */
function computeTxLayout(entities, cx, cy, width, height) {
  const pos = new Map();
  const root = entities.find((e) => e.parentName === null);
  if (!root)
    return {
      positions: pos,
      outgoingNames: new Set(),
      incomingNames: new Set(),
      rootName: "",
      nodeRadius: BASE_NODE_R,
    };

  const outgoingNames = new Set();
  const incomingNames = new Set();
  const entityMap = new Map();
  for (const e of entities) entityMap.set(e.name, e);

  for (const e of entities) {
    for (const tx of e.transactions) {
      if (tx.type === "OUTGOING" && tx.to && entityMap.has(tx.to)) {
        outgoingNames.add(e.name);
        outgoingNames.add(tx.to);
      }
      if (tx.type === "INCOMING" && tx.from && entityMap.has(tx.from)) {
        incomingNames.add(e.name);
        incomingNames.add(tx.from);
      }
    }
  }

  outgoingNames.delete(root.name);
  incomingNames.delete(root.name);

  const outArr = Array.from(outgoingNames);
  const inArr = Array.from(incomingNames).filter((n) => !outgoingNames.has(n));
  const totalNodes = 1 + outArr.length + inArr.length;

  // Adaptive sizing - more aggressive for large datasets
  const scaleFactor = Math.max(0.35, Math.min(1, 20 / Math.max(totalNodes, 1)));
  const nodeRadius = Math.max(MIN_NODE_R, Math.round(BASE_NODE_R * scaleFactor));
  const minGap = nodeRadius + 8;
  const nodeHeight = nodeRadius * 2 + minGap;

  pos.set(root.name, { x: cx, y: cy });

  // Layout outgoing nodes on LEFT in a grid
  const outCount = outArr.length;
  const leftWidth = cx - 100;
  const availHeight = height - 60;

  // Calculate optimal grid for outgoing
  const outRowsMax = Math.floor(availHeight / nodeHeight);
  const outCols = Math.ceil(outCount / outRowsMax);
  const outColWidth = Math.min(nodeRadius * 3, leftWidth / Math.max(1, outCols));
  const outRowHeight = availHeight / Math.ceil(outCount / outCols);

  outArr.forEach((name, i) => {
    const col = Math.floor(i / outRowsMax);
    const row = i % outRowsMax;
    const x = 60 + col * outColWidth + outColWidth / 2;
    const y = 30 + row * outRowHeight + outRowHeight / 2;
    pos.set(name, { x, y });
  });

  // Layout incoming nodes on RIGHT in a grid
  const inCount = inArr.length;
  const rightWidth = width - cx - 100;

  const inRowsMax = Math.floor(availHeight / nodeHeight);
  const inCols = Math.ceil(inCount / inRowsMax);
  const inColWidth = Math.min(nodeRadius * 3, rightWidth / Math.max(1, inCols));
  const inRowHeight = availHeight / Math.ceil(inCount / Math.max(1, inCols));

  inArr.forEach((name, i) => {
    const col = Math.floor(i / inRowsMax);
    const row = i % inRowsMax;
    const x = width - 60 - col * inColWidth - inColWidth / 2;
    const y = 30 + row * inRowHeight + inRowHeight / 2;
    pos.set(name, { x, y });
  });

  // Position remaining entities with collision detection
  for (const e of entities) {
    if (!pos.has(e.name)) {
      const outAmt = e.transactions
        .filter((t) => t.type === "OUTGOING")
        .reduce((s, t) => s + t.amount, 0);
      const inAmt = e.transactions
        .filter((t) => t.type === "INCOMING")
        .reduce((s, t) => s + t.amount, 0);
      const side = outAmt >= inAmt ? "left" : "right";
      const baseX = side === "left" ? cx / 2 : cx + (width - cx) / 2;

      let bestY = cy;
      let bestDist = 0;
      for (let testY = 50; testY < height - 50; testY += nodeHeight / 2) {
        let minDist = Infinity;
        for (const [, p] of pos) {
          const d = Math.sqrt((p.x - baseX) ** 2 + (p.y - testY) ** 2);
          minDist = Math.min(minDist, d);
        }
        if (minDist > bestDist) {
          bestDist = minDist;
          bestY = testY;
        }
      }
      pos.set(e.name, { x: baseX, y: bestY });
    }
  }

  // Apply collision resolution
  const resolved = resolveCollisions(pos, nodeRadius, 20);

  return { positions: resolved, outgoingNames, incomingNames, rootName: root.name, nodeRadius };
}

/* ─── Component ──────────────────────────────────────── */
export function PartyTreeGraph({ entities, filterMode, expandAllRef, collapseAllRef }) {
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
      setDims({ width: e.contentRect.width, height: Math.max(560, e.contentRect.height) });
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

  /* ─── Compute positions based on mode ──────────────── */
  const txLayout = useMemo(
    () => computeTxLayout(entities, dims.width / 2, dims.height / 2, dims.width, dims.height),
    [entities, dims],
  );
  const radialLayout = useMemo(
    () =>
      computeRadial(entities, expanded, dims.width / 2, dims.height / 2, dims.width, dims.height),
    [entities, expanded, dims],
  );

  // Use transaction layout when in transactions mode, otherwise radial
  const basePositions = filterMode === "transactions" ? txLayout.positions : radialLayout.positions;
  const nodeRadius = filterMode === "transactions" ? txLayout.nodeRadius : radialLayout.nodeRadius;
  const orbitSpacing = radialLayout.orbitSpacing;

  const nPos = useMemo(() => {
    const m = new Map();
    for (const [n, p] of basePositions) m.set(n, dragged.get(n) ?? p);
    return m;
  }, [basePositions, dragged]);

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

    // IP links
    const vis = entities.filter((e) => nPos.has(e.name));
    const ipSeen = new Set();
    for (let i = 0; i < vis.length; i++) {
      for (let j = i + 1; j < vis.length; j++) {
        const a = vis[i],
          b = vis[j];
        const sa = getSubnet(a.ipAddress),
          sb = getSubnet(b.ipAddress);
        if (sa === sb && !ipSeen.has(`${a.name}~${b.name}`)) {
          ipSeen.add(`${a.name}~${b.name}`);
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
      if (filterMode === "transactions") return; // No expand in tx mode
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
    [kidsOf, filterMode],
  );

  /* ─── Pointer handlers ─────────────────────────────── */
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
        const dx = pt.x - d.sm.x,
          dy = pt.y - d.sm.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
        const name = d.name,
          nx = d.sp.x + dx,
          ny = d.sp.y + dy;
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
      const z = zR.current,
        v = vbR.current;
      const nz = Math.max(0.3, Math.min(4, z * f));
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      const mx = v.x + ((e.clientX - r.left) / r.width) * v.w;
      const my = v.y + ((e.clientY - r.top) / r.height) * v.h;
      const nw = dims.width / nz,
        nh = dims.height / nz;
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

  /* ─── Line geometry ────────────────────────────────── */
  function lg(s, t, off = 0) {
    const a = nPos.get(s),
      b = nPos.get(t);
    if (!a || !b) return null;
    const dx = b.x - a.x,
      dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / d,
      ny = dy / d;
    const px = -ny * off,
      py = nx * off;
    return {
      x1: a.x + nx * (nodeRadius + 4) + px,
      y1: a.y + ny * (nodeRadius + 4) + py,
      x2: b.x - nx * (nodeRadius + 4) + px,
      y2: b.y - ny * (nodeRadius + 4) + py,
      mx: (a.x + b.x) / 2 + px,
      my: (a.y + b.y) / 2 + py,
    };
  }

  const showRel = filterMode === "all" || filterMode === "relations";
  const showTx = filterMode === "all" || filterMode === "transactions";
  const showIp = filterMode === "all" || filterMode === "ip";
  const isTxMode = filterMode === "transactions";

  /* ─── Render ───────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[560px] select-none overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
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
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#64748b" floodOpacity="0.15" />
          </filter>
          <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="txGlowR" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"
              result="cr"
            />
            <feMerge>
              <feMergeNode in="cr" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="txGlowG" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.5 0"
              result="cg"
            />
            <feMerge>
              <feMergeNode in="cg" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Gradient backgrounds for left/right zones */}
          {/* <linearGradient id="leftZone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef2f2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fef2f2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rightZone" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0" />
          </linearGradient> */}
        </defs>

        {/* Transaction mode: Zone backgrounds */}
        {isTxMode && (
          <>
            {/* Left zone (Outgoing) */}
            {/* <rect x={0} y={0} width={dims.width * 0.4} height={dims.height} fill="url(#leftZone)" /> */}
            {/* <rect x={0} y={0} width={4} height={dims.height} fill="#dc2626" opacity="0.3" /> */}
            {/* Right zone (Incoming) */}
            {/* <rect
              x={dims.width * 0.6}
              y={0}
              width={dims.width * 0.4}
              height={dims.height}
              fill="url(#rightZone)"
            />
            <rect
              x={dims.width - 4}
              y={0}
              width={4}
              height={dims.height}
              fill="#16a34a"
              opacity="0.3"
            /> */}
            {/* Zone labels */}
            <g>
              <text x={60} y={40} fill="#dc2626" fontSize="14" fontWeight="700" opacity="0.8">
                OUTGOING
              </text>
              <text x={60} y={58} fill="#b91c1c" fontSize="10" fontWeight="500" opacity="0.6">
                Money sent out
              </text>
              <line
                x1={60}
                y1={72}
                x2={120}
                y2={72}
                stroke="#dc2626"
                strokeWidth="3"
                strokeDasharray="8 4"
                opacity="0.6"
              />
            </g>
            <g>
              <text
                x={dims.width - 60}
                y={40}
                fill="#16a34a"
                fontSize="14"
                fontWeight="700"
                opacity="0.8"
                textAnchor="end"
              >
                INCOMING
              </text>
              <text
                x={dims.width - 60}
                y={58}
                fill="#15803d"
                fontSize="10"
                fontWeight="500"
                opacity="0.6"
                textAnchor="end"
              >
                Money received
              </text>
              <line
                x1={dims.width - 120}
                y1={72}
                x2={dims.width - 60}
                y2={72}
                stroke="#16a34a"
                strokeWidth="3"
                opacity="0.6"
              />
            </g>
            {/* Center divider */}
            <line
              x1={dims.width / 2}
              y1={30}
              x2={dims.width / 2}
              y2={dims.height - 30}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="6 6"
              opacity="0.5"
            />
          </>
        )}

        {/* Normal mode: Orbit rings */}
        {!isTxMode &&
          [1, 2, 3, 4, 5].map((d) => {
            const r = orbitSpacing * d;
            if (r > Math.min(dims.width, dims.height) / 2) return null;
            return (
              <g key={`o${d}`}>
                <circle
                  cx={dims.width / 2}
                  cy={dims.height / 2}
                  r={r}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="0.5"
                  strokeDasharray="4 6"
                  opacity="0.5"
                />
                <text
                  x={dims.width / 2 + r + 4}
                  y={dims.height / 2 - 4}
                  fill="#cbd5e1"
                  fontSize="8"
                  fontWeight="500"
                >
                  {d === 1 ? "1st" : d === 2 ? "2nd" : d === 3 ? "3rd" : `${d}th`}
                </text>
              </g>
            );
          })}

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
                  strokeWidth={1.5}
                  opacity={isNew ? 0 : 0.4}
                  strokeLinecap="round"
                  style={isNew ? { animation: "fiL .5s ease-out forwards" } : undefined}
                />
                <rect
                  x={g.mx - 32}
                  y={g.my - 9}
                  width={64}
                  height={18}
                  rx={9}
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
                  fontSize="8"
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
            const g = lg(l.sourceName, l.targetName, 0);
            if (!g) return null;
            const hovered = hoveredTx?.link === l;
            const bw = txW(l.amount);
            const ratio = l.amount / maxAmt;
            const isLarge = ratio > 0.5;
            const glow = isLarge ? (isOut ? "url(#txGlowR)" : "url(#txGlowG)") : undefined;
            const badgeW = isLarge ? 90 : 72;
            const badgeH = isLarge ? 22 : 18;
            const badgeFont = isLarge ? 9 : 7.5;

            return (
              <g key={`t~${l.kind}~${l.sourceName}~${l.targetName}~${i}`}>
                {/* Hit area */}
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="transparent"
                  strokeWidth={Math.max(20, bw + 14)}
                  className="cursor-pointer"
                  onMouseEnter={(e) => txEnter(l, e)}
                  onMouseMove={txMove}
                  onMouseLeave={txLeave}
                />
                {/* Main line */}
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke={col}
                  strokeWidth={hovered ? bw + 2 : bw}
                  strokeDasharray={isOut ? "10 5" : "none"}
                  opacity={hovered ? 1 : isLarge ? 0.85 : 0.55}
                  strokeLinecap="round"
                  filter={hovered || isLarge ? glow : undefined}
                  className="pointer-events-none transition-all duration-150"
                />
                {/* Amount badge */}
                <rect
                  x={g.mx - badgeW / 2}
                  y={g.my - badgeH / 2}
                  width={badgeW}
                  height={badgeH}
                  rx={badgeH / 2}
                  fill={hovered ? col : bgF}
                  stroke={hovered ? col : bgS}
                  strokeWidth={isLarge ? 2 : 1}
                  className="pointer-events-none"
                  style={{
                    filter:
                      isLarge && !hovered ? "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" : undefined,
                  }}
                />
                {/* Direction arrow */}
                <text
                  x={g.mx - badgeW / 2 + 12}
                  y={g.my + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hovered ? "#fff" : col}
                  fontSize={badgeFont + 4}
                  fontWeight="500"
                  className="pointer-events-none"
                >
                  {isOut ? "\u2190" : "\u2192"}
                </text>
                {/* Amount */}
                <text
                  x={g.mx + 6}
                  y={g.my + 1}
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
                {/* Pulse for large */}
                {isLarge && !hovered && (
                  <circle
                    cx={g.mx + badgeW / 2 - 10}
                    cy={g.my}
                    r={4}
                    fill={col}
                    opacity="0.7"
                    className="pointer-events-none"
                  >
                    <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      values="0.7;0.2;0.7"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

        {/* ── IP links ── */}
        {/* {showIp &&
          ipLinks.map((l, i) => {
            const g = lg(l.sourceName, l.targetName, filterMode === "ip" ? 0 : -16);
            if (!g) return null;
            const hovered = hoveredIp?.link === l;
            return (
              <g key={`ip~${l.sourceName}~${l.targetName}~${i}`}>
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="transparent"
                  strokeWidth={16}
                  className="cursor-pointer"
                  onMouseEnter={(e) => ipEnter(l, e)}
                  onMouseMove={ipMove}
                  onMouseLeave={ipLeave}
                />
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#f97316"
                  strokeWidth={hovered ? 3 : 2}
                  strokeDasharray="4 5"
                  opacity={hovered ? 1 : 0.5}
                  strokeLinecap="round"
                  className="pointer-events-none transition-all duration-150"
                />
                <rect
                  x={g.mx - 30}
                  y={g.my - 8}
                  width={60}
                  height={16}
                  rx={8}
                  fill={hovered ? "#f97316" : "#fff7ed"}
                  stroke={hovered ? "#f97316" : "#fed7aa"}
                  strokeWidth="0.75"
                  className="pointer-events-none"
                />
                <text
                  x={g.mx}
                  y={g.my + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hovered ? "#fff" : "#ea580c"}
                  fontSize="7"
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  {l.subnet}
                </text>
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
          const isRoot = ent.parentName === null;

          // In tx mode, highlight root differently
          const nr = isTxMode && isRoot ? nodeRadius + 8 : nodeRadius;
          const nodeFill = isTxMode && isRoot ? "#1e293b" : isExp ? p.fill : "#fff";
          const nodeStroke = isTxMode && isRoot ? "#0f172a" : isExp ? p.fill : "#e2e8f0";
          const textFill = isTxMode && isRoot ? "#fff" : isExp ? "#fff" : "#1e293b";
          const fontSize = Math.max(8, Math.round(nodeRadius * 0.38));
          const smallFontSize = Math.max(5, Math.round(nodeRadius * 0.2));

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
              {/* Glow ring for expanded/root */}
              {(isExp || (isTxMode && isRoot)) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nr + 6}
                  fill="none"
                  stroke={isTxMode && isRoot ? "#475569" : p.fill}
                  strokeWidth="2"
                  opacity="0.15"
                  filter="url(#gl)"
                />
              )}

              {/* Main circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nr}
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth={isTxMode && isRoot ? 3 : 1.5}
                filter="url(#ns)"
              />

              {/* Inner ring for root in tx mode */}
              {isTxMode && isRoot && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nr - 4}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
              )}

              {/* Risk dot */}
              <circle
                cx={pos.x - nr * 0.65}
                cy={pos.y - nr * 0.65}
                r={Math.max(4, nr * 0.18)}
                fill={rc}
                opacity="0.9"
              />

              {/* PEP badge */}
              {ent.pepFlag && nr >= 22 && (
                <>
                  <rect
                    x={pos.x + nr * 0.25}
                    y={pos.y - nr - 12}
                    width={22}
                    height={12}
                    rx={6}
                    fill="#fef2f2"
                    stroke="#fecaca"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x + nr * 0.25 + 11}
                    y={pos.y - nr - 6}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#dc2626"
                    fontSize={smallFontSize + 1}
                    fontWeight="800"
                    className="pointer-events-none"
                  >
                    PEP
                  </text>
                </>
              )}

              {/* Degree badge (not in tx mode) */}
              {!isTxMode && depth > 0 && nr >= 22 && (
                <>
                  <circle
                    cx={pos.x + nr * 0.65}
                    cy={pos.y - nr * 0.65}
                    r={Math.max(5, nr * 0.22)}
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x + nr * 0.65}
                    y={pos.y - nr * 0.65 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#94a3b8"
                    fontSize={smallFontSize + 1}
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {depth}
                  </text>
                </>
              )}

              {/* Expand/Collapse (not in tx mode) */}
              {!isTxMode && hasK && (
                <>
                  <circle
                    cx={pos.x + nr * 0.7}
                    cy={pos.y + nr * 0.7}
                    r={Math.max(5, nr * 0.22)}
                    fill={isExp ? p.bg : "#f8fafc"}
                    stroke={isExp ? p.ring : "#e2e8f0"}
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x + nr * 0.7}
                    y={pos.y + nr * 0.7 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isExp ? p.fill : "#94a3b8"}
                    fontSize={smallFontSize + 3}
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {isExp ? "\u2212" : "+"}
                  </text>
                </>
              )}

              {/* IP indicator (when in IP mode) */}
              {filterMode === "ip" && nr >= 22 && (
                <>
                  <rect
                    x={pos.x - nr}
                    y={pos.y + nr * 0.5}
                    width={nr * 2}
                    height={11}
                    rx={5.5}
                    fill="#fff7ed"
                    stroke="#fed7aa"
                    strokeWidth="0.5"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + nr * 0.5 + 5.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ea580c"
                    fontSize={smallFontSize}
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
                y={pos.y - (nr > 24 ? 2 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textFill}
                fontSize={fontSize}
                fontWeight="700"
                letterSpacing="0.02em"
                className="pointer-events-none"
              >
                {ini}
              </text>
              {nr >= 24 && (
                <text
                  x={pos.x}
                  y={pos.y + fontSize * 0.8}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={
                    isTxMode && isRoot
                      ? "rgba(255,255,255,0.5)"
                      : isExp
                        ? "rgba(255,255,255,0.5)"
                        : "#94a3b8"
                  }
                  fontSize={smallFontSize}
                  fontWeight="500"
                  className="pointer-events-none capitalize"
                >
                  {ent.partyType.replace("_", " ")}
                </text>
              )}

              {/* Name below */}
              <text
                x={pos.x}
                y={pos.y + nr + 10}
                textAnchor="middle"
                fill={isExp || (isTxMode && isRoot) ? "#0f172a" : "#64748b"}
                fontSize={Math.max(7, smallFontSize + 2)}
                fontWeight={isExp || (isTxMode && isRoot) ? "600" : "400"}
                className="pointer-events-none"
              >
                {name.length > 18 ? `${name.slice(0, 16)}...` : name}
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
              className="absolute pointer-events-none z-50 rounded-xl border-2 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl"
              style={{
                left: hoveredTx.x,
                top: hoveredTx.y,
                transform: "translate(-50%,-100%)",
                maxWidth: 300,
                borderColor: col,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="inline-block h-2 w-4 rounded-full"
                  style={{ backgroundColor: col }}
                />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: col }}>
                  {label}
                </span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {fmt(hoveredTx.link.amount, hoveredTx.link.currency)}
              </div>
              <div className="mt-1.5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{hoveredTx.link.sourceName}</span>
                <span className="mx-2 text-muted-foreground/50">{"\u2192"}</span>
                <span className="font-semibold text-foreground">{hoveredTx.link.targetName}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{hoveredTx.link.purpose}</span>
                <span className="text-muted-foreground/30">|</span>
                <span>{hoveredTx.link.frequency}</span>
              </div>
              <div className="mt-2 inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {hoveredTx.link.riskFlag}
              </div>
            </div>
          );
        })()}

      {/* IP tooltip */}
      {hoveredIp && (
        <div
          className="absolute pointer-events-none z-50 rounded-xl border-2 border-orange-400 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl"
          style={{
            left: hoveredIp.x,
            top: hoveredIp.y,
            transform: "translate(-50%,-100%)",
            maxWidth: 280,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-2 w-4 rounded-full bg-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Shared IP Subnet
            </span>
          </div>
          <div className="text-sm font-bold text-foreground">{hoveredIp.link.subnet}</div>
          <div className="mt-1.5 space-y-1 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{hoveredIp.link.sourceName}</span> --{" "}
              <span className="font-mono text-xs">{hoveredIp.link.sourceIp}</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{hoveredIp.link.targetName}</span> --{" "}
              <span className="font-mono text-xs">{hoveredIp.link.targetIp}</span>
            </div>
          </div>
        </div>
      )}

      {/* Node tooltip */}
      {hoveredNode && !hoveredTx && !hoveredIp && (
        <div
          className="absolute pointer-events-none z-50 rounded-xl border border-border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl"
          style={{
            left: hoveredNode.x,
            top: hoveredNode.y,
            transform: "translate(-50%,-100%)",
            maxWidth: 320,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: pal(hoveredNode.e.partyType).fill }}
            />
            <span className="text-sm font-bold text-foreground">{hoveredNode.e.name}</span>
            {hoveredNode.e.pepFlag && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
                PEP
              </span>
            )}
          </div>
          <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
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
              <div className="flex gap-4">
                <div className="text-xs">
                  <span className="font-bold" style={{ color: "#dc2626" }}>
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
                  <span className="font-bold" style={{ color: "#16a34a" }}>
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
          {!isTxMode && (kidsOf.get(hoveredNode.e.name) || []).length > 0 && (
            <div
              className="mt-1.5 text-xs font-medium"
              style={{ color: pal(hoveredNode.e.partyType).fill }}
            >
              {expanded.has(hoveredNode.e.name) ? "Click to collapse" : "Click to expand"}
            </div>
          )}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground text-sm font-medium shadow-md hover:bg-accent transition-colors"
            onClick={fn}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
