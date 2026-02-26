"use client";

import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/auth-context";
import { useModules } from "@/contexts/module-context";
// import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Clock,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

const mockLearners = [
  { id: "3", name: "Learner User", email: "learner@example.com", department: "Operations" },
  { id: "learner1", name: "Emily Johnson", email: "emily@company.com", department: "Compliance" },
  { id: "learner2", name: "Michael Chen", email: "michael@company.com", department: "Operations" },
  { id: "learner3", name: "Sarah Williams", email: "sarah@company.com", department: "Compliance" },
  { id: "learner4", name: "David Brown", email: "david@company.com", department: "Legal" },
];

export default function ManagerDashboardPage() {
  const router = useRouter();
  // const { user } = useAuth();
  const { modules, assignments, progress } = useModules();

  // if (!user || user.role !== "manager") return null;

  const publishedModules = modules.filter((m) => m.status === "published");
  const totalAssignments = assignments.length;
  const totalLearners = mockLearners.length;

  // Calculate stats from progress
  const passedCount = progress.filter((p) => p.isPassed).length;
  const failedCount = progress.filter((p) => p.completedAt && !p.isPassed).length;
  const inProgressCount = progress.filter((p) => !p.completedAt && p.attempts.length > 0).length;
  const avgScore =
    progress.length > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
      : 0;

  // Recent activity from progress
  const recentProgress = [...progress]
    .sort((a, b) => {
      const aDate = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const bDate = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 5);

  // Learners who failed and need retake
  const failedLearners = progress.filter((p) => p.completedAt && !p.isPassed);

  return (
    // <MainLayout>
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent p-5 sm:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 border border-primary-foreground/30 rounded-full" />
          <div className="absolute -bottom-16 -left-8 w-48 h-48 border border-primary-foreground/20 rounded-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs font-semibold">
              Manager
            </Badge>
          </div>
          {/* <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2 text-balance">
            Welcome back, {user.name}
          </h1> */}
          <p className="text-primary-foreground/80 text-base max-w-lg">
            Manage your team&apos;s training assignments and track their progress. Assign modules or
            request retakes below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold gap-2"
              onClick={() => router.push("/manager/assignments")}
            >
              <ClipboardList className="w-5 h-5" />
              Assign Modules
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold gap-2 bg-transparent"
              onClick={() => router.push("/manager/assignments?tab=retake")}
            >
              <RotateCcw className="w-5 h-5" />
              Manage Retakes
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Published Modules</p>
                <p className="text-3xl font-bold text-foreground">{publishedModules.length}</p>
                <p className="text-xs text-muted-foreground mt-2">Available for assignment</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border group hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Assignments</p>
                <p className="text-3xl font-bold text-foreground">{totalAssignments}</p>
                <p className="text-xs text-muted-foreground mt-2">Across all modules</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border group hover:shadow-lg hover:shadow-[hsl(142_71%_45%)]/5 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Learners</p>
                <p className="text-3xl font-bold text-foreground">{totalLearners}</p>
                <p className="text-xs text-[hsl(142_71%_45%)] font-medium mt-2">
                  {passedCount} passed
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] group-hover:bg-[hsl(142_71%_45%)] group-hover:text-[hsl(0_0%_100%)] transition-colors duration-300">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border group hover:shadow-lg hover:shadow-[hsl(38_92%_50%)]/5 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Score</p>
                <p className="text-3xl font-bold text-foreground">{avgScore}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {failedCount > 0 ? `${failedCount} need retake` : "All on track"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)] group-hover:bg-[hsl(38_92%_50%)] group-hover:text-[hsl(0_0%_100%)] transition-colors duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Learner Progress Overview */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Learner Progress</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-primary"
                onClick={() => router.push("/manager/assignments")}
              >
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockLearners.slice(0, 4).map((learner) => {
                const learnerProgress = progress.find((p) => p.learnerId === learner.id);
                const score = learnerProgress?.score || 0;
                const status = learnerProgress?.isPassed
                  ? "passed"
                  : learnerProgress?.completedAt
                    ? "failed"
                    : learnerProgress?.attempts.length
                      ? "in-progress"
                      : "not-started";

                const statusConfig = {
                  passed: {
                    label: "Passed",
                    className:
                      "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%)]/20",
                  },
                  failed: {
                    label: "Failed",
                    className: "bg-destructive/10 text-destructive border-destructive/20",
                  },
                  "in-progress": {
                    label: "In Progress",
                    className: "bg-primary/10 text-primary border-primary/20",
                  },
                  "not-started": {
                    label: "Not Started",
                    className: "bg-muted text-muted-foreground border-border",
                  },
                };

                const config = statusConfig[status];

                return (
                  <div
                    key={learner.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {learner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {learner.name}
                        </p>
                        <Badge variant="outline" className={`text-xs ${config.className}`}>
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={score} className="flex-1 h-2" />
                        <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                          {Math.round(score)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {mockLearners.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-sm">No learners assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() =>
                  router.push("/dashboard/client/knowledge-hub/training-hub/assignments")
                }
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-left group"
              >
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">Assign Module</p>
                  <p className="text-xs text-muted-foreground">Assign training to learners</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <button
                onClick={() =>
                  router.push("/dashboard/client/knowledge-hub/training-hub/assignments?tab=retake")
                }
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-[hsl(38_92%_50%)]/30 hover:bg-[hsl(38_92%_50%)]/5 transition-all duration-200 text-left group"
              >
                <div className="p-2.5 rounded-lg bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)] group-hover:bg-[hsl(38_92%_50%)] group-hover:text-[hsl(0_0%_100%)] transition-colors duration-200">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">Request Retake</p>
                  <p className="text-xs text-muted-foreground">Reset exams for failed learners</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(38_92%_50%)] transition-colors" />
              </button>

              <button
                onClick={() => router.push("/dashboard/client/knowledge-hub/training-hub/reports")}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 text-left group"
              >
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">View Reports</p>
                  <p className="text-xs text-muted-foreground">Track progress and scores</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </button>
            </CardContent>
          </Card>

          {/* Needs Attention */}
          {failedLearners.length > 0 && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-foreground">Needs Attention</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {failedLearners.slice(0, 3).map((fp) => {
                  const learner = mockLearners.find((l) => l.id === fp.learnerId);
                  const mod = modules.find((m) => m.id === fp.moduleId);
                  return (
                    <div
                      key={`${fp.learnerId}-${fp.moduleId}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-destructive">
                          {learner?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {learner?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Failed: {mod?.title || "Unknown module"} ({Math.round(fp.score)}%)
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                  onClick={() => router.push("/manager/assignments?tab=retake")}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Manage Retakes
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Assignments */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Recent Assignments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments
                    .slice(-4)
                    .reverse()
                    .map((assignment) => {
                      const mod = modules.find((m) => m.id === assignment.moduleId);
                      return (
                        <div
                          key={assignment.id}
                          className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {mod?.title || "Unknown Module"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {assignment.assignedTo.length} learner
                              {assignment.assignedTo.length !== 1 ? "s" : ""} -{" "}
                              {new Date(assignment.assignedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ClipboardList className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No assignments yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // </MainLayout>
  );
}
