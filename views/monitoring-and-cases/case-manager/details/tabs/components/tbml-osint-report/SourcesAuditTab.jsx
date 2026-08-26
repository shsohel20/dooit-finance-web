"use client";

import { Globe2, Search, Cpu, TriangleAlert } from "lucide-react";
import { formatCompletedAt } from "./reportHelpers";

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-center">
      <p className="text-base font-bold text-heading">{value}</p>
      <p className="text-[11px] leading-snug text-muted-foreground">{label}</p>
    </div>
  );
}

// Third tab: how the OSINT research was actually gathered — query/page
// stats, which domains were consulted per product, and any limitations the
// model flagged while extracting the document.
export default function SourcesAuditTab({ report }) {
  const methodology = report.methodology || {};
  const osintResults = report.osint_results || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Search className="size-3.5" /> Research methodology
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile label="Queries run" value={methodology.queries_attempted ?? "—"} />
          <StatTile label="Pages read" value={methodology.pages_read ?? "—"} />
          <StatTile label="Pages relevant" value={methodology.pages_relevant ?? "—"} />
          <StatTile label="Price observations" value={methodology.price_observations ?? "—"} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Collected {formatCompletedAt(methodology.collected_at)} via {methodology.search_provider || "—"}
          {methodology.model_usage?.models_used?.length > 0 &&
            ` · model${methodology.model_usage.models_used.length === 1 ? "" : "s"}: ${methodology.model_usage.models_used.join(", ")}`}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Globe2 className="size-3.5" /> Domains consulted
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(methodology.domains_consulted || []).map((domain) => (
            <span
              key={domain}
              className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {domain}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Cpu className="size-3.5" /> Price sources by line item
        </p>
        <div className="mt-3 flex flex-col divide-y divide-border/60">
          {osintResults.map((result) => (
            <div key={result.product_key} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
              <span className="text-xs font-medium text-heading" title={result.product_description}>
                {result.product_description}
              </span>
              <span className="flex flex-wrap gap-1.5">
                {(result.price_sources || []).map((src) => (
                  <span
                    key={src}
                    className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {src}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {methodology.limitations?.length > 0 && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-yellow-700 uppercase">
            <TriangleAlert className="size-3.5" /> Limitations
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {methodology.limitations.map((limitation, i) => (
              <li key={i} className="text-xs leading-relaxed text-muted-foreground">
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
