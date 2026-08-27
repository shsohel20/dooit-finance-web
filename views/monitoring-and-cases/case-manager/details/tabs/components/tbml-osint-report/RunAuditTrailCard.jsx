"use client";

// Query/page stats and the domain list consulted to produce this run —
// the "show your work" panel for the OSINT pass.
export default function RunAuditTrailCard({ audit }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <span className="text-xs font-semibold tracking-wide text-heading uppercase">Run audit trail</span>

      <div className="grid grid-cols-2 gap-3">
        {audit.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="font-mono text-[15px] font-medium text-heading">{stat.value}</span>
            <span className="text-[11px] text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {audit.domains.map((domain) => (
          <span key={domain} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {domain}
          </span>
        ))}
      </div>

      <span className="font-mono text-[11px] text-muted-foreground">{audit.footer}</span>
    </div>
  );
}
