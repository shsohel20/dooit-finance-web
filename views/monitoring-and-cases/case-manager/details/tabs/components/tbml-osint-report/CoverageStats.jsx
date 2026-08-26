"use client";

// The 2x2 "coverage, last 7 days" stat grid at the bottom of the sidebar.
export default function CoverageStats({ stats }) {
  if (!stats) return null;

  const cells = [
    { label: "Documents screened", value: stats.documentsScreened },
    { label: "Products price-tested", value: `${stats.productsPriceTestedPct}%` },
    { label: "High-risk open", value: stats.highRiskOpen },
    { label: "Median clearance", value: `${stats.medianClearanceDays}d` },
  ];

  return (
    <div className="border-t border-border pt-3">
      <p className="mb-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        Coverage, last 7 days
      </p>
      <div className="grid grid-cols-2 gap-y-3">
        {cells.map((cell) => (
          <div key={cell.label}>
            <p className="text-base font-bold text-heading">{cell.value}</p>
            <p className="text-[11px] leading-snug text-muted-foreground">{cell.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
