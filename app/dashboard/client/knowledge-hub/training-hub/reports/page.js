"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  ChevronDown,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const mockProgressData = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    module: "KYC Fundamentals",
    progress: 100,
    status: "passed",
    attempts: 1,
    latestScore: 92,
    completionDate: "2024-02-08",
    attempts_detail: [
      { attemptNumber: 1, date: "2024-02-08", score: 92, status: "passed", timeSpent: "12 mins" },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    module: "KYC Fundamentals",
    progress: 100,
    status: "passed",
    attempts: 2,
    latestScore: 85,
    completionDate: "2024-02-07",
    attempts_detail: [
      { attemptNumber: 1, date: "2024-02-06", score: 68, status: "failed", timeSpent: "10 mins" },
      { attemptNumber: 2, date: "2024-02-07", score: 85, status: "passed", timeSpent: "14 mins" },
    ],
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael@company.com",
    module: "AML Procedures",
    progress: 67,
    status: "in-progress",
    attempts: 0,
    latestScore: 0,
    attempts_detail: [],
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily@company.com",
    module: "AML Procedures",
    progress: 100,
    status: "failed",
    attempts: 1,
    latestScore: 55,
    attempts_detail: [
      { attemptNumber: 1, date: "2024-02-05", score: 55, status: "failed", timeSpent: "8 mins" },
    ],
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert@company.com",
    module: "Sanctions Screening",
    progress: 100,
    status: "passed",
    attempts: 1,
    latestScore: 88,
    completionDate: "2024-02-03",
    attempts_detail: [
      { attemptNumber: 1, date: "2024-02-03", score: 88, status: "passed", timeSpent: "11 mins" },
    ],
  },
  {
    id: "6",
    name: "Lisa Thompson",
    email: "lisa@company.com",
    module: "Transaction Monitoring",
    progress: 45,
    status: "in-progress",
    attempts: 0,
    latestScore: 0,
    attempts_detail: [],
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james@company.com",
    module: "Sanctions Screening",
    progress: 100,
    status: "failed",
    attempts: 2,
    latestScore: 62,
    attempts_detail: [
      { attemptNumber: 1, date: "2024-02-01", score: 45, status: "failed", timeSpent: "7 mins" },
      { attemptNumber: 2, date: "2024-02-04", score: 62, status: "failed", timeSpent: "9 mins" },
    ],
  },
];

const statusCfg = {
  passed: {
    dot: "bg-[hsl(142_71%_45%)]",
    bg: "bg-[hsl(142_71%_45%)]/10",
    text: "text-[hsl(142_71%_45%)]",
    label: "Passed",
  },
  "in-progress": {
    dot: "bg-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    label: "In Progress",
  },
  "not-started": {
    dot: "bg-muted-foreground",
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Not Started",
  },
  failed: {
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    text: "text-destructive",
    label: "Failed",
  },
};

