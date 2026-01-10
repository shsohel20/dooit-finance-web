import { Badge } from "@/components/ui/badge";

export function RiskBadge({ tier, showLabel = true }) {
  const config = {
    critical: {
      label: "Critical",
      className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    },
    high: {
      label: "High",
      className: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100",
    },
    medium: {
      label: "Medium",
      className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    low: {
      label: "Low",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
  };

  const { label, className } = config[tier];

  return (
    <Badge variant="outline" className={className}>
      {showLabel ? label : tier.charAt(0).toUpperCase()}
    </Badge>
  );
}
