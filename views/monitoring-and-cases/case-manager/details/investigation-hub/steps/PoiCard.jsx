"use client";

import { IconFileText, IconFileDescription, IconX } from "@tabler/icons-react";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ECDD_STATUS_STYLE = {
  Complete: "bg-success/10 text-success",
  "In review": "bg-warning/10 text-warning",
};

export default function PoiCard({ poi, onRemove }) {
  const hasReports = poi.reports && poi.reports.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-3.5 border-b border-border/70 px-4 py-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-heading">
          {getInitials(poi.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-heading">{poi.name}</div>
          <div className="text-xs text-muted-foreground">{poi.meta}</div>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: poi.color, background: `${poi.color}18` }}
        >
          {poi.role}
        </span>
        <button
          type="button"
          onClick={() => onRemove(poi.id)}
          title="Remove"
          className="flex size-7 shrink-0 items-center justify-center rounded-md border border-danger/30 bg-danger/10 text-danger transition-colors hover:bg-danger/20"
        >
          <IconX className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2">
        <div className="border-r border-border/70 p-3.5">
          <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-violet-700">
            Connected ECDDs
          </div>
          <div className="flex flex-col gap-1.5">
            {(poi.ecdds || []).length === 0 && (
              <p className="px-1 text-xs text-muted-foreground">No ECDDs on record.</p>
            )}
            {(poi.ecdds || []).map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-2 py-1.5 text-xs"
              >
                <IconFileDescription className="size-3.5 text-violet-700" />
                <span className="flex-1 font-semibold text-violet-700">{e.id}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", ECDD_STATUS_STYLE[e.status])}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3.5">
          <div className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-orange-700">
            Prior SARs / SMRs
          </div>
          <div className="flex flex-col gap-1.5">
            {!hasReports && <p className="px-1 text-xs text-muted-foreground">No prior reports on record.</p>}
            {(poi.reports || []).map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-2 py-1.5 text-xs"
              >
                <IconFileText className="size-3.5 text-orange-700" />
                <span className="flex-1 font-semibold text-orange-700">{r.id}</span>
                <span className="text-muted-foreground">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
