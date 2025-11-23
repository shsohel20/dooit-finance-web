"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, BarChart3, PieChart } from "lucide-react"

export function RiskReports() {
  const reports = [
    {
      title: "Institutional Risk Summary",
      description: "Comprehensive overview of all institutional risk items",
      icon: FileText,
      format: "PDF",
    },
    {
      title: "Customer Risk Analytics",
      description: "Statistical analysis of customer risk assessments",
      icon: BarChart3,
      format: "Excel",
    },
    {
      title: "Risk Heat Map",
      description: "Visual representation of risk distribution",
      icon: PieChart,
      format: "PDF",
    },
    {
      title: "Control Effectiveness Report",
      description: "Assessment of control measures and their effectiveness",
      icon: FileText,
      format: "PDF",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Reports & Analytics</CardTitle>
          <CardDescription>Generate and export comprehensive risk assessment reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.title}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{report.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">{report.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export as {report.format}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
