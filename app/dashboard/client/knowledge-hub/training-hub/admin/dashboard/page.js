"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModules } from "@/contexts/module-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
  BarChart3,
  FileText,
  Activity,
  Table,
  ShieldCheck,
} from "lucide-react";
import { getModules } from "../../actions";

const mockActivities = [
  {
    id: 1,
    user: "John Smith",
    action: "Completed",
    module: "KYC Fundamentals",
    date: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Started",
    module: "AML Procedures",
    date: "3 hours ago",
    status: "in-progress",
  },
  {
    id: 3,
    user: "Michael Davis",
    action: "Failed Quiz",
    module: "Sanctions Screening",
    date: "5 hours ago",
    status: "failed",
  },
  {
    id: 4,
    user: "Emily Wilson",
    action: "Assigned",
    module: "Risk Assessment",
    date: "1 day ago",
    status: "assigned",
  },
  {
    id: 5,
    user: "Robert Brown",
    action: "Completed",
    module: "Regulatory Updates",
    date: "1 day ago",
    status: "completed",
  },
];

const statusConfig = {
  completed: {
    dot: "bg-[hsl(142_71%_45%)]",
    bg: "bg-[hsl(142_71%_45%)]/10",
    text: "text-[hsl(142_71%_45%)]",
  },
  "in-progress": { dot: "bg-primary", bg: "bg-primary/10", text: "text-primary" },
  failed: { dot: "bg-destructive", bg: "bg-destructive/10", text: "text-destructive" },
  assigned: {
    dot: "bg-[hsl(38_92%_50%)]",
    bg: "bg-[hsl(38_92%_50%)]/10",
    text: "text-[hsl(38_92%_50%)]",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const user = { role: "admin", name: "John Doe" };
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  // const { modules, assignments } = useModules();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchModules = useCallback(async () => {
    const res = await getModules();
    setModules(res?.data || []);
  }, []);
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);
  // useEffect(() => {
  //   if (user?.role === "manager") {
  //     router.push("/manager/dashboard");
  //   }
  // }, [user, router]);

  if (!user || user.role === "manager") return null;

  const isAdmin = user.role === "admin";
  const hasModules = modules.length > 0;
  const publishedModules = modules.filter((m) => m.status === "published");
  const draftModules = modules.filter((m) => m.status === "draft");
  const totalQuestions = modules.reduce(
    (acc, m) => acc + m.parts.reduce((a, p) => a + p.questions.length, 0),
    0,
  );

  const kpiCards = [
    {
      title: "Total Modules",
      value: modules.length,
      sub: `${publishedModules.length} published`,
      icon: BookOpen,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/15 text-primary",
      change: "+12%",
    },
    {
      title: "Active Assignments",
      value: assignments.length,
      sub: `${assignments.reduce((a, b) => a + b.assignedTo.length, 0)} learners`,
      icon: CheckCircle2,
      gradient: "from-accent/20 to-accent/5",
      iconBg: "bg-accent/15 text-accent",
      change: "+8%",
    },
    {
      title: "Total Questions",
      value: totalQuestions,
      sub: `${modules.reduce((a, m) => a + m.parts.length, 0)} parts`,
      icon: FileText,
      gradient: "from-[hsl(142_71%_45%)]/20 to-[hsl(142_71%_45%)]/5",
      iconBg: "bg-[hsl(142_71%_45%)]/15 text-[hsl(142_71%_45%)]",
      change: "+23%",
    },
    {
      title: "Pass Rate",
      value: "87.5%",
      sub: "Above target",
      icon: TrendingUp,
      gradient: "from-[hsl(38_92%_50%)]/20 to-[hsl(38_92%_50%)]/5",
      iconBg: "bg-[hsl(38_92%_50%)]/15 text-[hsl(38_92%_50%)]",
      change: "+5%",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Seed CTA */}
      {!hasModules && isAdmin && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden relative">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/15">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Get Started with Demo Data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    No modules created yet. Seed the system with sample AML training modules.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/admin/seed")}
                size="lg"
                className="gap-2 shadow-md shadow-primary/20"
              >
                Seed Demo Data
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary mb-1">Admin Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here is your AML training platform overview.
          </p>
        </div>
        {isAdmin && (
          <Button
            className="gap-2 shadow-md shadow-primary/20 w-full sm:w-auto"
            onClick={() =>
              router.push("/dashboard/client/knowledge-hub/training-hub/admin/modules")
            }
          >
            <Table className="w-4 h-4" />
            All Modules
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => (
          <Card
            key={card.title}
            className={`border-border/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[hsl(142_71%_45%)]">{card.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
            <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() =>
                    router.push("/dashboard/client/knowledge-hub/training-hub/reports")
                  }
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {mockActivities.map((activity) => {
                  const cfg = statusConfig[activity.status] || statusConfig.assigned;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center text-sm font-bold text-foreground">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${cfg.dot} ring-2 ring-card`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">
                            {activity.action.toLowerCase()}
                          </span>{" "}
                          <span className="font-medium">{activity.module}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.date}</p>
                      </div>
                      <Badge variant="outline" className={`${cfg.bg} ${cfg.text} border-0 text-xs`}>
                        {activity.status
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Cards */}
        <div className="space-y-6">
          {/* Module Breakdown */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <CardTitle className="text-lg">Module Overview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(142_71%_45%)]" />
                  <span className="text-sm text-muted-foreground">Published</span>
                </div>
                <span className="text-sm font-bold text-foreground">{publishedModules.length}</span>
              </div>
              <Progress
                value={modules.length > 0 ? (publishedModules.length / modules.length) * 100 : 0}
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(38_92%_50%)]" />
                  <span className="text-sm text-muted-foreground">Draft</span>
                </div>
                <span className="text-sm font-bold text-foreground">{draftModules.length}</span>
              </div>
              <Progress
                value={modules.length > 0 ? (draftModules.length / modules.length) * 100 : 0}
                className="h-2 [&>div]:bg-[hsl(38_92%_50%)]"
              />

              <Button
                variant="outline"
                className="w-full mt-2 gap-2 bg-transparent"
                onClick={() =>
                  router.push("/dashboard/client/knowledge-hub/training-hub/admin/modules")
                }
              >
                <BookOpen className="w-4 h-4" />
                Manage Modules
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/client/knowledge-hub/training-hub/admin/modules")
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New Module</p>
                  <p className="text-xs text-muted-foreground">Create training content</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/client/knowledge-hub/training-hub/admin/assignments/manage",
                  )
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Assign Module</p>
                  <p className="text-xs text-muted-foreground">Assign to learners</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/client/knowledge-hub/training-hub/reports")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-[hsl(38_92%_50%)]/10 text-[hsl(38_92%_50%)] group-hover:bg-[hsl(38_92%_50%)]/20 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">View Reports</p>
                  <p className="text-xs text-muted-foreground">Analytics & progress</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/client/knowledge-hub/training-hub/admin/access")
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-[hsl(262_83%_58%)]/10 text-[hsl(262_83%_58%)] group-hover:bg-[hsl(262_83%_58%)]/20 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Module Access</p>
                  <p className="text-xs text-muted-foreground">Manage org scoping</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-destructive/15 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Attention Needed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 learners have failed quizzes and may need retake assignments.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 mt-1 h-auto text-destructive"
                    onClick={() =>
                      router.push(
                        "/dashboard/client/knowledge-hub/training-hub/admin/assignments/manage",
                      )
                    }
                  >
                    Review now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
