"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle2,
  BookOpen,
  Clock,
  ArrowLeft,
  Eye,
  FileText,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  getModules,
  assignAssignment,
  getAssignmentsforAdmin,
  getModuleLearners,
  grantRetake,
} from "../../../actions";
import { getAllUsers } from "@/app/dashboard/client/user-and-role-management/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CFG = {
  passed: { bg: "bg-[hsl(142_71%_45%)]/10", text: "text-[hsl(142_71%_45%)]", label: "Passed" },
  completed: { bg: "bg-[hsl(142_71%_45%)]/10", text: "text-[hsl(142_71%_45%)]", label: "Passed" },
  failed: { bg: "bg-destructive/10", text: "text-destructive", label: "Failed" },
  "in-progress": { bg: "bg-primary/10", text: "text-primary", label: "In Progress" },
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Not Started" },
  overdue: { bg: "bg-[hsl(38_92%_50%)]/10", text: "text-[hsl(38_92%_50%)]", label: "Overdue" },
};

export default function ManageAssignmentsPage() {
  const user = { id: "1", role: "admin", name: "John Doe" };
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [dueDate, setDueDate] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [moduleLearners, setModuleLearners] = useState([]);
  const [learnersLoading, setLearnersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [newModuleId, setNewModuleId] = useState("");
  const [newLearnerSearch, setNewLearnerSearch] = useState("");
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [retakeConfirm, setRetakeConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  const fetchUsers = useCallback(async () => {
    const res = await getAllUsers();
    setUsers(res?.data || []);
  }, []);

  const fetchModules = useCallback(async () => {
    const res = await getModules();
    setModules(res?.data || []);
  }, []);

  const fetchAssignments = useCallback(async () => {
    const res = await getAssignmentsforAdmin();
    setAssignments(res?.data || []);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchModules();
    fetchAssignments();
  }, []);

  // Group assignments by module
  const moduleGroups = assignments.reduce((acc, a) => {
    const moduleId = a.module?._id;
    if (!moduleId) return acc;
    if (!acc[moduleId]) {
      acc[moduleId] = { module: a.module, assignments: [], dueDate: a.dueDate };
    }
    acc[moduleId].assignments.push(a);
    return acc;
  }, {});
  const groupedList = Object.values(moduleGroups);

  const filteredGroups = groupedList.filter(({ module }) =>
    module?.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedModule = selectedModuleId
    ? (moduleGroups[selectedModuleId]?.module || modules.find((m) => m._id === selectedModuleId))
    : null;

  const clearForms = () => {
    setNewModuleId("");
    setSelectedLearners([]);
    setDueDate("");
    setMaxAttempts(3);
  };

  const handleAssign = async () => {
    setIsSubmitting(true);
    try {
      const response = await assignAssignment(
        { dueDate, maxAttempts: Number(maxAttempts), learnerIds: selectedLearners },
        newModuleId,
      );
      if (response.success) {
        toast.success(
          `Assigned to ${response.inserted} learner(s). ${response.roleBlocked > 0 ? `${response.roleBlocked} blocked by role rules.` : ""}`,
        );
        clearForms();
        setAssignDialogOpen(false);
        fetchAssignments();
      } else {
        toast.error(response.message || "Assignment failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = async (moduleId) => {
    setSelectedModuleId(moduleId);
    setViewMode("detail");
    setLearnersLoading(true);
    const res = await getModuleLearners(moduleId);
    setModuleLearners(res?.data || []);
    setLearnersLoading(false);
  };

  const handleRetakeConfirm = async () => {
    if (!retakeConfirm) return;
    setIsRetaking(true);
    const res = await grantRetake(retakeConfirm.moduleId, { learnerId: retakeConfirm.learnerId });
    setIsRetaking(false);
    setRetakeConfirm(null);
    if (res.success) {
      toast.success("Retake granted");
      handleViewDetails(retakeConfirm.moduleId);
    } else {
      toast.error(res.message || "Failed to grant retake");
    }
  };

  const toggleLearner = (id) => {
    setSelectedLearners((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  const filteredNewLearners = users.filter(
    (l) =>
      l.name?.toLowerCase().includes(newLearnerSearch.toLowerCase()) ||
      l.email?.toLowerCase().includes(newLearnerSearch.toLowerCase()),
  );

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admins only.</p>
      </div>
    );
  }

  // ── Detail View ──────────────────────────────────────────────────────────
  if (viewMode === "detail" && selectedModule) {
    return (
      <>
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </button>

          {/* Module Header */}
          <Card className="border-border/60 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-[hsl(142_71%_45%)]" />
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedModule.title}</h2>
                  <p className="text-muted-foreground mt-1">{selectedModule.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {moduleLearners.length} learners
                    </span>
                    {selectedModule.parts?.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        {selectedModule.parts.length} parts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          {!learnersLoading && moduleLearners.length > 0 && (() => {
            const passed = moduleLearners.filter((l) => l.isPassed).length;
            const failed = moduleLearners.filter(
              (l) => l.completedAt && !l.isPassed,
            ).length;
            const inProg = moduleLearners.filter(
              (l) => l.startedAt && !l.completedAt,
            ).length;
            const notStarted = moduleLearners.filter((l) => !l.startedAt).length;
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Passed", value: passed, color: "text-[hsl(142_71%_45%)]", bg: "bg-[hsl(142_71%_45%)]/10" },
                  { label: "Failed", value: failed, color: "text-destructive", bg: "bg-destructive/10" },
                  { label: "In Progress", value: inProg, color: "text-primary", bg: "bg-primary/10" },
                  { label: "Not Started", value: notStarted, color: "text-muted-foreground", bg: "bg-muted/50" },
                ].map((s) => (
                  <Card key={s.label} className="border-border/60">
                    <CardContent className="py-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}

          {/* Learners Table */}
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Assigned Learners
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {learnersLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : moduleLearners.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No learners assigned yet.
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">Learner</TableHead>
                        <TableHead className="font-semibold">Score</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Attempts</TableHead>
                        <TableHead className="font-semibold">Completed</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {moduleLearners.map((item) => {
                        const learner = item.learner || item;
                        const score = item.score ?? item.finalScore ?? 0;
                        const statusKey = item.status ||
                          (item.isPassed ? "passed" : item.completedAt ? "failed" : item.startedAt ? "in-progress" : "pending");
                        const cfg = STATUS_CFG[statusKey] || STATUS_CFG.pending;
                        const canRetake = statusKey === "failed";

                        return (
                          <TableRow key={item._id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {learner.name?.split(" ").map((n) => n[0]).join("") || "?"}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground text-sm">{learner.name}</p>
                                  <p className="text-xs text-muted-foreground">{learner.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={score} className="w-16 h-1.5" />
                                <span
                                  className={`text-sm font-semibold ${score >= 70 ? "text-[hsl(142_71%_45%)]" : score > 0 ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                  {score > 0 ? `${Math.round(score)}%` : "-"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${cfg.bg} ${cfg.text} border-0 text-xs`}>
                                {cfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                              {item.attemptRound ?? "-"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.completedAt
                                ? new Date(item.completedAt).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {canRetake && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-[hsl(38_92%_50%)] border-[hsl(38_92%_50%)]/30 hover:bg-[hsl(38_92%_50%)]/10 bg-transparent"
                                  onClick={() =>
                                    setRetakeConfirm({
                                      learnerId: learner._id,
                                      moduleId: selectedModuleId,
                                      learnerName: learner.name,
                                    })
                                  }
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Retake
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Retake Dialog */}
        <Dialog open={!!retakeConfirm} onOpenChange={() => !isRetaking && setRetakeConfirm(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Retake</DialogTitle>
              <DialogDescription>
                Grant <strong>{retakeConfirm?.learnerName}</strong> a retake? This resets their
                progress for a new attempt round.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setRetakeConfirm(null)} disabled={isRetaking}>
                Cancel
              </Button>
              <Button
                className="bg-[hsl(38_92%_50%)] text-white hover:bg-[hsl(38_92%_45%)]"
                onClick={handleRetakeConfirm}
                disabled={isRetaking}
              >
                {isRetaking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                Confirm Retake
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary mb-1">Assignment Center</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Assignments</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Assign modules to learners and track their progress.
            </p>
          </div>
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md shadow-primary/20 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>Select a module and assign it to learners.</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 mt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Module (Published Only)</Label>
                  <Select value={newModuleId} onValueChange={setNewModuleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module..." />
                    </SelectTrigger>
                    <SelectContent>
                      {modules
                        .filter((m) => m.status === "published")
                        .map((m) => (
                          <SelectItem key={m._id} value={m._id}>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                              {m.title}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Learners{" "}
                    {selectedLearners.length > 0 && (
                      <span className="text-primary ml-1">({selectedLearners.length} selected)</span>
                    )}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search learners..."
                      value={newLearnerSearch}
                      onChange={(e) => setNewLearnerSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {selectedLearners.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLearners.map((id) => {
                        const l = users.find((x) => x._id === id);
                        return l ? (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/20 transition-colors"
                            onClick={() => toggleLearner(id)}
                          >
                            {l.name} ×
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="space-y-1 max-h-48 overflow-y-auto border border-border rounded-lg p-1">
                    {filteredNewLearners.map((learner) => {
                      const isSelected = selectedLearners.includes(learner._id);
                      return (
                        <button
                          key={learner._id}
                          type="button"
                          onClick={() => toggleLearner(learner._id)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
                            isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-border"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{learner.name}</p>
                            <p className="text-xs text-muted-foreground">{learner.email}</p>
                          </div>
                          {learner.role && (
                            <Badge variant="outline" className="text-[10px]">
                              {learner.role}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Due Date</Label>
                      <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>Max Attempts (0 = unlimited)</Label>
                      <Input
                        type="number"
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={handleAssign}
                  disabled={!newModuleId || selectedLearners.length === 0 || isSubmitting}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting
                    ? "Assigning..."
                    : `Assign to ${selectedLearners.length} Learner${selectedLearners.length !== 1 ? "s" : ""}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Module Groups",
              value: groupedList.length,
              icon: BookOpen,
              color: "text-primary bg-primary/10",
            },
            {
              label: "Total Assignments",
              value: assignments.length,
              icon: CheckCircle2,
              color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10",
            },
            {
              label: "Learners",
              value: users.length,
              icon: Users,
              color: "text-accent bg-accent/10",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="flex items-center gap-3 py-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by module name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Module Groups List */}
        {filteredGroups.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No assignments yet</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Create your first assignment to get started.
              </p>
              <Button onClick={() => setAssignDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> New Assignment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map(({ module, assignments: groupAssignments }) => {
              const passedCount = groupAssignments.filter((a) => a.isPassed).length;
              const failedCount = groupAssignments.filter(
                (a) => a.completedAt && !a.isPassed,
              ).length;
              const completionRate =
                groupAssignments.length > 0
                  ? Math.round((passedCount / groupAssignments.length) * 100)
                  : 0;

              return (
                <Card
                  key={module._id}
                  className="border-border/60 overflow-hidden hover:shadow-md transition-all group"
                >
                  <CardContent className="py-5">
                    <div className="flex items-center gap-5">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{module.title}</h3>
                          {failedCount > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-destructive/10 text-destructive border-0 text-xs gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {failedCount} failed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {groupAssignments.length} learner{groupAssignments.length !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {passedCount} passed
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-3 shrink-0 w-36">
                        <Progress value={completionRate} className="h-2 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                          {passedCount}/{groupAssignments.length}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 shrink-0"
                        onClick={() => handleViewDetails(module._id)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Retake Dialog (list view) */}
      <Dialog open={!!retakeConfirm} onOpenChange={() => !isRetaking && setRetakeConfirm(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Retake</DialogTitle>
            <DialogDescription>
              Grant <strong>{retakeConfirm?.learnerName}</strong> a retake? This resets their
              progress for a new attempt round.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setRetakeConfirm(null)} disabled={isRetaking}>
              Cancel
            </Button>
            <Button
              className="bg-[hsl(38_92%_50%)] text-white hover:bg-[hsl(38_92%_45%)]"
              onClick={handleRetakeConfirm}
              disabled={isRetaking}
            >
              {isRetaking ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              Confirm Retake
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
