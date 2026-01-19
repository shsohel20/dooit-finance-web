import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { matters } from "./dummyData"

const statusColors = {
  active: "bg-info/20 text-info border-info/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  settled: "bg-success/20 text-success border-success/30",
  "on-hold": "bg-muted text-muted-foreground border-muted",
}

export function RecentMatters() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Matters</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/conveyancer/matters" className="gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matters.slice(0, 3).map((matter) => (
            <div key={matter.id} className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{matter.id}</span>
                    <Badge variant="outline" className={cn("text-xs capitalize", statusColors[matter.status])}>
                      {matter.status}
                    </Badge>
                  </div>
                  <p className="font-medium text-foreground">{matter.propertyAddress}</p>
                  <p className="text-sm text-muted-foreground">
                    {matter.client} • {matter.type.charAt(0).toUpperCase() + matter.type.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">${matter.purchasePrice.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Settlement:{" "}
                    {new Date(matter.settlementDate).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{matter.progress}%</span>
                </div>
                <Progress value={matter.progress} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
