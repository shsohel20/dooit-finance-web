import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { complianceCases } from './dummyData'
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const statusConfig = {
  approved: {
    color: "bg-success/20 text-success border-success/30",
    icon: CheckCircle2,
  },
  pending: {
    color: "bg-warning/20 text-warning border-warning/30",
    icon: Clock,
  },
  flagged: {
    color: "bg-destructive/20 text-destructive border-destructive/30",
    icon: AlertTriangle,
  },
  rejected: {
    color: "bg-muted text-muted-foreground border-muted",
    icon: XCircle,
  },
}

const riskColors = {
  low: "text-success",
  medium: "text-warning",
  high: "text-destructive",
}

export function ComplianceOverview() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Compliance Status</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/compliance/cases" className="gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {complianceCases.slice(0, 4).map((caseItem) => {
            const config = statusConfig[caseItem.status]
            const StatusIcon = config.icon
            return (
              <div
                key={caseItem.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full p-1.5", config.color)}>
                    <StatusIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{caseItem.client}</p>
                    <p className="text-xs text-muted-foreground">{caseItem.type} Check</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn("text-xs", config.color)}>
                    {caseItem.status}
                  </Badge>
                  <span className={cn("text-xs font-medium capitalize", riskColors[caseItem.riskLevel])}>
                    {caseItem.riskLevel} Risk
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
