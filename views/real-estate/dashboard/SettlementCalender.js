"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { matters } from "./dummyData"

export function SettlementCalendar() {
  const upcomingSettlements = matters
    .filter((m) => m.status !== "settled")
    .sort((a, b) => new Date(a.settlementDate).getTime() - new Date(b.settlementDate).getTime())
    .slice(0, 4)

  const getDaysUntil = (date) => {
    const today = new Date()
    const settlement = new Date(date)
    const diff = Math.ceil((settlement.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Settlements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSettlements.map((matter) => {
            const daysUntil = getDaysUntil(matter.settlementDate)
            return (
              <div
                key={matter.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg font-bold text-primary">{new Date(matter.settlementDate).getDate()}</span>
                  <span className="text-xs text-primary">
                    {new Date(matter.settlementDate).toLocaleDateString("en-AU", { month: "short" })}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{matter.client}</p>
                  <p className="text-sm text-muted-foreground truncate">{matter.propertyAddress}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    daysUntil <= 7
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : daysUntil <= 14
                        ? "bg-warning/20 text-warning border-warning/30"
                        : "bg-success/20 text-success border-success/30"
                  }
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {daysUntil} days
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
