import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export function MetricCard({ title, value, icon, trend }) {
  return (
    <Card className="border bg-white ">
      <CardContent className="">
        <div className="flex items-start justify-between ">
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium mb-3 ${
                trend.positive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.positive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="text-primary">{icon}</div>
              <p className="text-sm text-heading  tracking-tighter font-medium">{title}</p>
            </div>
            <p className="text-primary-gray font-medium">Last 30 days</p>
          </div>
          <p className="text-4xl font-semibold tracking-tighter font-mono text-heading">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
