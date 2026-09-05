"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Pills for each screening run on this case, plus the entry point into the
// "run new screening" upload flow.
export default function RunSwitcher({ runs, activeIndex, onSelect, onOpenUpload }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-card p-3">
      {runs.map((run, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={run.id}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "flex flex-col gap-0.5 rounded-lg border px-3 py-1.5 text-left transition-colors",
              active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/50",
            )}
          >
            <span className="font-mono text-[11.5px] font-semibold">{run.id}</span>
            <span className={cn("text-[11px]", active ? "opacity-80" : "text-muted-foreground")}>{run.pillMeta}</span>
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        type="button"
        onClick={onOpenUpload}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-3.5" />
        Run new screening
      </button>
    </div>
  );
}
