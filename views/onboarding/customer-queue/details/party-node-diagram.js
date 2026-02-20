"use client";

import { useState, useMemo } from "react";
import { User, Building2 } from "lucide-react";

function fmtAmt(amount, currency) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ${currency}`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ${currency}`;
  return `${amount} ${currency}`;
}

/* Scale config per depth level */
const LEVEL_SCALES = [
  { minW: 200, maxW: 240, pad: "p-4",   nameSize: "text-sm",    metaSize: "text-xs",    txSize: "text-xs",    iconSize: "h-4 w-4", iconPad: "p-1.5", borderW: 4, gap: "mt-2.5 pt-2", iconTop: "-top-3", connH: "h-6", expandSize: "h-6 w-6 text-xs" },
  { minW: 180, maxW: 210, pad: "p-3",   nameSize: "text-xs",    metaSize: "text-[10px]", txSize: "text-[10px]", iconSize: "h-3 w-3", iconPad: "p-1",   borderW: 3, gap: "mt-2 pt-1.5",  iconTop: "-top-2.5", connH: "h-5", expandSize: "h-5 w-5 text-[10px]" },
  { minW: 150, maxW: 175, pad: "p-2.5", nameSize: "text-[11px]", metaSize: "text-[9px]",  txSize: "text-[9px]",  iconSize: "h-2.5 w-2.5", iconPad: "p-0.5", borderW: 2.5, gap: "mt-1.5 pt-1", iconTop: "-top-2", connH: "h-4", expandSize: "h-4 w-4 text-[9px]" },
  { minW: 120, maxW: 145, pad: "p-2",   nameSize: "text-[10px]", metaSize: "text-[8px]",  txSize: "text-[8px]",  iconSize: "h-2 w-2", iconPad: "p-0.5", borderW: 2, gap: "mt-1 pt-1",    iconTop: "-top-1.5", connH: "h-3", expandSize: "h-3.5 w-3.5 text-[8px]" },
  { minW: 100, maxW: 120, pad: "p-1.5", nameSize: "text-[9px]",  metaSize: "text-[7px]",  txSize: "text-[7px]",  iconSize: "h-1.5 w-1.5", iconPad: "p-px", borderW: 1.5, gap: "mt-0.5 pt-0.5", iconTop: "-top-1", connH: "h-2", expandSize: "h-3 w-3 text-[7px]" },
];

function getScale(level) {
  return LEVEL_SCALES[Math.min(level, LEVEL_SCALES.length - 1)];
}

function Card({ entity, level }) {
  const s = getScale(level);
  const p = entity.type === "individual"
    ? { fill: "#2563eb", bg: "#eff6ff", ring: "#bfdbfe" }
    : { fill: "#7c3aed", bg: "#f5f3ff", ring: "#ddd6fe" };

  const tOut = entity.outgoingTransactions.reduce((acc, t) => acc + t.amount, 0);
  const tIn = entity.incomingTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div
      className={`relative rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow ${s.pad}`}
      style={{ borderLeft: `${s.borderW}px solid ${p.fill}`, minWidth: s.minW, maxWidth: s.maxW }}
    >
      <div className={`absolute ${s.iconTop} left-3 rounded-md ${s.iconPad} bg-card border shadow-sm`} style={{ borderColor: p.ring }}>
        {entity.type === "individual" ? (
          <User className={s.iconSize} style={{ color: p.fill }} />
        ) : (
          <Building2 className={s.iconSize} style={{ color: p.fill }} />
        )}
      </div>

      <div className="pt-1">
        <div className={`${s.nameSize} font-semibold text-foreground text-balance leading-snug`}>{entity.name}</div>
        <div className={`mt-0.5 space-y-0.5 ${s.metaSize} text-muted-foreground`}>
          <div className="capitalize">{entity.type} &middot; {entity.client}</div>
          <div className="font-medium" style={{ color: entity.relationType === "family" ? "#3b82f6" : "#94a3b8" }}>
            {entity.relation}
          </div>
        </div>

        {(tOut > 0 || tIn > 0) && (
          <div className={`${s.gap} border-t border-border flex items-center gap-1.5 flex-wrap`}>
            {tOut > 0 && (
              <span className={`${s.txSize} font-semibold`} style={{ color: "#dc2626" }}>
                Out: {fmtAmt(tOut, "BDT")}
              </span>
            )}
            {tIn > 0 && (
              <span className={`${s.txSize} font-semibold`} style={{ color: "#16a34a" }}>
                In: {fmtAmt(tIn, "BDT")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DiagramNode({
  entity,
  childrenOf,
  level,
}) {
  const [open, setOpen] = useState(level === 0);
  const children = childrenOf.get(entity.name) || [];
  const hasKids = children.length > 0;
  const s = getScale(level);
  const cs = getScale(level + 1);

  // Gap between children shrinks per level
  const childGap = level === 0 ? "gap-10" : level === 1 ? "gap-8" : level === 2 ? "gap-5" : "gap-3";
  const childSpanPx = level === 0 ? 260 : level === 1 ? 220 : level === 2 ? 170 : 130;
  const connHMap = { "h-6": "h-6", "h-5": "h-5", "h-4": "h-4", "h-3": "h-3", "h-2": "h-2" };
  const connCls = connHMap[s.connH] || "h-4";
  const childConnCls = connHMap[cs.connH] || "h-3";

  return (
    <div className="flex flex-col items-center">
      <div className="relative cursor-pointer" onClick={() => hasKids && setOpen(!open)}>
        <Card entity={entity} level={level} />
        {hasKids && (
          <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex ${s.expandSize} items-center justify-center rounded-full bg-card border border-border font-semibold text-muted-foreground shadow-sm hover:bg-accent transition-colors`}>
            {open ? "\u2212" : "+"}
          </div>
        )}
      </div>

      {open && children.length > 0 && (
        <>
          <div className={`w-px ${connCls} bg-border`} />
          {children.length > 1 && (
            <div className="relative w-full flex justify-center">
              <div className="absolute top-0 h-px bg-border" style={{ width: `${(children.length - 1) * childSpanPx + 20}px` }} />
            </div>
          )}
          <div className={`flex items-start ${childGap} pt-6`}>
            {children.map((c) => (
              <div key={c.name} className="flex flex-col items-center">
                <div className={`w-px ${childConnCls} bg-border -mt-6`} />
                <DiagramNode entity={c} childrenOf={childrenOf} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PartyNodeDiagram({ entities }) {
  const childrenOf = useMemo(() => {
    const m = new Map();
    for (const e of entities) {
      if (e.invitedBy) {
        const l = m.get(e.invitedBy) || [];
        l.push(e);
        m.set(e.invitedBy, l);
      }
    }
    return m;
  }, [entities]);

  const root = entities.find((e) => e.invitedBy === null);
  if (!root) return null;

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex justify-center min-w-max">
        <DiagramNode entity={root} childrenOf={childrenOf} level={0} />
      </div>
    </div>
  );
}
