"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useModules } from "@/contexts/module-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowLeft,
  Award,
  Target,
  FileText,
} from "lucide-react";
import { useLoggedInUser } from "@/app/store/useLoggedInUser";

// Mock learner data
const mockLearners = [
  { id: "3", name: "Learner User", email: "learner@example.com", department: "Operations" },
  { id: "learner1", name: "Emily Johnson", email: "emily@company.com", department: "Compliance" },
  { id: "learner2", name: "Michael Chen", email: "michael@company.com", department: "Operations" },
  { id: "learner3", name: "Sarah Williams", email: "sarah@company.com", department: "Compliance" },
  { id: "learner4", name: "David Brown", email: "david@company.com", department: "Legal" },
];

export default function ManagerAssignmentsPage() {
  const searchParams = useSearchParams();
  // const { user } = useAuth();
  const { modules, assignments, progress, assignModule, retakeModule, getLearnerProgress } =
    useModules();
  const { loggedInUser: user } = useLoggedInUser();

  // Assign form state
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [maxAttempts, setMaxAttempts] = useState("3");
  const [learnerSearch, setLearnerSearch] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Search & filter
  const [listSearch, setListSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Detail view
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  // Retake state
  const [retakeConfirm, setRetakeConfirm] = useState(null);
  const [retakeSuccess, setRetakeSuccess] = useState(false);

  const publishedModules = modules.filter((m) => m.status === "published");

  const filteredLearners = mockLearners.filter(
    (l) =>
      l.name.toLowerCase().includes(learnerSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(learnerSearch.toLowerCase()),
  );

  const toggleLearner = (learnerId) => {
    setSelectedLearners((prev) =>
      prev.includes(learnerId) ? prev.filter((id) => id !== learnerId) : [...prev, learnerId],
    );
  };

  const handleAssign = () => {
    if (!selectedModuleId || selectedLearners.length === 0 || !user) return;
    const due = dueDate ? new Date(dueDate) : undefined;
    const attempts = maxAttempts === "unlimited" ? undefined : parseInt(maxAttempts);
    assignModule(selectedModuleId, selectedLearners, user.id, due, attempts);
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignDialogOpen(false);
      setAssignSuccess(false);
      setSelectedModuleId("");
      setSelectedLearners([]);
      setDueDate("");
      setMaxAttempts("3");
    }, 1500);
  };

  const handleRetake = (learnerId, moduleId) => {
    retakeModule(learnerId, moduleId);
    setRetakeSuccess(true);
    setRetakeConfirm(null);
    setTimeout(() => setRetakeSuccess(false), 3000);
  };

  // Build enriched assignment data with per-learner progress
  const enrichedAssignments = assignments.map((assignment) => {
    const mod = modules.find((m) => m.id === assignment.moduleId);
    const learnerData = assignment.assignedTo.map((learnerId) => {
      const learner = mockLearners.find((l) => l.id === learnerId);
      const p = getLearnerProgress(learnerId, assignment.moduleId);
      return {
        learnerId,
        name: learner?.name || "Unknown",
        email: learner?.email || "",
        department: learner?.department || "",
        score: p?.score || 0,
        isPassed: p?.isPassed || false,
        isCompleted: !!p?.completedAt,
        attemptCount: p?.attemptCount || 0,
        hasAttempts: (p?.attempts.length || 0) > 0,
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
      ...assignment,
      moduleTitle: mod?.title || "Unknown Module",
      moduleParts: mod?.parts.length || 0,
      moduleQuestions: mod?.parts.reduce((acc, p) => acc + p.questions.length, 0) || 0,
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

  // Filter assignments
  const filteredAssignments = enrichedAssignments.filter((a) => {
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

  // Determine the assignment being viewed in detail
  const detailAssignment = selectedAssignmentId
    ? enrichedAssignments.find((a) => a.id === selectedAssignmentId)
    : null;

  // if (!user || user.role !== 'manager') {
  //   return (
  //     <MainLayout>
  //       <div className="text-center py-12">
  //         <p className="text-muted-foreground">Access denied. Managers only.</p>
  //       </div>
  //     </MainLayout>
  //   );
  // }

  // ========== DETAIL VIEW ==========
  if (detailAssignment) {
    const mod = modules.find((m) => m.id === detailAssignment.moduleId);
    const isOverdue = detailAssignment.dueDate && new Date(detailAssignment.dueDate) < new Date();

    return (
      // <MainLayout>
      <div className="space-y-6">
        {/* Retake success toast */}
        {retakeSuccess && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(142_71%_45%)]/10 border border-[hsl(142_71%_45%)]/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-[hsl(142_71%_45%)]" />
            <p className="text-sm font-medium text-foreground">
              Retake request sent. The learner can now retake the exam.
            </p>
          </div>
        )}

        {/* Back button + Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground mb-4"
            onClick={() => setSelectedAssignmentId(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {detailAssignment.moduleTitle}
                </h1>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                Assigned{" "}
                {new Date(detailAssignment.assignedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Detail Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailAssignment.learnerData.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Learners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[hsl(142_71%_45%)]/10">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(142_71%_45%)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailAssignment.passedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-destructive/10">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailAssignment.failedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[hsl(38_92%_50%)]/10">
                  <Target className="w-5 h-5 text-[hsl(38_92%_50%)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailAssignment.completionRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Info Card */}
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Module
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {detailAssignment.moduleTitle}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Parts / Questions
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {detailAssignment.moduleParts} parts, {detailAssignment.moduleQuestions} questions
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Due Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {detailAssignment.dueDate
                    ? new Date(detailAssignment.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No deadline"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Max Attempts
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {detailAssignment.maxAttempts || "Unlimited"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learner Table */}
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
                    <TableHead>Department</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailAssignment.learnerData.map((learner) => {
                    const statusConfig = learner.isPassed
                      ? {
                          label: "Passed",
                          dotClass: "bg-[hsl(142_71%_45%)]",
                          badgeClass:
                            "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%)]/20",
                        }
                      : learner.isCompleted
                        ? {
                            label: "Failed",
                            dotClass: "bg-destructive",
                            badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
                          }
                        : learner.hasAttempts
                          ? {
                              label: "In Progress",
                              dotClass: "bg-primary",
                              badgeClass: "bg-primary/10 text-primary border-primary/20",
                            }
                          : {
                              label: "Not Started",
                              dotClass: "bg-muted-foreground",
                              badgeClass: "bg-muted text-muted-foreground border-border",
                            };

                    return (
                      <TableRow key={learner.learnerId} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {learner.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{learner.name}</p>
                              <p className="text-xs text-muted-foreground">{learner.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-normal">
                            {learner.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Progress value={learner.score} className="w-20 h-2" />
                            <span className="text-sm font-semibold text-foreground tabular-nums w-10">
                              {Math.round(learner.score)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig.badgeClass}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass} mr-1.5`}
                            />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-sm tabular-nums">{learner.attemptCount}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {learner.isCompleted && !learner.isPassed ? (
                            <Button
                              size="sm"
                              className="gap-1.5 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-[hsl(0_0%_100%)] font-medium"
                              onClick={() =>
                                setRetakeConfirm({
                                  learnerId: learner.learnerId,
                                  moduleId: detailAssignment.moduleId,
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

        {/* Retake Confirmation Dialog */}
        <Dialog open={!!retakeConfirm} onOpenChange={(open) => !open && setRetakeConfirm(null)}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[hsl(38_92%_50%)]" />
                Confirm Retake
              </DialogTitle>
              <DialogDescription>
                This will reset the learner's progress and allow them to retake the exam from the
                beginning.
              </DialogDescription>
            </DialogHeader>
            {retakeConfirm && (
              <div className="space-y-4">
                <Card className="border-[hsl(38_92%_50%)]/20 bg-[hsl(38_92%_50%)]/5">
                  <CardContent className="pt-4 pb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Learner</span>
                      <span className="font-medium text-foreground">
                        {retakeConfirm.learnerName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Module</span>
                      <span className="font-medium text-foreground">
                        {detailAssignment.moduleTitle}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setRetakeConfirm(null)}>
                    Cancel
                  </Button>
                  <Button
                    className="gap-2 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-[hsl(0_0%_100%)]"
                    onClick={() => handleRetake(retakeConfirm.learnerId, retakeConfirm.moduleId)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Confirm Retake
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      // </MainLayout>
    );
  }

  // ========== LIST VIEW ==========
  return (
    // <MainLayout>
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

            {assignSuccess ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-[hsl(142_71%_45%)]/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[hsl(142_71%_45%)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Assignment Created</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedLearners.length} learner{selectedLearners.length !== 1 ? "s" : ""}{" "}
                  assigned successfully.
                </p>
              </div>
            ) : (
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
                        <SelectItem key={module.id} value={module.id}>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            {module.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedModuleId && (
                    <p className="text-xs text-muted-foreground">
                      {modules.find((m) => m.id === selectedModuleId)?.parts.length || 0} parts,{" "}
                      {modules
                        .find((m) => m.id === selectedModuleId)
                        ?.parts.reduce((acc, p) => acc + p.questions.length, 0) || 0}{" "}
                      questions
                    </p>
                  )}
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
                        const learner = mockLearners.find((l) => l.id === id);
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
                        key={learner.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0 transition-colors"
                      >
                        <Checkbox
                          checked={selectedLearners.includes(learner.id)}
                          onCheckedChange={() => toggleLearner(learner.id)}
                        />
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {learner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">{learner.name}</p>
                          <p className="text-xs text-muted-foreground">{learner.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {learner.department}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Settings Row */}
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

                {/* Summary */}
                {selectedModuleId && selectedLearners.length > 0 && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-4 pb-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Module</p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {modules.find((m) => m.id === selectedModuleId)?.title}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Learners</p>
                          <p className="text-sm font-semibold text-foreground">
                            {selectedLearners.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Due</p>
                          <p className="text-sm font-semibold text-foreground">
                            {dueDate || "No deadline"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2 border-t border-border">
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssign}
                    disabled={!selectedModuleId || selectedLearners.length === 0}
                    className="gap-2 font-semibold"
                  >
                    <Send className="w-4 h-4" />
                    Assign Module
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Toast */}
      {retakeSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(142_71%_45%)]/10 border border-[hsl(142_71%_45%)]/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[hsl(142_71%_45%)]" />
          <p className="text-sm font-medium text-foreground">
            Retake request sent. The learner can now retake the exam.
          </p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{publishedModules.length}</p>
                <p className="text-xs text-muted-foreground">Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
                <p className="text-xs text-muted-foreground">Assignments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {progress.filter((p) => p.isPassed).length}
                </p>
                <p className="text-xs text-muted-foreground">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {progress.filter((p) => p.completedAt && !p.isPassed).length}
                </p>
                <p className="text-xs text-muted-foreground">Need Retake</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
            const statusConfig = {
              completed: {
                label: "All Passed",
                className:
                  "bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%)]/20",
                dotClass: "bg-[hsl(142_71%_45%)]",
              },
              attention: {
                label: `${assignment.failedCount} Failed`,
                className: "bg-destructive/10 text-destructive border-destructive/20",
                dotClass: "bg-destructive",
              },
              "in-progress": {
                label: "In Progress",
                className: "bg-primary/10 text-primary border-primary/20",
                dotClass: "bg-primary",
              },
              pending: {
                label: "Not Started",
                className: "bg-muted text-muted-foreground border-border",
                dotClass: "bg-muted-foreground",
              },
            };
            const config = statusConfig[assignment.overallStatus];

            return (
              <Card
                key={assignment.id}
                className="border-border hover:border-primary/20 transition-all duration-200 group"
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Module info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground truncate">
                            {assignment.moduleTitle}
                          </h3>
                          <Badge variant="outline" className={config.className}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${config.dotClass} mr-1.5`}
                            />
                            {config.label}
                          </Badge>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {assignment.learnerData.length} learner
                            {assignment.learnerData.length !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {assignment.dueDate
                              ? new Date(assignment.dueDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "No deadline"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {assignment.maxAttempts || "Unlimited"} attempts
                          </span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="flex items-center gap-3 mt-3">
                          <Progress value={assignment.completionRate} className="flex-1 h-2" />
                          <span className="text-xs font-semibold text-foreground tabular-nums">
                            {assignment.completionRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-shrink-0">
                      {assignment.failedCount > 0 && (
                        <Button
                          size="sm"
                          className="gap-1.5 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-[hsl(0_0%_100%)] font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find first failed learner to retake
                            const failedLearner = assignment.learnerData.find(
                              (l) => l.isCompleted && !l.isPassed,
                            );
                            if (failedLearner) {
                              setRetakeConfirm({
                                learnerId: failedLearner.learnerId,
                                moduleId: assignment.moduleId,
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
                        onClick={() => setSelectedAssignmentId(assignment.id)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Inline learner mini-avatars */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground mr-1">Learners:</span>
                    <div className="flex items-center -space-x-2">
                      {assignment.learnerData.slice(0, 5).map((learner) => {
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
                            title={`${learner.name} - ${learner.isPassed ? "Passed" : learner.isCompleted ? "Failed" : learner.hasAttempts ? "In Progress" : "Not Started"} (${Math.round(learner.score)}%)`}
                          >
                            <span className="text-[10px] font-bold text-primary">
                              {learner.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        );
                      })}
                      {assignment.learnerData.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            +{assignment.learnerData.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                    {assignment.failedCount > 0 && (
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-destructive">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {assignment.failedCount} need{assignment.failedCount === 1 ? "s" : ""}{" "}
                        retake
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

      {/* Retake Confirmation Dialog (list view) */}
      <Dialog open={!!retakeConfirm} onOpenChange={(open) => !open && setRetakeConfirm(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[hsl(38_92%_50%)]" />
              Confirm Retake
            </DialogTitle>
            <DialogDescription>
              This will reset the learner's progress and allow them to retake the exam from the
              beginning.
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
                    <span className="font-medium text-foreground">
                      {modules.find((m) => m.id === retakeConfirm.moduleId)?.title}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setRetakeConfirm(null)}>
                  Cancel
                </Button>
                <Button
                  className="gap-2 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-[hsl(0_0%_100%)]"
                  onClick={() => handleRetake(retakeConfirm.learnerId, retakeConfirm.moduleId)}
                >
                  <RotateCcw className="w-4 h-4" />
                  Confirm Retake
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    // </MainLayout>
  );
}
