import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, MoreHorizontal } from "lucide-react"

const cases = [
  {
    id: "case1",
    clientName: "John Doe",
    riskScore: "High",
    riskLevel: 85,
    alertType: "Sanctions Screening",
    status: "Pending",
    analyst: "Sarah Chen",
    lastUpdated: "05-08-2025",
  },
  {
    id: "case2",
    clientName: "Jim Doe",
    riskScore: "Medium",
    riskLevel: 65,
    alertType: "Document Verification",
    status: "In Progress",
    analyst: "Michael Torres",
    lastUpdated: "05-08-2025",
  },
  {
    id: "case3",
    clientName: "Sarah Miller",
    riskScore: "Low",
    riskLevel: 35,
    alertType: "KYC",
    status: "Pending",
    analyst: "Nadia Velvet",
    lastUpdated: "05-08-2025",
  },
  {
    id: "case4",
    clientName: "Raj Naiman",
    riskScore: "High",
    riskLevel: 92,
    alertType: "Sanctions Screening",
    status: "Open",
    analyst: "Isabella Hayes",
    lastUpdated: "05-08-2025",
  },
  {
    id: "case5",
    clientName: "Jim Doe",
    riskScore: "Medium",
    riskLevel: 58,
    alertType: "Document Verification",
    status: "In Progress",
    analyst: "Sarah Chen",
    lastUpdated: "05-08-2025",
  },
]

function getRiskBadgeColor(riskScore) {
  if (riskScore === "High") return "bg-red-100 text-red-700 border-red-200"
  if (riskScore === "Medium") return "bg-orange-100 text-orange-700 border-orange-200"
  return "bg-emerald-100 text-emerald-700 border-emerald-200"
}

function getStatusBadgeColor(status) {
  if (status === "Open") return "bg-blue-100 text-blue-700 border-blue-200"
  if (status === "In Progress") return "bg-purple-100 text-purple-700 border-purple-200"
  return "bg-amber-100 text-amber-700 border-amber-200"
}

export function CasesTable() {
  return (
    <Card className="border bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Cases</CardTitle>
            <p className="text-sm text-muted-foreground">Recent case activity and status</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Case ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Client Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Risk Score</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Alert Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Assigned Analyst
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Last Updated
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-mono text-muted-foreground">{caseItem.id}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-medium">{caseItem.clientName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`font-medium ${getRiskBadgeColor(caseItem.riskScore)}`}>
                      {caseItem.riskScore}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm">{caseItem.alertType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`font-medium ${getStatusBadgeColor(caseItem.status)}`}>
                      {caseItem.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm">{caseItem.analyst}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm text-muted-foreground">{caseItem.lastUpdated}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
