import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertOctagon, Info, ShieldAlert } from "lucide-react";

const severityConfig = {
  low: {
    icon: <Info className="size-4" />,
    border: "border-l-emerald-400",
    bg: "bg-emerald-50/50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  medium: {
    icon: <AlertTriangle className="size-4" />,
    border: "border-l-amber-400",
    bg: "bg-amber-50/30",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  high: {
    icon: <ShieldAlert className="size-4" />,
    border: "border-l-orange-400",
    bg: "bg-orange-50/30",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  critical: {
    icon: <AlertOctagon className="size-4" />,
    border: "border-l-red-500",
    bg: "bg-red-50/30",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
};

export function RiskIndicatorsPanel({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShieldAlert className="size-8 mb-2 opacity-40" />
        <p className="text-sm">No risk indicators identified.</p>
      </div>
    );
  }

  // Sort: critical -> high -> medium -> low
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...items].sort((a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4));

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((item) => {
        const cfg = severityConfig[item.severity] ?? severityConfig.low;
        return (
          <div
            key={item.id}
            className={`flex items-start gap-3 rounded-lg border border-border border-l-[3px] ${cfg.border} ${cfg.bg} p-4`}
          >
            <div className="shrink-0 mt-0.5 text-muted-foreground">{cfg.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <Badge variant="outline" className={cfg.badge}>
                  {item.severity.toUpperCase()}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">{item.category}</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-snug">{item.indicator}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-1">
                Source: {item.source}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
