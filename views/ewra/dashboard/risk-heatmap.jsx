"use client"

import { Card } from "@/components/ui/card"

const categories = ["Customer", "Product", "Channel", "Geography", "Environment"]
const riskLevels = ["Low", "Medium", "High", "Extreme"]

const heatmapData = [
  { category: "Customer", inherent: 3, residual: 2 },
  { category: "Product", inherent: 4, residual: 2 },
  { category: "Channel", inherent: 2, residual: 1 },
  { category: "Geography", inherent: 4, residual: 3 },
  { category: "Environment", inherent: 3, residual: 2 },
]

const getRiskColor = (level) => {
  const colors = ["bg-chart-2", "bg-success", "bg-warning", "bg-destructive"]
  return colors[level - 1] || colors[0]
}

const getRiskLabel = (level) => {
  return riskLevels[level - 1] || "Low"
}

export function RiskHeatmap() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Risk Heatmap by Category</h3>
          <p className="text-sm text-muted-foreground">Inherent vs Residual Risk across all risk factors</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <span className="text-muted-foreground">Inherent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-chart-2" />
            <span className="text-muted-foreground">Residual</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {heatmapData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Inherent: {getRiskLabel(item.inherent)}</span>
                <span>Residual: {getRiskLabel(item.residual)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
                <div
                  className={`h-full ${getRiskColor(item.inherent)} opacity-60 transition-all`}
                  style={{ width: `${(item.inherent / 4) * 100}%` }}
                />
              </div>
              <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
                <div
                  className={`h-full ${getRiskColor(item.residual)} transition-all`}
                  style={{ width: `${(item.residual / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
