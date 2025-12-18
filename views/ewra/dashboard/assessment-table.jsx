import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreVertical } from "lucide-react"

const assessments = [
  {
    id: 1,
    name: "Q4 2024 AML Risk Assessment",
    type: "AML",
    status: "Approved",
    date: "2024-12-15",
    rating: "High",
  },
  {
    id: 2,
    name: "Sanctions Risk Review",
    type: "Sanctions",
    status: "In Review",
    date: "2025-01-10",
    rating: "Medium",
  },
  {
    id: 3,
    name: "CTF Annual Assessment",
    type: "CTF",
    status: "Draft",
    date: "2025-01-05",
    rating: "High",
  },
]

const getStatusColor = (status) => {
  const colors = {
    Approved: "bg-success/10 text-success",
    "In Review": "bg-warning/10 text-warning",
    Draft: "bg-muted text-muted-foreground",
  }
  return colors[status] || colors["Draft"]
}

export function AssessmentTable() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Assessments</h3>
        <p className="text-sm text-muted-foreground">Latest risk assessment activities</p>
      </div>

      <div className="space-y-3">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{assessment.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {assessment.type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{assessment.date}</span>
                <span>•</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${getStatusColor(assessment.status)}`}
                >
                  {assessment.status}
                </span>
                <span>•</span>
                <span>Risk: {assessment.rating}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full bg-transparent">
          View All Assessments
        </Button>
      </div>
    </Card>
  )
}
