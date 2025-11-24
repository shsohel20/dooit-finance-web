import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Open", value: 56, color: "bg-blue-500" },
  { label: "Pending", value: 120, color: "bg-purple-500" },
  { label: "Closed", value: 290, color: "bg-emerald-500" },
]

export function CaseDistribution() {
  const total = stats.reduce((acc, stat) => acc + stat.value, 0)

  return (
    <Card className="border bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Case Status Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Current case breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
          <p className="text-4xl font-semibold">{total}</p>
        </div>

        <div className="space-y-4">
          {stats.map((stat) => {
            const percentage = ((stat.value / total) * 100).toFixed(1)
            return (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">{stat.value}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stat.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
