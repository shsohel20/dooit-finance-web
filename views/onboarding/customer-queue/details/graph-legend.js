export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="font-medium text-foreground text-xs uppercase tracking-wider">Type</span>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#0ea5e9" }}
          />
          <span className="text-xs">Individual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#a855f7" }}
          />
          <span className="text-xs">Business</span>
        </div>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-4">
        <span className="font-medium text-foreground text-xs uppercase tracking-wider">Risk</span>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#22c55e" }}
          />
          <span className="text-xs">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#f59e0b" }}
          />
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "#ef4444" }}
          />
          <span className="text-xs">High</span>
        </div>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground text-xs uppercase tracking-wider">Status</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-dashed border-destructive" />
          <span className="text-xs">Inactive</span>
        </div>
      </div>
    </div>
  );
}
