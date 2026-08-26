"use client";

import { Badge } from "@/components/ui/badge";
import { formatCompletedAt, deriveLineItemsSummary } from "./reportHelpers";

const INDICATOR_STYLES = {
  PRICE_ANOMALY: "border-danger/20 bg-danger/10 text-danger",
  DOCUMENT_INCONSISTENCY: "border-border bg-muted text-muted-foreground",
};

// Report meta line, generated title, and the row of detected TBML
// indicator badges at the top of the panel.
export default function ReportHeader({ report }) {
  const document = report.document_extracts?.[0];
  const products = document?.products || [];
  const indicators = report.tbml_indicators_detected || [];
  const titleSuffix = deriveLineItemsSummary(products);

  return (
    <div className="min-w-0">
      <p className="font-mono text-[11px] text-muted-foreground">
        {report.report_id}
        <span className="mx-1.5">/</span>
        {report.status}
        <span className="mx-1.5">/</span>
        {formatCompletedAt(report.completed_at)}
      </p>

      <h2 className="mt-1 truncate text-xl font-bold text-heading">
        {document?.document_type} {document?.document_number}
        {titleSuffix && <span className="font-normal text-muted-foreground"> — {titleSuffix}</span>}
      </h2>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {indicators.map((indicator) => (
          <Badge
            key={indicator}
            className={INDICATOR_STYLES[indicator] || INDICATOR_STYLES.DOCUMENT_INCONSISTENCY}
          >
            {indicator}
          </Badge>
        ))}
        <span className="text-xs text-muted-foreground">
          {indicators.length} indicator{indicators.length === 1 ? "" : "s"} across {products.length} line item
          {products.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
