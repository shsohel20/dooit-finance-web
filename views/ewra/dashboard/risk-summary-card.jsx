import { Card } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"

const summaryData = [
  {
    title: "Inherent Risk",
    score: 3.8,
    rating: "High",
    trend: 2,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Residual Risk",
    score: 2.4,
    rating: "Medium",
    trend: -5,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Control Effectiveness",
    score: 85,
    rating: "Effective",
    trend: 3,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Risk Appetite",
    score: 92,
    rating: "Within Tolerance",
    trend: 0,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function RiskSummaryCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{item.score}</span>
                {item.title !== "Control Effectiveness" && item.title !== "Risk Appetite" && (
                  <span className="text-xs text-muted-foreground">/5.0</span>
                )}
                {(item.title === "Control Effectiveness" || item.title === "Risk Appetite") && (
                  <span className="text-xs text-muted-foreground">%</span>
                )}
              </div>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.bgColor} ${item.color}`}
              >
                {item.rating}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              {item.trend !== 0 && (
                <>
                  {item.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-chart-2" />
                  )}
                  <span className={item.trend > 0 ? "text-destructive" : "text-chart-2"}>{Math.abs(item.trend)}%</span>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
