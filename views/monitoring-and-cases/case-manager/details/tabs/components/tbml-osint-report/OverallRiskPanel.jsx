"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { riskLevelStyle } from "./reportHelpers";

// Top-right "overall risk" scorecard: score out of 100, risk level, and a
// note when the case needs analyst confirmation before any action.
export default function OverallRiskPanel({ score, level, requiresReview }) {
  const style = riskLevelStyle(level);

  return (
    <div className={cn("w-56 shrink-0 rounded-xl border p-4 ring-1", style.ring)}>
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Overall risk</p>
      <p className="mt-1 text-lg font-bold text-heading">
        {score} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
      </p>
      <p className={cn("text-xl font-extrabold leading-tight", style.text)}>{level}</p>
      {requiresReview && (
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">analyst confirmation required</p>
      )}
      <Progress value={score} className={cn("mt-2.5 h-1.5 bg-muted", style.progress)} />
    </div>
  );
}
