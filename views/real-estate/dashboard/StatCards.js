import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Building2, FileCheck, ShieldCheck, Users } from "lucide-react"
import { cn } from "@/lib/utils"



function StatCard({ title, value, change, changeLabel, icon: Icon, trend }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                ) : null}
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-success",
                    trend === "down" && "text-destructive",
                    trend === "neutral" && "text-muted-foreground",
                  )}
                >
                  {change > 0 ? "+" : ""}
                  {change}%
                </span>
                {changeLabel && <span className="text-sm text-muted-foreground">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Matters"
        value={24}
        change={12}
        changeLabel="from last month"
        icon={Building2}
        trend="up"
      />
      <StatCard
        title="Pending Settlements"
        value={5}
        change={-3}
        changeLabel="from last week"
        icon={FileCheck}
        trend="down"
      />
      <StatCard
        title="Compliance Rate"
        value="94.2%"
        change={2.1}
        changeLabel="improvement"
        icon={ShieldCheck}
        trend="up"
      />
      <StatCard title="Active Clients" value={156} change={8} changeLabel="new this month" icon={Users} trend="up" />
    </div>
  )
}
