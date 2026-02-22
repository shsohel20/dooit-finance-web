"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { User, Building2, Landmark, Globe, Shield, ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

function fmtAmt(amount, currency) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ${currency}`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ${currency}`;
  return `${amount} ${currency}`;
}

function riskColor(r) {
  if (r === "HIGH") return { dot: "#ef4444", bg: "#fef2f2", text: "#dc2626" };
  if (r === "MEDIUM") return { dot: "#f59e0b", bg: "#fffbeb", text: "#d97706" };
  return { dot: "#22c55e", bg: "#f0fdf4", text: "#16a34a" };
}

function typeColor(type) {
  if (type === "INDIVIDUAL") return { fill: "#2563eb", bg: "#eff6ff", ring: "#bfdbfe", label: "Individual" };
  if (type === "LEGAL_ENTITY") return { fill: "#0d9488", bg: "#f0fdfa", ring: "#99f6e4", label: "Legal Entity" };
  return { fill: "#7c3aed", bg: "#f5f3ff", ring: "#ddd6fe", label: "Business" };
}

function TypeIcon({ type, className }) {
  const c = typeColor(type);
  if (type === "INDIVIDUAL") return <User className={className} style={{ color: c.fill }} />;
  if (type === "LEGAL_ENTITY") return <Landmark className={className} style={{ color: c.fill }} />;
  return <Building2 className={className} style={{ color: c.fill }} />;
}

/* ─── Scale config per depth level ──────────────────── */
const SCALES = [
  { minW: 220, maxW: 260, pad: "p-4",   nameSize: "text-sm",     metaSize: "text-xs",     txSize: "text-[11px]", iconSize: "h-4 w-4", borderW: 4, expandBtn: "h-6 w-6 text-xs" },
  { minW: 185, maxW: 220, pad: "p-3.5", nameSize: "text-[13px]", metaSize: "text-[11px]", txSize: "text-[10px]", iconSize: "h-3.5 w-3.5", borderW: 3, expandBtn: "h-5 w-5 text-[10px]" },
  { minW: 155, maxW: 185, pad: "p-3",   nameSize: "text-xs",     metaSize: "text-[10px]", txSize: "text-[9px]",  iconSize: "h-3 w-3", borderW: 2.5, expandBtn: "h-4.5 w-4.5 text-[9px]" },
  { minW: 130, maxW: 155, pad: "p-2.5", nameSize: "text-[11px]", metaSize: "text-[9px]",  txSize: "text-[8px]",  iconSize: "h-2.5 w-2.5", borderW: 2, expandBtn: "h-4 w-4 text-[8px]" },
  { minW: 110, maxW: 130, pad: "p-2",   nameSize: "text-[10px]", metaSize: "text-[8px]",  txSize: "text-[7px]",  iconSize: "h-2 w-2", borderW: 1.5, expandBtn: "h-3.5 w-3.5 text-[7px]" },
];

function getScale(level) {
  return SCALES[Math.min(level, SCALES.length - 1)];
}

