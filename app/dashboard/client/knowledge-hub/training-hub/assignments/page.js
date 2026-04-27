"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  RotateCcw,
  Search,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Send,
  XCircle,
  Clock,
  Filter,
  Eye,
  ArrowLeft,
  Award,
  Target,
  FileText,
  Loader2,
} from "lucide-react";
import {
  getAssignmentsForManager,
  getModules,
  assignAssignment,
  grantRetake,
} from "../actions";
import { getAllUsers } from "@/app/dashboard/client/user-and-role-management/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManagerAssignmentsPage() {
  // ── Data state ──────────────────────────────────────────────────────────
  const [assignments, setAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Assign form state ────────────────────────────────────────────────────
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [maxAttempts, setMaxAttempts] = useState("3");
  const [learnerSearch, setLearnerSearch] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // ── Search & filter ──────────────────────────────────────────────────────
  const [listSearch, setListSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Detail view ──────────────────────────────────────────────────────────
  const [selectedModuleGroupId, setSelectedModuleGroupId] = useState(null);

  // ── Retake state ─────────────────────────────────────────────────────────
  const [retakeConfirm, setRetakeConfirm] = useState(null);
  const [isRetaking, setIsRetaking] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [aRes, mRes, uRes] = await Promise.all([
      getAssignmentsForManager(),
      getModules(),
      getAllUsers(),
    ]);
    setAssignments(aRes?.data || []);
    setModules(mRes?.data || []);
    setUsers(uRes?.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Group assignments by module ──────────────────────────────────────────
  const moduleGroups = assignments.reduce((acc, a) => {
    const moduleId = a.module?._id;
    if (!moduleId) return acc;
    if (!acc[moduleId]) {
      acc[moduleId] = {
        moduleId,
        module: a.module,
        dueDate: a.dueDate,
        maxAttempts: a.maxAttempts,
        createdAt: a.createdAt,
        assignments: [],
      };
    }
    acc[moduleId].assignments.push(a);
    return acc;
  }, {});

  // Enrich each group with per-learner data + aggregate stats
  const enrichedGroups = Object.values(moduleGroups).map((group) => {
    const learnerData = group.assignments.map((a) => {
      const learner = a.learner || {};
      const isPassed = a.isPassed ?? false;
      const isCompleted = !!a.completedAt;
      const hasAttempts = a.status !== "pending" && a.status !== undefined;
      return {
        assignmentId: a._id,
        learnerId: learner._id,
        name: learner.name || "Unknown",
        email: learner.email || "",
        department: learner.department || learner.role || "",
        score: a.finalScore ?? 0,
        isPassed,
        isCompleted,
        hasAttempts,
        attemptCount: (a.retakesGranted ?? 0) + (isCompleted ? 1 : 0),
        status: a.status,
      };
    });

    const passedCount = learnerData.filter((l) => l.isPassed).length;
    const failedCount = learnerData.filter((l) => l.isCompleted && !l.isPassed).length;
    const inProgressCount = learnerData.filter((l) => l.hasAttempts && !l.isCompleted).length;
    const notStartedCount = learnerData.filter((l) => !l.hasAttempts && !l.isCompleted).length;

    let overallStatus = "pending";
    if (passedCount === learnerData.length && learnerData.length > 0) overallStatus = "completed";
    else if (failedCount > 0) overallStatus = "attention";
    else if (inProgressCount > 0 || passedCount > 0) overallStatus = "in-progress";

    return {
      ...group,
      moduleTitle: group.module?.title || "Unknown Module",
      moduleParts: group.module?.parts?.length ?? 0,
      moduleQuestions:
        group.module?.parts?.reduce((acc, p) => acc + (p.questions?.length ?? 0), 0) ?? 0,
      learnerData,
      passedCount,
      failedCount,
      inProgressCount,
      notStartedCount,
      overallStatus,
      completionRate:
        learnerData.length > 0 ? Math.round((passedCount / learnerData.length) * 100) : 0,
    };
  });

  const publishedModules = modules.filter((m) => m.status === "published");

  const filteredLearners = users.filter(
    (l) =>
      l.name?.toLowerCase().includes(learnerSearch.toLowerCase()) ||
      l.email?.toLowerCase().includes(learnerSearch.toLowerCase()),
  );

  const toggleLearner = (learnerId) => {
    setSelectedLearners((prev) =>
      prev.includes(learnerId) ? prev.filter((id) => id !== learnerId) : [...prev, learnerId],
    );
  };

  const handleAssign = async () => {
    if (!selectedModuleId || selectedLearners.length === 0) return;
    setIsAssigning(true);
    try {
      const res = await assignAssignment(
        {
          learnerIds: selectedLearners,
          dueDate: dueDate || undefined,
          maxAttempts: maxAttempts === "unlimited" ? 0 : parseInt(maxAttempts),
        },
        selectedModuleId,
      );
      if (res.success) {
        toast.success(
          `Assigned to ${res.inserted} learner(s).${res.roleBlocked > 0 ? ` ${res.roleBlocked} blocked by role rules.` : ""}`,
        );
        setAssignDialogOpen(false);
        setSelectedModuleId("");
        setSelectedLearners([]);
        setDueDate("");
        setMaxAttempts("3");
        fetchAll();
      } else {
        toast.error(res.message || "Assignment failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRetake = async () => {
    if (!retakeConfirm) return;
    setIsRetaking(true);
    const res = await grantRetake(retakeConfirm.moduleId, { learnerId: retakeConfirm.learnerId });
    setIsRetaking(false);
    setRetakeConfirm(null);
    if (res.success) {
      toast.success("Retake granted");
      fetchAll();
    } else {
      toast.error(res.message || "Failed to grant retake");
    }
  };

  // ── Filter groups ────────────────────────────────────────────────────────
  const filteredGroups = enrichedGroups.filter((a) => {
    const matchSearch =
      a.moduleTitle.toLowerCase().includes(listSearch.toLowerCase()) ||
      a.learnerData.some((l) => l.name.toLowerCase().includes(listSearch.toLowerCase()));
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "attention" && a.failedCount > 0) ||
      (statusFilter === "completed" && a.overallStatus === "completed") ||
      (statusFilter === "in-progress" && a.overallStatus === "in-progress") ||
      (statusFilter === "pending" && a.overallStatus === "pending");
    return matchSearch && matchStatus;
  });

  const detailGroup = selectedModuleGroupId
    ? enrichedGroups.find((g) => g.moduleId === selectedModuleGroupId)
    : null;

  const totalPassed = enrichedGroups.reduce((s, g) => s + g.passedCount, 0);
  const totalNeedRetake = enrichedGroups.reduce((s, g) => s + g.failedCount, 0);

  // ── Detail View ──────────────────────────────────────────────────────────
  if (detailGroup) {
    const isOverdue = detailGroup.dueDate && new Date(detailGroup.dueDate) < new Date();
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground mb-4"
            onClick={() => setSelectedModuleGroupId(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{detailGroup.moduleTitle}</h1>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              {detailGroup.createdAt && (
                <p className="text-muted-foreground text-sm">
                  Assigned{" "}
                  {new Date(detailGroup.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Learners", value: detailGroup.learnerData.length, icon: Users, bg: "bg-primary/10", color: "text-primary" },
            { label: "Passed", value: detailGroup.passedCount, icon: CheckCircle2, bg: "bg-[hsl(142_71%_45%)]/10", color: "text-[hsl(142_71%_45%)]" },
            { label: "Failed", value: detailGroup.failedCount, icon: AlertTriangle, bg: "bg-destructive/10", color: "text-destructive" },
            { label: "Completion", value: `${detailGroup.completionRate}%`, icon: Target, bg: "bg-[hsl(38_92%_50%)]/10", color: "text-[hsl(38_92%_50%)]" },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${s.bg}`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assignment details */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Module</p>
                <p className="text-sm font-semibold text-foreground">{detailGroup.moduleTitle}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Parts / Questions</p>
                <p className="text-sm font-semibold text-foreground">
                  {detailGroup.moduleParts} parts, {detailGroup.moduleQuestions} questions
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {detailGroup.dueDate
                    ? new Date(detailGroup.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "No deadline"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Max Attempts</p>
                <p className="text-sm font-semibold text-foreground">
                  {detailGroup.maxAttempts === 0 ? "Unlimited" : detailGroup.maxAttempts || "Unlimited"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learner table */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Learner Progress</CardTitle>
            <CardDescription>Individual learner status for this assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailGroup.learnerData.map((learner) => {
                    const statusConfig = learner.isPassed
                      ? { label: "Passed", dotClass: "bg-[hsl(142_71%_45%)]", badgeClass: "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%)]/20" }
                      : learner.isCompleted
                        ? { label: "Failed", dotClass: "bg-destructive", badgeClass: "bg-destructive/10 text-destructive border-destructive/20" }
                        : learner.hasAttempts
                          ? { label: "In Progress", dotClass: "bg-primary", badgeClass: "bg-primary/10 text-primary border-primary/20" }
                          : { label: "Not Started", dotClass: "bg-muted-foreground", badgeClass: "bg-muted text-muted-foreground border-border" };

                    return (
                      <TableRow key={learner.learnerId} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {learner.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{learner.name}</p>
                              <p className="text-xs text-muted-foreground">{learner.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Progress value={learner.score} className="w-20 h-2" />
                            <span className="text-sm font-semibold text-foreground tabular-nums w-10">
                              {learner.score > 0 ? `${Math.round(learner.score)}%` : "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig.badgeClass}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass} mr-1.5`} />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-sm tabular-nums">{learner.attemptCount || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {learner.isCompleted && !learner.isPassed ? (
                            <Button
                              size="sm"
                              className="gap-1.5 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-white font-medium"
                              onClick={() =>
                                setRetakeConfirm({
                                  learnerId: learner.learnerId,
                                  moduleId: detailGroup.moduleId,
                                  learnerName: learner.name,
                                })
                              }
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Retake
                            </Button>
                          ) : learner.isPassed ? (
                            <div className="flex items-center gap-1.5 justify-end text-[hsl(142_71%_45%)]">
                              <Award className="w-4 h-4" />
                              <span className="text-xs font-semibold">Cleared</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">--</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Retake dialog */}
        <Dialog open={!!retakeConfirm} onOpenChange={(open) => !open && !isRetaking && setRetakeConfirm(null)}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[hsl(38_92%_50%)]" />
                Confirm Retake
              </DialogTitle>
              <DialogDescription>
                This resets the learner&apos;s progress and allows them to retake from the beginning.
              </DialogDescription>
            </DialogHeader>
            {retakeConfirm && (
              <div className="space-y-4">
                <Card className="border-[hsl(38_92%_50%)]/20 bg-[hsl(38_92%_50%)]/5">
                  <CardContent className="pt-4 pb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Learner</span>
                      <span className="font-medium text-foreground">{retakeConfirm.learnerName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Module</span>
                      <span className="font-medium text-foreground">{detailGroup.moduleTitle}</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setRetakeConfirm(null)} disabled={isRetaking}>Cancel</Button>
                  <Button
                    className="gap-2 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-white"
                    onClick={handleRetake}
                    disabled={isRetaking}
                  >
                    {isRetaking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Confirm Retake
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Assign training modules, track progress, and manage retakes
          </p>
        </div>
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-semibold w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Assign Module to Learners</DialogTitle>
              <DialogDescription>
                Select a module, choose learners, and set the assignment details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-2">
              {/* Module Selection */}
              <div className="space-y-2">
                <Label className="font-semibold">Training Module</Label>
                <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a module..." />
                  </SelectTrigger>
                  <SelectContent>
                    {publishedModules.map((module) => (
                      <SelectItem key={module._id} value={module._id}>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          {module.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Learner Selection */}
              <div className="space-y-2">
                <Label className="font-semibold">Select Learners</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search learners..."
                    value={learnerSearch}
                    onChange={(e) => setLearnerSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {selectedLearners.length > 0 && (
                  <div className="flex flex-wrap gap-2 py-2">
                    {selectedLearners.map((id) => {
                      const learner = users.find((l) => l._id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
                          onClick={() => toggleLearner(id)}
                        >
                          {learner?.name}
                          <XCircle className="w-3.5 h-3.5 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                )}
                <div className="border border-border rounded-xl overflow-hidden max-h-[240px] overflow-y-auto">
                  {filteredLearners.map((learner) => (
                    <label
                      key={learner._id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0 transition-colors"
                    >
                      <Checkbox
                        checked={selectedLearners.includes(learner._id)}
                        onCheckedChange={() => toggleLearner(learner._id)}
                      />
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {learner.name?.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{learner.name}</p>
                        <p className="text-xs text-muted-foreground">{learner.email}</p>
                      </div>
                      {learner.role && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {learner.role}
                        </Badge>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Due Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Max Attempts</Label>
                  <Select value={maxAttempts} onValueChange={setMaxAttempts}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Attempt</SelectItem>
                      <SelectItem value="2">2 Attempts</SelectItem>
                      <SelectItem value="3">3 Attempts</SelectItem>
                      <SelectItem value="5">5 Attempts</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedModuleId || selectedLearners.length === 0 || isAssigning}
                  className="gap-2 font-semibold"
                >
                  {isAssigning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isAssigning ? "Assigning..." : "Assign Module"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Modules", value: enrichedGroups.length, icon: BookOpen, bg: "bg-primary/10", color: "text-primary" },
            { label: "Assignments", value: assignments.length, icon: CheckCircle2, bg: "bg-accent/10", color: "text-accent" },
            { label: "Passed", value: totalPassed, icon: Users, bg: "bg-[hsl(142_71%_45%)]/10", color: "text-[hsl(142_71%_45%)]" },
            { label: "Need Retake", value: totalNeedRetake, icon: AlertTriangle, bg: "bg-destructive/10", color: "text-destructive" },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by module or learner..."
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[170px]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Filter status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attention">Needs Retake</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="pending">Not Started</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const isOverdue = group.dueDate && new Date(group.dueDate) < new Date();
            const statusConfig = {
              completed: { label: "All Passed", className: "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%)]/20", dotClass: "bg-[hsl(142_71%_45%)]" },
              attention: { label: `${group.failedCount} Failed`, className: "bg-destructive/10 text-destructive border-destructive/20", dotClass: "bg-destructive" },
              "in-progress": { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20", dotClass: "bg-primary" },
              pending: { label: "Not Started", className: "bg-muted text-muted-foreground border-border", dotClass: "bg-muted-foreground" },
            };
            const config = statusConfig[group.overallStatus] || statusConfig.pending;

            return (
              <Card key={group.moduleId} className="border-border hover:border-primary/20 transition-all duration-200 group">
                <CardContent className="pt-5 pb-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground truncate">{group.moduleTitle}</h3>
                          <Badge variant="outline" className={config.className}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} mr-1.5`} />
                            {config.label}
                          </Badge>
                          {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {group.learnerData.length} learner{group.learnerData.length !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {group.dueDate
                              ? new Date(group.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                              : "No deadline"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {group.maxAttempts === 0 ? "Unlimited" : group.maxAttempts || "Unlimited"} attempts
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <Progress value={group.completionRate} className="flex-1 h-2" />
                          <span className="text-xs font-semibold text-foreground tabular-nums">
                            {group.completionRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-shrink-0">
                      {group.failedCount > 0 && (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-white font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            const failedLearner = group.learnerData.find((l) => l.isCompleted && !l.isPassed);
                            if (failedLearner) {
                              setRetakeConfirm({
                                learnerId: failedLearner.learnerId,
                                moduleId: group.moduleId,
                                learnerName: failedLearner.name,
                              });
                            }
                          }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Retake
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 bg-transparent"
                        onClick={() => setSelectedModuleGroupId(group.moduleId)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Learner mini avatars */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground mr-1">Learners:</span>
                    <div className="flex items-center -space-x-2">
                      {group.learnerData.slice(0, 5).map((learner) => {
                        const ringColor = learner.isPassed
                          ? "ring-[hsl(142_71%_45%)]"
                          : learner.isCompleted && !learner.isPassed
                            ? "ring-destructive"
                            : learner.hasAttempts
                              ? "ring-primary"
                              : "ring-border";
                        return (
                          <div
                            key={learner.learnerId}
                            className={`w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center ring-2 ${ringColor} bg-card`}
                            title={`${learner.name} - ${learner.isPassed ? "Passed" : learner.isCompleted ? "Failed" : learner.hasAttempts ? "In Progress" : "Not Started"}${learner.score > 0 ? ` (${Math.round(learner.score)}%)` : ""}`}
                          >
                            <span className="text-[10px] font-bold text-primary">
                              {learner.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                        );
                      })}
                      {group.learnerData.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            +{group.learnerData.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                    {group.failedCount > 0 && (
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-destructive">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {group.failedCount} need{group.failedCount === 1 ? "s" : ""} retake
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {assignments.length === 0 ? "No Assignments Yet" : "No Matching Assignments"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              {assignments.length === 0
                ? "Start by assigning a training module to your learners."
                : "Try adjusting your search or filter criteria."}
            </p>
            {assignments.length === 0 && (
              <Button className="gap-2" onClick={() => setAssignDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Create First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Retake dialog (list view) */}
      <Dialog open={!!retakeConfirm} onOpenChange={(open) => !open && !isRetaking && setRetakeConfirm(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[hsl(38_92%_50%)]" />
              Confirm Retake
            </DialogTitle>
            <DialogDescription>
              This resets the learner&apos;s progress and allows them to retake from the beginning.
            </DialogDescription>
          </DialogHeader>
          {retakeConfirm && (
            <div className="space-y-4">
              <Card className="border-[hsl(38_92%_50%)]/20 bg-[hsl(38_92%_50%)]/5">
                <CardContent className="pt-4 pb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Learner</span>
                    <span className="font-medium text-foreground">{retakeConfirm.learnerName}</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setRetakeConfirm(null)} disabled={isRetaking}>Cancel</Button>
                <Button
                  className="gap-2 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-white"
                  onClick={handleRetake}
                  disabled={isRetaking}
                >
                  {isRetaking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  Confirm Retake
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
