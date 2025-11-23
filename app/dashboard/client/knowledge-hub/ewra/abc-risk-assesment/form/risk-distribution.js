
export function RiskDistribution({ categories }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Risk Distribution by Category</h3>
      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
              <span className="text-sm font-semibold text-foreground">{cat.percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${cat.color}`}
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