/* ─── Card ──────────────────────────────────────────── */
function Card({ entity, level }) {
  const s = getScale(level);
  const tc = typeColor(entity.partyType);
  const rc = riskColor(entity.riskRating);
  const tOut = entity.transactions.filter((t) => t.type === "OUTGOING").reduce((a, t) => a + t.amount, 0);
  const tIn = entity.transactions.filter((t) => t.type === "INCOMING").reduce((a, t) => a + t.amount, 0);
  const txCount = entity.transactions.length;

  return (
    <div
      data-card
      className={`relative rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-200 ${s.pad}`}
      style={{ borderLeft: `${s.borderW}px solid ${tc.fill}`, minWidth: s.minW, maxWidth: s.maxW }}
    >
      <div className="flex items-start gap-2">
        <div className="shrink-0 rounded-lg p-1" style={{ backgroundColor: tc.bg }}>
          <TypeIcon type={entity.partyType} className={s.iconSize} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`${s.nameSize} font-semibold text-foreground leading-tight truncate`}>{entity.name}</span>
            {entity.pepFlag && (
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[7px] font-bold text-red-700 bg-red-50 border border-red-200">
                <Shield className="h-2 w-2" /> PEP
              </span>
            )}
          </div>
          <div className={`${s.metaSize} text-muted-foreground mt-0.5`}>
            <span className="capitalize">{tc.label}</span>
            <span className="mx-1 text-border">|</span>
            <span className="capitalize">{entity.role.replace(/_/g, " ").toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mt-2">
        <span className={`${s.metaSize} inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium`} style={{ backgroundColor: rc.bg, color: rc.text }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: rc.dot }} />
          {entity.riskRating}
        </span>
        <span
          className={`${s.metaSize} inline-flex items-center rounded-full px-1.5 py-0.5 font-medium`}
          style={{
            backgroundColor: entity.relationType === "FAMILY" ? "#eff6ff" : entity.relationType === "CONTROL" || entity.relationType === "OWNERSHIP" ? "#f5f3ff" : "#f8fafc",
            color: entity.relationType === "FAMILY" ? "#2563eb" : entity.relationType === "CONTROL" || entity.relationType === "OWNERSHIP" ? "#7c3aed" : "#64748b",
          }}
        >
          {entity.relation}
        </span>
        {entity.ownershipPercentage != null && (
          <span className={`${s.metaSize} text-muted-foreground`}>{entity.ownershipPercentage}% owned</span>
        )}
      </div>

      <div className={`flex items-center gap-1 mt-1.5 ${s.metaSize} text-muted-foreground/70`}>
        <Globe className="h-2.5 w-2.5" />
        {entity.ipAddress}
      </div>

      {txCount > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className={`flex items-center justify-between gap-2 ${s.txSize}`}>
            <span className="text-muted-foreground">{txCount} txn{txCount > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2">
              {tOut > 0 && <span className="font-semibold" style={{ color: "#dc2626" }}>Out {fmtAmt(tOut, "USD")}</span>}
              {tIn > 0 && <span className="font-semibold" style={{ color: "#16a34a" }}>In {fmtAmt(tIn, "USD")}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Recursive diagram node ────────────────────────── */
function DiagramNode({ entity, childrenOf, level }) {
  const [open, setOpen] = useState(level === 0);
  const children = childrenOf.get(entity.name) || [];
  const hasKids = children.length > 0;
  const s = getScale(level);

  const childGap = level === 0 ? "gap-10" : level === 1 ? "gap-6" : level === 2 ? "gap-4" : "gap-3";
  const childSpanPx = level === 0 ? 280 : level === 1 ? 230 : level === 2 ? 180 : 140;
  const connH = level < 2 ? "h-6" : level < 4 ? "h-4" : "h-3";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={hasKids ? "cursor-pointer" : ""} onClick={() => hasKids && setOpen(!open)}>
          <Card entity={entity} level={level} />
        </div>
        {hasKids && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex ${s.expandBtn} items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground transition-colors`}
          >
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
      </div>

      {open && children.length > 0 && (
        <>
          <div className={`w-px ${connH} bg-border`} />
          {children.length > 1 && (
            <div className="relative w-full flex justify-center">
              <div className="absolute top-0 h-px bg-border" style={{ width: `${(children.length - 1) * childSpanPx + 20}px` }} />
            </div>
          )}
          <div className={`flex items-start ${childGap} pt-6`}>
            {children.map((c) => (
              <div key={c.partyId} className="flex flex-col items-center">
                <div className={`w-px ${connH} bg-border -mt-6`} />
                <DiagramNode entity={c} childrenOf={childrenOf} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Main diagram with zoom / pan / drag ───────────── */
export function PartyNodeDiagram({ entities }) {
  const childrenOf = useMemo(() => {
    const m = new Map();
    for (const e of entities) {
      if (e.parentName) {
        const list = m.get(e.parentName) || [];
        list.push(e);
        m.set(e.parentName, list);
      }
    }
    return m;
  }, [entities]);

  const root = entities.find((e) => e.parentName === null);

  /* ─── Zoom + Pan state ─────────────────────────────── */
  const [zoom, setZoom] = useState(0.5);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panR = useRef(pan);
  panR.current = pan;
  const containerRef = useRef(null);
  const panRef = useRef(null);
  const isPanning = useRef(false);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z * 1.2, 3)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z / 1.2, 0.2)), []);
  const resetView = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  /* ─── Wheel zoom (non-passive) ─────────────────────── */
      const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom((z) => Math.max(0.2, Math.min(3, z * factor)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ─── Pan handlers ─────────────────────────────────── */
  const onPointerDown = useCallback((e) => {
    // Only allow pan from background — skip if clicking on a card or button
    const target = e.target;
    if (target.closest("[data-card]") || target.closest("button")) return;
    e.preventDefault();
    isPanning.current = true;
    const currentPan = panR.current;
    panRef.current = { startX: e.clientX, startY: e.clientY, startPanX: currentPan.x, startPanY: currentPan.y };
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isPanning.current || !panRef.current) return;
    const dx = e.clientX - panRef.current.startX;
    const dy = e.clientY - panRef.current.startY;
    setPan({ x: panRef.current.startPanX + dx, y: panRef.current.startPanY + dy });
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
    panRef.current = null;
  }, []);

  if (!root) return <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>;

  return (
    <div className="relative h-full overflow-hidden">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-lg bg-card/90 backdrop-blur border border-border shadow-sm p-1">
        <button
          type="button"
          onClick={zoomIn}
          className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] font-medium text-muted-foreground w-9 text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomOut}
          className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <button
          type="button"
          onClick={resetView}
          className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Reset view"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Pannable + zoomable surface */}
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="inline-flex justify-center p-6 origin-top-left transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <DiagramNode entity={root} childrenOf={childrenOf} level={0} />
        </div>
      </div>
    </div>
  );
}
