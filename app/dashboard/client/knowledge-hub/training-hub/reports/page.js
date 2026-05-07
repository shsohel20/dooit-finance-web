"use client";

import { useCallback, useEffect, useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import { getReportsOverview, getReportsLearners } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";

const statusCfg = {
  passed: {
    dot: "bg-[hsl(142_71%_45%)]",
    bg: "bg-[hsl(142_71%_45%)]/10",
    text: "text-[hsl(142_71%_45%)]",
    label: "Passed",
  },
  "in-progress": { dot: "bg-primary", bg: "bg-primary/10", text: "text-primary", label: "In Progress" },
  "not-started": {
    dot: "bg-muted-foreground",
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Not Started",
  },
  pending: {
    dot: "bg-muted-foreground",
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Not Started",
  },
  failed: { dot: "bg-destructive", bg: "bg-destructive/10", text: "text-destructive", label: "Failed" },
  started: { dot: "bg-primary", bg: "bg-primary/10", text: "text-primary", label: "Started" },
};

// Map a raw progress record from the API to the shape the table expects
function mapRecord(item) {
  const learner = item.learner || {};
  const module = item.module || {};
  const rawStatus = item.status ||
    (item.isPassed ? "passed" : item.completedAt ? "failed" : item.startedAt ? "in-progress" : "not-started");

  return {
    id: item._id,
    name: learner.name || "Unknown",
    email: learner.email || "",
    module: typeof module === "string" ? module : module.title || "—",
    progress: item.score ?? 0,
    status: rawStatus,
    attempts: item.attemptRound ?? 0,
    latestScore: item.score ?? 0,
    completionDate: item.completedAt ? new Date(item.completedAt).toLocaleDateString() : null,
    attempts_detail: [],
  };
}

export default function ReportsPage() {
  const [expandedRows, setExpandedRows] = useState([]);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [overview, setOverview] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [ovRes, lrRes] = await Promise.all([getReportsOverview(), getReportsLearners()]);
    if (ovRes?.success) setOverview(ovRes.data);
    if (lrRes?.success) {
      const raw = Array.isArray(lrRes.data) ? lrRes.data : [];
      setProgressData(raw.map(mapRecord));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const allModules = Array.from(new Set(progressData.map((p) => p.module).filter(Boolean)));

  const filteredData = progressData.filter((item) => {
    const matchesModule = moduleFilter === "all" || item.module === moduleFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesModule && matchesStatus;
  });

  const toggleRow = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const passedCount = filteredData.filter((p) => p.status === "passed").length;
  const failedCount = filteredData.filter((p) => p.status === "failed").length;
  const inProgressCount = filteredData.filter(
    (p) => p.status === "in-progress" || p.status === "started",
  ).length;
  const notStartedCount = filteredData.filter(
    (p) => p.status === "not-started" || p.status === "pending",
  ).length;
  const avgScore =
    filteredData.reduce((sum, p) => sum + (p.latestScore || 0), 0) /
    Math.max(filteredData.length, 1);
  const passRate = filteredData.length > 0 ? (passedCount / filteredData.length) * 100 : 0;

  return (
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
        <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* System-wide KPIs from overview API */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Total Modules", value: overview.totalModules ?? "—", color: "text-primary bg-primary/10" },
            { label: "Published", value: overview.publishedModules ?? "—", color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10" },
            { label: "Assignments", value: overview.totalAssignments ?? "—", color: "text-accent bg-accent/10" },
            { label: "Completion %", value: overview.completionRate != null ? `${Math.round(overview.completionRate)}%` : "—", color: "text-primary bg-primary/10" },
            { label: "Pass Rate", value: overview.passRate != null ? `${Math.round(overview.passRate)}%` : "—", color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10" },
            { label: "Avg Score", value: overview.avgScore != null ? `${Math.round(overview.avgScore)}%` : "—", color: "text-[hsl(38_92%_50%)] bg-[hsl(38_92%_50%)]/10" },
          ].map((s) => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="pt-4 pb-3">
                <div className={`inline-flex p-1.5 rounded-lg ${s.color} mb-2`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : (
        <>
          {/* KPI Cards (filtered data) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Learners", value: filteredData.length, icon: Users, color: "text-primary bg-primary/10", change: null },
              { label: "Passed", value: passedCount, icon: CheckCircle2, color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10", change: null },
              { label: "In Progress", value: inProgressCount, icon: Activity, color: "text-primary bg-primary/10", change: null },
              { label: "Failed", value: failedCount, icon: XCircle, color: "text-destructive bg-destructive/10", change: null },
              { label: "Avg Score", value: `${Math.round(avgScore)}%`, icon: TrendingUp, color: "text-accent bg-accent/10", change: null },
            ].map((stat) => (
              <Card key={stat.label} className="border-border/60 overflow-hidden">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pass Rate Bar */}
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
                  <SelectItem key={m} value={m}>{m}</SelectItem>
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
              {filteredData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No records found. Learners need to be assigned modules and start training.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-[40px] font-semibold" />
                        <TableHead className="font-semibold">Learner</TableHead>
                        <TableHead className="font-semibold">Module</TableHead>
                        <TableHead className="font-semibold">Score</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Attempts</TableHead>
                        <TableHead className="font-semibold">Completed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((user) => {
                        const isExpanded = expandedRows.includes(user.id);
                        const cfg = statusCfg[user.status] || statusCfg["not-started"];
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
                                      {user.name.split(" ").map((n) => n[0]).join("")}
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
                                    <Progress value={user.latestScore} className="w-16 h-1.5" />
                                    <span
                                      className={`text-sm font-semibold ${user.latestScore >= 70 ? "text-[hsl(142_71%_45%)]" : user.latestScore > 0 ? "text-destructive" : "text-muted-foreground"}`}
                                    >
                                      {user.latestScore > 0 ? `${Math.round(user.latestScore)}%` : "-"}
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
                                <TableCell className="text-sm text-foreground">
                                  {user.attempts || "-"}
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    {user.completionDate ? (
                                      <><Clock className="w-3 h-3" />{user.completionDate}</>
                                    ) : "-"}
                                  </span>
                                </TableCell>
                              </TableRow>
                              <TableRow className={isExpanded ? "" : "hidden"}>
                                <TableCell colSpan={7} className="bg-muted/20 p-0">
                                  <CollapsibleContent>
                                    <div className="px-6 py-4 text-sm text-muted-foreground">
                                      Detailed attempt history is available in the assignments detail view.
                                    </div>
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
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
