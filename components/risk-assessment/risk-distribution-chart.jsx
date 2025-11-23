"use client"

const CATEGORIES = [
  { name: "Customer Types", value: 28, color: "bg-blue-500" },
  { name: "Product Risk", value: 22, color: "bg-purple-500" },
  { name: "Channel Risk", value: 18, color: "bg-green-500" },
  { name: "Jurisdictional Risk", value: 15, color: "bg-yellow-500" },
  { name: "Other Business Risks", value: 17, color: "bg-red-500" },
]

export function RiskDistributionChart() {
  const total = CATEGORIES.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <div className="space-y-4">
      {CATEGORIES.map((category) => {
        const percentage = ((category.value / total) * 100).toFixed(1)
        return (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{category.name}</span>
              <span className="text-muted-foreground">
                {category.value} ({percentage}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${category.color}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
