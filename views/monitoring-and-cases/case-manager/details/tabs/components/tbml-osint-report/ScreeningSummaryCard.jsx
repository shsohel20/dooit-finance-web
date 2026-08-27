"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { chipClass, riskLevelStyle } from "./reportHelpers";

// Result strip at the top of a screening run: overall risk, detected
// indicators, how much of the invoice was price-tested, sanctions status,
// and the free-text run summary underneath.
export default function ScreeningSummaryCard({ run }) {
  const style = riskLevelStyle(run.overallRisk.level);

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("size-1.5 rounded-full", style.badge.split(" ")[0])} />
          <span className="text-xs font-semibold tracking-wide text-heading uppercase">TBML screening result</span>
          <span className="font-mono text-xs text-muted-foreground">{run.id}</span>
        </div>
        <span className="text-xs text-muted-foreground">{run.docSummaryLine}</span>
      </div>

      <div className="flex flex-wrap items-end gap-8">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Overall risk</p>
          <p className={cn("text-xl font-bold", style.text)}>
            {run.overallRisk.level} <span className="text-sm font-normal text-muted-foreground">{run.overallRisk.score}</span>
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Indicators</p>
          <div className="flex flex-wrap gap-1.5">
            {run.indicators.map((ind) => (
              <span key={ind.label} className={cn("rounded-md border px-2 py-1 font-mono text-[11px] font-semibold", chipClass(ind.kind))}>
                {ind.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Price tested</p>
          <p className="text-sm font-semibold text-heading">{run.testedLine}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Sanctions</p>
          <p className={cn("text-sm font-semibold", run.sanctionsHit ? "text-danger" : "text-success")}>
            {run.sanctionsHit ? "Hit" : "No hit"}
          </p>
        </div>

        <div className="flex-1" />

        <Button size="sm" onClick={() => toast.success(`${run.id} attached to STR/SAR draft`)}>
          Attach to STR/SAR
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{run.summary}</p>
    </div>
  );
}
