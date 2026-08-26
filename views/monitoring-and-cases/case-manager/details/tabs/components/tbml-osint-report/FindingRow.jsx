"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const INDICATOR_LABELS = {
  PRICE_ANOMALY: "border-danger/20 bg-danger/10 text-danger",
  DOCUMENT_INCONSISTENCY: "border-border bg-muted text-muted-foreground",
};

const SEVERITY_STYLES = {
  HIGH: "border-danger/20 bg-danger/10 text-danger",
  MEDIUM: "border-warning/20 bg-warning/10 text-yellow-700",
  LOW: "border-border bg-muted text-muted-foreground",
};

const SEVERITY_DOT = {
  HIGH: "bg-danger",
  MEDIUM: "bg-warning",
  LOW: "bg-muted-foreground",
};

// A single TBML indicator on a line item. The headline is the first
// sentence of `description`; any remaining sentences are shown as a muted
// caveat below the evidence/recommendation once expanded.
export default function FindingRow({ finding }) {
  const [expanded, setExpanded] = useState(finding.severity === "HIGH");

  const sentences = String(finding.description || "").split(/(?<=[.!?])\s+/).filter(Boolean);
  const headline = sentences[0] || finding.description;
  const caveat = sentences.slice(1).join(" ");

  return (
    <div className="border-t border-border/60 py-3 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-2.5 text-left"
      >
        <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", SEVERITY_DOT[finding.severity])} />
        <span className="flex flex-1 flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wide",
              INDICATOR_LABELS[finding.indicator] || INDICATOR_LABELS.DOCUMENT_INCONSISTENCY,
            )}
          >
            {finding.indicator}
          </span>
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 text-[10px] font-bold",
              SEVERITY_STYLES[finding.severity] || SEVERITY_STYLES.LOW,
            )}
          >
            {finding.severity}
          </span>
          <span className="text-xs text-heading">{headline}</span>
        </span>
        <span className="shrink-0 text-[11px] font-medium text-primary">
          {expanded ? "hide detail" : "show detail"}
        </span>
      </button>

      {expanded && (
        <div className="mt-2.5 grid gap-3 pl-4 sm:grid-cols-2">
          {finding.evidence && (
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Evidence
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{finding.evidence}</p>
            </div>
          )}
          {finding.recommendation && (
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Recommendation
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {finding.recommendation}
              </p>
            </div>
          )}
          {caveat && (
            <p className="text-[11px] leading-relaxed text-muted-foreground/70 italic sm:col-span-2">
              {caveat}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
