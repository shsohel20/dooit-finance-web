"use client";

import { useRouter } from "next/navigation";
import { useModules } from "@/contexts/module-context";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  CheckCircle,
  Play,
  RotateCcw,
  TrendingUp,
  BookOpen,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getMyAssignments } from "../../actions";

export default function LearnerDashboardPage() {
  const router = useRouter();
  const user = { id: "1", role: "learner", name: "John Doe" };
  const { getModuleAssignments, getModuleById, getLearnerProgress, retakeModule } = useModules();
  const [assignments, setAssignments] = useState([]);
  console.log("assignments", assignments);
  const fetchAssignments = useCallback(async () => {
    const res = await getMyAssignments();
    setAssignments(res?.data || []);
  }, []);
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);
  // const assignments = getModuleAssignments(user?.id || "");
  const assignedModules = assignments;

  const getModuleStatus = (moduleId) => {
    const progress = getLearnerProgress(user?.id || "", moduleId);
    if (!progress) return "not-started";
    if (progress.isPassed) return "passed";
    if (progress.completedAt) return "completed";
    if (progress.attempts.length > 0) return "in-progress";
    return "not-started";
  };

  const getProgressPercentage = (moduleId) => {
    const progress = getLearnerProgress(user?.id || "", moduleId);
    if (!progress) return 0;
    const moduleData = getModuleById(moduleId);
    if (!moduleData) return 0;
    const totalQuestions = moduleData.parts.reduce((acc, p) => acc + p.questions.length, 0);
    if (totalQuestions === 0) return 0;
    const correctAnswers = progress.attempts.filter((a) => a.isCorrect).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleStartModule = (moduleId) => {
    console.log("moduleId", moduleId);
    router.push(`/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}`);
  };

  const handleRetakeModule = (moduleId) => {
    if (user) {
      retakeModule(user.id, moduleId);
      handleStartModule(moduleId);
    }
  };

  const passedCount = assignedModules.filter((m) => m && getModuleStatus(m.id) === "passed").length;
  const inProgressCount = assignedModules.filter(
    (m) => m && getModuleStatus(m.id) === "in-progress",
  ).length;
  // const notStartedCount = assignedModules.filter(
  //   (m) => m && getModuleStatus(m.id) === "not-started",
  // ).length;
  const notStartedCount = assignedModules.filter(
    (m) => m && getModuleStatus(m.id) === "not-started",
  ).length;
  const avgProgress =
    assignedModules.length > 0
      ? Math.round(
          assignedModules.reduce((sum, m) => sum + (getProgressPercentage(m?.id || "") || 0), 0) /
            assignedModules.length,
        )
      : 0;

  if (assignedModules.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <Card className="border-dashed border-2 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 text-balance text-center">
              No Assignments Yet
            </h2>
            <p className="text-muted-foreground text-center max-w-md leading-relaxed">
              Your manager will assign training modules to you. Check back soon for new learning
              opportunities!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">Continue your compliance training journey</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-0 gap-1.5 px-3 py-1.5 w-fit">
          <GraduationCap className="w-4 h-4" />
          Learner
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-1 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-1 bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)]" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(142,71%,45%)]/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-[hsl(142,71%,45%)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-foreground">{passedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-1 bg-gradient-to-r from-[hsl(38,92%,50%)] to-[hsl(38,92%,50%)]/60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(38,92%,50%)]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[hsl(38,92%,50%)]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-1 bg-gradient-to-r from-muted-foreground to-muted-foreground/60" />
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Not Started</p>
                <p className="text-2xl font-bold text-foreground">{notStartedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Sections */}
      <div className="space-y-6">
        {/* Not Started */}
        {notStartedCount > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Ready to Start</h2>
              <Badge variant="secondary" className="text-xs">
                {notStartedCount}
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignedModules
                .filter((m) => m && getModuleStatus(m.id) === "not-started")
                .map((module) => (
                  <Card
                    key={module?.id}
                    className="group overflow-hidden border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="h-1 bg-gradient-to-r from-primary/30 to-accent/30 group-hover:from-primary group-hover:to-accent transition-all duration-300" />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-snug">{module?.title}</CardTitle>
                          <CardDescription className="mt-1.5 line-clamp-2">
                            {module?.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0 text-xs">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> {module?.parts.length} parts
                        </span>
                        <span className="text-border">|</span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />{" "}
                          {module?.parts.reduce((sum, p) => sum + p.questions.length, 0)} questions
                        </span>
                      </div>
                      <Button
                        onClick={() => handleStartModule(module?.module?._id || "")}
                        className="w-full gap-2 group-hover:shadow-md transition-shadow"
                      >
                        <Play className="w-4 h-4" />
                        Start Training
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgressCount > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(38,92%,50%)]/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[hsl(38,92%,50%)]" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
              <Badge className="bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,50%)] border-0 text-xs">
                {inProgressCount}
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignedModules
                .filter((m) => m && getModuleStatus(m.module?._id) === "in-progress")
                .map((module) => {
                  const percentage = getProgressPercentage(module?.id || "");
                  return (
                    <Card
                      key={module?._id}
                      className="group overflow-hidden border-[hsl(38,92%,50%)]/15 hover:shadow-lg hover:border-[hsl(38,92%,50%)]/30 transition-all duration-300"
                    >
                      <div className="h-1 bg-gradient-to-r from-[hsl(38,92%,50%)] to-[hsl(38,92%,50%)]/60" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-snug">
                              {module?.module?.title}
                            </CardTitle>
                            <CardDescription className="mt-1.5 line-clamp-2">
                              {module?.module?.description}
                            </CardDescription>
                          </div>
                          <Badge className="bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,50%)] border-0 flex-shrink-0">
                            {percentage}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          <Progress value={percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">{percentage}% complete</p>
                        </div>
                        <Button
                          onClick={() => handleStartModule(module?.module?._id || "")}
                          variant="outline"
                          className="w-full gap-2 bg-transparent group-hover:bg-[hsl(38,92%,50%)]/5 group-hover:border-[hsl(38,92%,50%)]/30 transition-all"
                        >
                          <Play className="w-4 h-4" />
                          Continue
                          <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* Passed */}
        {passedCount > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(142,71%,45%)]/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[hsl(142,71%,45%)]" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Completed</h2>
              <Badge className="bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] border-0 text-xs">
                {passedCount}
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignedModules
                .filter((m) => m && getModuleStatus(m.id) === "passed")
                .map((module) => {
                  const percentage = getProgressPercentage(module?.id || "");
                  return (
                    <Card
                      key={module?.id}
                      className="group overflow-hidden border-[hsl(142,71%,45%)]/15 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="h-1 bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)]" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-snug">{module?.title}</CardTitle>
                            <CardDescription className="mt-1.5 line-clamp-2">
                              {module?.description}
                            </CardDescription>
                          </div>
                          <Badge className="bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] border-0 gap-1.5 flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Passed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-muted-foreground">
                            Score:{" "}
                            <span className="font-semibold text-[hsl(142,71%,45%)]">
                              {percentage}%
                            </span>
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2 bg-transparent">
                              <RotateCcw className="w-4 h-4" />
                              Retake Module
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Retake Module?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Your progress will be reset. Your previous score will be replaced
                                with the new attempt.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRetakeModule(module?.id || "")}
                              >
                                Retake
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
