import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock } from "lucide-react"

const actions = [
  {
    id: 1,
    title: "Update Customer Due Diligence Controls",
    category: "Controls",
    priority: "High",
    assignee: "Sarah Chen",
    dueDate: "2025-01-20",
    status: "in_progress",
  },
  {
    id: 2,
    title: "Review Geographic Risk Assessment",
    category: "Risk Assessment",
    priority: "Medium",
    assignee: "John Doe",
    dueDate: "2025-01-25",
    status: "pending",
  },
  {
    id: 3,
    title: "Complete Sanctions Screening Review",
    category: "Compliance",
    priority: "High",
    assignee: "Emma Wilson",
    dueDate: "2025-01-18",
    status: "overdue",
  },
]

export function ActionsList() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Pending Actions</h3>
        <p className="text-sm text-muted-foreground">{actions.length} items require attention</p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex-shrink-0 pt-1">
              {action.status === "overdue" && <AlertCircle className="h-5 w-5 text-destructive" />}
              {action.status === "in_progress" && <Clock className="h-5 w-5 text-warning" />}
              {action.status === "pending" && <Clock className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-tight">{action.title}</h4>
                <Badge variant={action.priority === "High" ? "destructive" : "secondary"} className="flex-shrink-0">
                  {action.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{action.category}</span>
                <span>•</span>
                <span>{action.assignee}</span>
                <span>•</span>
                <span>Due: {action.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full bg-transparent">
          View All Actions
        </Button>
      </div>
    </Card>
  )
}
