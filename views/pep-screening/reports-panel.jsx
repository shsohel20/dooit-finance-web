"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  FileText,
  PieChart,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const reportTemplates = [
  {
    id: "screening_summary",
    name: "Screening Summary",
    description: "Overview of all screening activities",
    icon: BarChart3,
    lastGenerated: "Today, 08:30 AM",
  },
  {
    id: "match_analysis",
    name: "Match Analysis",
    description: "Breakdown of matches by list type and risk tier",
    icon: PieChart,
    lastGenerated: "Jan 14, 2024",
  },
  {
    id: "sla_compliance",
    name: "SLA Compliance",
    description: "Case resolution times and SLA adherence",
    icon: Clock,
    lastGenerated: "Jan 13, 2024",
  },
  {
    id: "analyst_productivity",
    name: "Analyst Productivity",
    description: "Individual and team performance metrics",
    icon: TrendingUp,
    lastGenerated: "Jan 12, 2024",
  },
  {
    id: "regulatory_pack",
    name: "Regulatory Audit Pack",
    description: "Comprehensive documentation for examinations",
    icon: FileText,
    lastGenerated: "Jan 10, 2024",
  },
];

export function ReportsPanel() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-muted-foreground">Entities Screened</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Match Rate</p>
                <p className="text-2xl font-bold">3.2%</p>
                <p className="text-xs text-emerald-600">-0.4% from last week</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">False Positive Rate</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-muted-foreground">Of total matches</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold">96.4%</p>
                <p className="text-xs text-emerald-600">Above target</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Screening Volume Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Screening Volume</CardTitle>
                <CardDescription>Daily screening activity over time</CardDescription>
              </div>
              <Select defaultValue="7d">
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder Chart */}
            <div className="h-[200px] flex items-end gap-2">
              {[65, 45, 78, 52, 89, 67, 74].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disposition Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Disposition Breakdown</CardTitle>
            <CardDescription>Case outcomes this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">False Positives</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[78%] bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">True Positives</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[15%] bg-red-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Pending Investigation</span>
                    <span className="text-sm text-muted-foreground">7%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[7%] bg-amber-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Generate pre-configured compliance reports</CardDescription>
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <template.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          Last: {template.lastGenerated}
                        </span>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Download className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
