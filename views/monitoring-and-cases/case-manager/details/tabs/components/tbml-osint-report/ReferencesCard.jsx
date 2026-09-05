"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { chipClass, referenceRoleKind } from "./reportHelpers";

// The document that was screened, plus every source URL the OSINT pass
// actually consulted — tagged PRICED (contributed to a reference range),
// SCREENED (sanctions/watchlist check) or CONTEXT (read but not relied on).
export default function ReferencesCard({ run }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <span className="text-xs font-semibold tracking-wide text-heading uppercase">
          References — document screened and sources used
        </span>
        <span className="text-[11px] text-muted-foreground">{run.references.length} sources</span>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-primary/15 bg-primary/5 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="rounded border border-primary/20 bg-card px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-primary">
            {run.sourceDocument.type}
          </span>
          <div>
            <p className="text-xs font-semibold text-heading">{run.sourceDocument.file}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{run.sourceDocument.meta}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toast.info(`Opening ${run.sourceDocument.file}`)}
          className="shrink-0 text-xs font-semibold text-primary hover:underline"
        >
          View document
        </button>
      </div>

      <div className="divide-y divide-border/60">
        {run.references.map((ref, i) => (
          <div key={`${ref.domain}-${i}`} className="grid grid-cols-[26px_1fr_110px_120px] items-start gap-3.5 px-5 py-3">
            <span className="pt-0.5 font-mono text-[11px] text-muted-foreground/70">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-heading">{ref.title}</p>
              <p className="font-mono text-[11px] text-primary">{ref.domain}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{ref.note}</p>
            </div>
            <span className="text-[11px] text-muted-foreground">{ref.usedFor}</span>
            <div className="flex flex-col items-end gap-1">
              <span className={cn("rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold", chipClass(referenceRoleKind(ref.role)))}>
                {ref.role}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{ref.retrieved}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 bg-muted/30 px-5 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">{run.referencesFooter}</p>
        <button
          type="button"
          onClick={() => toast.success("Reference list exported")}
          className="shrink-0 text-xs font-semibold text-primary hover:underline"
        >
          Export reference list
        </button>
      </div>
    </div>
  );
}
