"use client";

import { cn } from "@/lib/utils";
import { riskLevelStyle } from "./reportHelpers";

// Single row in the "awaiting review" queue — a report id, its title, and a
// risk badge. Highlights when it's the report currently open in the panel.
export default function ReportQueueItem({ item, active, onSelect }) {
  const level = riskLevelStyle(item.riskLevel);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(item.reportId)}
      className={cn(
        "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
        active ? "border-primary/30 bg-primary/5" : "border-transparent hover:bg-muted/50",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[11px] font-medium text-heading">{item.reportId}</span>
        <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold", level.badge)}>
          {item.riskLevel} {item.riskScore}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{item.title}</p>
      <p className="mt-1 text-[11px] text-muted-foreground/70">
        {item.productCount} product{item.productCount === 1 ? "" : "s"} · {item.tag}
      </p>
    </button>
  );
}
