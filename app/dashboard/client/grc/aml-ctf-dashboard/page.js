"use client";

import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Activity,
  CheckCircle2,
  Play,
  FileText,
  ClipboardList,
  Send,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const metrics = [
  {
    title: "Risk Exposure",
    value: "$2.8M",
    change: "-12% vs prev",
    trend: "down",
    icon: DollarSign,
  },
  {
    title: "Control Effectiveness",
    value: "92.4%",
    change: "+3.2%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "SMR Compliance",
    value: "98.7%",
    change: "+1.5%",
    trend: "up",
    icon: CheckCircle2,
  },
  {
    title: "AUSTRAC Ready",
    value: "READY",
    change: "Last audit: Jul 2024",
    trend: "neutral",
    icon: CheckCircle2,
  },
];

const recentActivity = [
  {
    text: 'Test "SMR Effectiveness Q3" completed',
    time: "2 hours ago",
  },
  {
    text: "3 ECDD files escalated for review",
    time: "5 hours ago",
  },
  {
    text: "Regulatory update: AUSTRAC guidance changed",
    time: "1 day ago",
  },
];

const riskZones = [
  { zone: "New South Wales", level: "High", count: 12 },
  { zone: "Victoria", level: "Medium", count: 8 },
  { zone: "Queensland", level: "Medium", count: 6 },
  { zone: "Western Australia", level: "Low", count: 3 },
  { zone: "South Australia", level: "Low", count: 2 },
];

const testingSchedule = [
  { name: "Control Tests", frequency: "Daily", status: "On Track" },
  { name: "ECDD Reviews", frequency: "Weekly", status: "On Track" },
  { name: "SMR Effectiveness", frequency: "Monthly", status: "Due Soon" },
  { name: "Independent Evaluation", frequency: "Quarterly", status: "Scheduled" },
];

export default function AmlCtfDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          AML/CTF Assurance Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Real-time monitoring & compliance insights</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{metric.title}</span>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
                {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-success" />}
                <span
                  className={metric.trend === "neutral" ? "text-muted-foreground" : "text-success"}
                >
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Intelligence */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              Risk Heat Map
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {riskZones.map((zone) => (
              <div key={zone.zone} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      zone.level === "High"
                        ? "bg-destructive"
                        : zone.level === "Medium"
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                  />
                  <span className="text-sm text-foreground">{zone.zone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      zone.level === "High"
                        ? "border-destructive/30 text-destructive"
                        : zone.level === "Medium"
                          ? "border-warning/30 text-warning"
                          : "border-success/30 text-success"
                    }`}
                  >
                    {zone.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{zone.count} alerts</span>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
              View Detailed Risk Report
            </Button>
          </CardContent>
        </Card>

        {/* Testing & Monitoring */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <ClipboardList className="h-4 w-4 text-primary" />
              Testing Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {testingSchedule.map((test) => (
              <div
                key={test.name}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{test.name}</p>
                  <p className="text-xs text-muted-foreground">{test.frequency}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    test.status === "On Track"
                      ? "border-success/30 text-success"
                      : test.status === "Due Soon"
                        ? "border-warning/30 text-warning"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {test.status}
                </Badge>
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Schedule New Test
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View All Tests
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Compliance */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              AUSTRAC Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Forms Completion</span>
                <span className="font-medium text-foreground">24/28</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Submission</span>
                <span className="font-medium text-foreground">15 Oct 2024</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last AUSTRAC Contact</span>
                <span className="font-medium text-foreground">2 Jun 2024</span>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Annual Report Progress</span>
                <span className="font-medium text-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Go to Forms Hub
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Regulatory Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex h-auto flex-col items-center gap-2 py-4 bg-transparent"
              >
                <Play className="h-5 w-5 text-primary" />
                <span className="text-xs">Start New Test</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-auto flex-col items-center gap-2 py-4 bg-transparent"
              >
                <Send className="h-5 w-5 text-primary" />
                <span className="text-xs">File SMR</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-auto flex-col items-center gap-2 py-4 bg-transparent"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-xs">Review ECDD</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-auto flex-col items-center gap-2 py-4 bg-transparent"
              >
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-xs">Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
