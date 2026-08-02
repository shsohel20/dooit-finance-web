"use client";

/**
 * Bordered sub-panel with a count in the heading and its own empty state.
 * Shared by the case-detail sections that group related records
 * (related cases, linked alerts/transactions, regulatory filings).
 */
export default function SubCard({ icon: Icon, title, count, children, empty }) {
  return (
    <div className="rounded-lg border border-border p-3.5">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {title} ({count})
      </p>
      {count === 0 ? <p className="text-sm text-muted-foreground">{empty}</p> : children}
    </div>
  );
}
