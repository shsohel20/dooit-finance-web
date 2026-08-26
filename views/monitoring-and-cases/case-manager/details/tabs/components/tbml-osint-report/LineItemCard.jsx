"use client";

import { cn } from "@/lib/utils";
import FindingRow from "./FindingRow";
import PriceComparisonBar from "./PriceComparisonBar";
import {
  describeHsCode,
  describeQuantity,
  describeCurrency,
  computeMarketPosition,
  formatNumber,
  parseCurrencyNumber,
  riskLevelStyle,
  tidyUnitLabel,
} from "./reportHelpers";

// Pulls "9 comparable observation(s)" -> 9 out of the osint availability note.
function extractComparableCount(note) {
  const match = String(note || "").match(/(\d+)\s+comparable/i);
  return match ? Number(match[1]) : null;
}

export default function LineItemCard({ lineItem }) {
  const { product, analysis, osint } = lineItem;
  const isTestable = analysis && analysis.risk_level !== "INSUFFICIENT_DATA";
  const style = riskLevelStyle(analysis?.risk_level);

  const declared = parseCurrencyNumber(product.unit_price ?? product.total_price);
  const low = parseCurrencyNumber(osint?.reference_price_low);
  const high = parseCurrencyNumber(osint?.reference_price_high);
  const mid = parseCurrencyNumber(osint?.reference_price_mid);
  const position = isTestable ? computeMarketPosition({ declared, low, high }) : null;
  const comparableCount = extractComparableCount(osint?.availability_note);
  const unit = tidyUnitLabel(osint?.reference_price_unit);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header: line number, risk badge, description, declared amount */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
              LINE {String(product.line_number).padStart(3, "0")}
            </span>
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", style.badge)}>
              {isTestable ? `RISK ${analysis.risk_score}` : "NOT TESTABLE"}
            </span>
          </div>
          <h4 className="mt-1.5 text-sm leading-snug font-semibold text-heading">{product.description}</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {describeHsCode(product)} · {describeQuantity(product)} · {describeCurrency(product)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Declared</p>
          <p className="text-lg font-bold text-heading">{formatNumber(declared)}</p>
          {position ? (
            <p className={cn("text-xs font-semibold", position.direction === "within" ? "text-success" : "text-danger")}>
              {position.label}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">no unit basis to compare</p>
          )}
        </div>
      </div>

      {/* Declared-vs-market comparison */}
      {low != null && high != null && (
        <div className="mt-4 rounded-lg border border-border/60 bg-muted/20 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            <span>
              {isTestable
                ? "Declared vs OSINT market range"
                : "Market reference exists, declared value cannot be tested"}
            </span>
            {isTestable && (
              <span className="font-normal normal-case text-muted-foreground/80">
                {osint.price_observation_count} price observations
                {comparableCount != null && ` · ${comparableCount} comparables`}
                {unit && ` · basis: ${unit}`}
              </span>
            )}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <PriceComparisonBar
              low={low}
              high={high}
              mid={isTestable ? mid : null}
              declared={isTestable ? declared : null}
              unit={!isTestable ? `${osint.reference_price_currency || ""} ${formatNumber(low)} - ${formatNumber(high)} per ${osint.reference_price_unit}`.trim() : null}
              note={!isTestable ? "quantity missing — declared price not placeable on this scale" : null}
              testable={isTestable}
            />

            {!isTestable && (
              <div className="rounded-lg border border-border bg-card px-3 py-2.5 sm:w-52">
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Data availability
                </p>
                <p className="mt-0.5 text-xs font-semibold text-heading">Insufficient for scoring</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {comparableCount != null
                    ? `${comparableCount} comparable observation${comparableCount === 1 ? "" : "s"} found`
                    : "Comparable observations found"}
                  — invoice lacks the quantity needed to apply them.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Findings for this line item */}
      {analysis?.findings?.length > 0 && (
        <div className="mt-3">
          {analysis.findings.map((finding, i) => (
            <FindingRow key={`${finding.indicator}-${i}`} finding={finding} />
          ))}
        </div>
      )}
    </div>
  );
}