export default function ReportsPage() {
  const [expandedRows, setExpandedRows] = useState([]);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const allModules = Array.from(new Set(mockProgressData.map((p) => p.module)));

  const filteredData = mockProgressData.filter((item) => {
    const matchesModule = moduleFilter === "all" || item.module === moduleFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesModule && matchesStatus;
  });

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const passedCount = filteredData.filter((p) => p.status === "passed").length;
  const failedCount = filteredData.filter((p) => p.status === "failed").length;
  const inProgressCount = filteredData.filter((p) => p.status === "in-progress").length;
  const notStartedCount = filteredData.filter((p) => p.status === "not-started").length;
  const avgScore =
    filteredData.reduce((sum, p) => sum + p.latestScore, 0) / Math.max(filteredData.length, 1);
  const passRate = filteredData.length > 0 ? (passedCount / filteredData.length) * 100 : 0;

  return (
    // <MainLayout>
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Analytics</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track learner progress and training performance metrics.
          </p>
        </div>
        <Button className="gap-2 shadow-md shadow-primary/20 w-full sm:w-auto">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Learners",
            value: filteredData.length,
            icon: Users,
            color: "text-primary bg-primary/10",
            change: null,
          },
          {
            label: "Passed",
            value: passedCount,
            icon: CheckCircle2,
            color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10",
            change: "+12%",
          },
          {
            label: "In Progress",
            value: inProgressCount,
            icon: Activity,
            color: "text-primary bg-primary/10",
            change: null,
          },
          {
            label: "Failed",
            value: failedCount,
            icon: XCircle,
            color: "text-destructive bg-destructive/10",
            change: "-3%",
          },
          {
            label: "Avg Score",
            value: `${Math.round(avgScore)}%`,
            icon: TrendingUp,
            color: "text-accent bg-accent/10",
            change: "+5%",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 overflow-hidden">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                {stat.change && (
                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${stat.change.startsWith("+") ? "text-[hsl(142_71%_45%)]" : "text-destructive"}`}
                  >
                    {stat.change.startsWith("+") ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Pass Rate Bar */}
      <Card className="border-border/60">
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[hsl(142_71%_45%)]" />
              <span className="font-semibold text-foreground">Overall Pass Rate</span>
            </div>
            <span className="text-2xl font-bold text-foreground">{Math.round(passRate)}%</span>
          </div>
          <Progress value={passRate} className="h-3" />
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
            {[
              { color: "bg-[hsl(142_71%_45%)]", label: `Passed (${passedCount})` },
              { color: "bg-destructive", label: `Failed (${failedCount})` },
              { color: "bg-primary", label: `In Progress (${inProgressCount})` },
              { color: "bg-muted-foreground", label: `Not Started (${notStartedCount})` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {allModules.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground sm:ml-auto text-center sm:text-right">
          Showing {filteredData.length} records
        </p>
      </div>

      {/* Progress Table */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Learner Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[40px] font-semibold" />
                  <TableHead className="font-semibold">Learner</TableHead>
                  <TableHead className="font-semibold">Module</TableHead>
                  <TableHead className="font-semibold">Progress</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Attempts</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="font-semibold">Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((user, index) => {
                  const isExpanded = expandedRows.includes(user.id);
                  const cfg = statusCfg[user.status];
                  return (
                    <Collapsible
                      key={user.id}
                      asChild
                      open={isExpanded}
                      onOpenChange={() => toggleRow(user.id)}
                    >
                      <>
                        <TableRow className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 w-8 h-8"
                                disabled={!user.attempts_detail?.length}
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                />
                              </Button>
                            </CollapsibleTrigger>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">{user.module}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={user.progress} className="w-16 h-1.5" />
                              <span className="text-xs text-muted-foreground">
                                {user.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${cfg.bg} ${cfg.text} border-0 text-xs`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5`} />
                              {cfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">{user.attempts}</TableCell>
                          <TableCell>
                            <span
                              className={`text-sm font-semibold ${user.latestScore >= 70 ? "text-[hsl(142_71%_45%)]" : user.latestScore > 0 ? "text-destructive" : "text-muted-foreground"}`}
                            >
                              {user.latestScore > 0 ? `${user.latestScore}%` : "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                              {user.completionDate ? (
                                <>
                                  <Clock className="w-3 h-3" />
                                  {user.completionDate}
                                </>
                              ) : (
                                "-"
                              )}
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow className={isExpanded ? "" : "hidden"}>
                          <TableCell colSpan={8} className="bg-muted/20 p-0">
                            <CollapsibleContent>
                              {user.attempts_detail && user.attempts_detail.length > 0 ? (
                                <div className="px-6 py-4">
                                  <p className="text-sm font-semibold text-foreground mb-3">
                                    Attempt History
                                  </p>
                                  <div className="space-y-2">
                                    {user.attempts_detail.map((attempt) => {
                                      const aCfg = statusCfg[attempt.status];
                                      return (
                                        <div
                                          key={attempt.attemptNumber}
                                          className="flex items-center justify-between p-3 bg-card border border-border/60 rounded-xl"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-xs font-bold text-foreground">
                                              #{attempt.attemptNumber}
                                            </div>
                                            <div>
                                              <p className="text-sm text-foreground">
                                                {attempt.date}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                {attempt.timeSpent}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span
                                              className={`text-sm font-bold ${attempt.score >= 70 ? "text-[hsl(142_71%_45%)]" : "text-destructive"}`}
                                            >
                                              {attempt.score}%
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className={`${aCfg.bg} ${aCfg.text} border-0 text-xs`}
                                            >
                                              {aCfg.label}
                                            </Badge>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="px-6 py-4 text-sm text-muted-foreground">
                                  No attempt records available
                                </div>
                              )}
                            </CollapsibleContent>
                          </TableCell>
                        </TableRow>
                      </>
                    </Collapsible>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    // </MainLayout>
  );
}
