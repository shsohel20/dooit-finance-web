import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"



export function MetricCard({ title, value, icon, trend }) {
  return (
    <Card className="border bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-lg bg-muted text-foreground">{icon}</div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? "text-emerald-600" : "text-red-600"
                }`}
            >
              {trend.positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
