"use client";

import OsintResultCard from "./OsintResultCard";

// Side-rail container for the per-product OSINT research cards.
export default function OsintResultsRail({ results }) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/20 border-t-[3px] border-t-primary bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2.5 border-b border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="text-xs font-bold tracking-wide text-primary uppercase">OSINT results</span>
        </div>
        <span className="rounded border border-primary/20 bg-card px-2 py-0.5 text-[11px] font-semibold text-primary">
          {results.length} product{results.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        {results.map((result) => (
          <OsintResultCard key={result.productKey} result={result} />
        ))}
      </div>
    </div>
  );
}
