"use client";

import { useCallback, useEffect, useState } from "react";
import { useModules } from "@/contexts/module-context";
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
} from "lucide-react";
import { getModules, assignAssignment, getAssignmentsforAdmin } from "../../../actions";
import { getAllUsers } from "@/app/dashboard/client/user-and-role-management/actions";
import { toast } from "sonner";

const mockLearners = [
  { id: "1", name: "John Doe", email: "john.doe@company.com", department: "Compliance" },
  { id: "learner2", name: "Michael Chen", email: "michael@company.com", department: "Operations" },
  { id: "learner3", name: "Sarah Williams", email: "sarah@company.com", department: "Compliance" },
  { id: "learner4", name: "David Brown", email: "david@company.com", department: "Legal" },
  { id: "3", name: "Demo Learner", email: "learner@aml.com", department: "Training" },
];
const getLearnerProgress = (learnerId, moduleId) => {
  // const res = await getLearnerProgressforAdmin(learnerId, moduleId);
  // return res?.data || null;
};
export default function ManageAssignmentsPage() {
  const user = { id: "1", role: "admin", name: "John Doe" };
  const [users, setUsers] = useState([]);
  const fetchUsers = useCallback(async () => {
    const res = await getAllUsers();
    // console.log("res", res);
    setUsers(res?.data || []);
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const [modules, setModules] = useState([]);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [dueDate, setDueDate] = useState("");

  const [assignments, setAssignments] = useState([]);
  const fetchAssignments = useCallback(async () => {
    const res = await getAssignmentsforAdmin();
    setAssignments(res?.data || []);
  }, []);
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [search, setSearch] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [newModuleId, setNewModuleId] = useState("");
  const [newLearnerSearch, setNewLearnerSearch] = useState("");
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [retakeConfirm, setRetakeConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publishedModules = modules;

  const fetchModules = useCallback(async () => {
    const res = await getModules();
    setModules(res?.data || []);
  }, []);
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);
  const filteredAssignments = assignments.filter((a) => {
    const moduleData = modules.find((m) => m.id === a.module?._id);
    if (!moduleData) return false;
    return moduleData.title.toLowerCase().includes(search.toLowerCase());
  });

  const currentAssignment = assignments.find((a) => a.id === selectedAssignment);
  const currentModule = currentAssignment
    ? modules.find((m) => m.id === currentAssignment.moduleId)
    : null;

  console.log("assignments", assignments);
  // const totalLearners = assignments.reduce((a, b) => a + b.assignedTo.length, 0);
  const clearForms = () => {
    setNewModuleId("");
    setSelectedLearners([]);
    setDueDate("");
    setMaxAttempts(3);
  };
  const handleAssign = async () => {
    setIsSubmitting(true);
    const payload = {
      dueDate: dueDate,
      maxAttempts: maxAttempts,
      learnerIds: selectedLearners,
    };
    // console.log("payload", payload);
    try {
      const response = await assignAssignment(payload, newModuleId);
      // console.log("response", response);
      if (response.success) {
        toast.success("Assignment assigned successfully");
        clearForms();
        setAssignDialogOpen(false);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("error", error);
      //  setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
    // if (!newModuleId || selectedLearners.length === 0 || !user) return;
  };

  const toggleLearner = (id) => {
    setSelectedLearners((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  const filteredNewLearners = users?.filter(
    (l) =>
      l.name.toLowerCase().includes(newLearnerSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(newLearnerSearch.toLowerCase()),
  );

  if (user?.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Admins only.</p>
      </div>
    );
  }

  // Detail View
  if (viewMode === "detail" && currentAssignment && currentModule) {
    const learners = mockLearners.filter((l) => currentAssignment.assignedTo.includes(l.id));
    const qCount = currentModule.parts.reduce((a, p) => a + p.questions.length, 0);

    return (
      <>
        <div className="space-y-6">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </button>

          {/* Module Header Card */}
          <Card className="border-border/60 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-[hsl(142_71%_45%)]" />
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{currentModule.title}</h2>
                    <p className="text-muted-foreground mt-1">{currentModule.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" />
                        {currentModule.parts.length} parts
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {qCount} questions
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {learners.length} learners
                      </div>
                      {currentAssignment.dueDate && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          Due {new Date(currentAssignment.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-[hsl(142_71%_45%)]/10 text-[hsl(142_71%_45%)] border-0"
                >
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              let passed = 0,
                failed = 0,
                inProg = 0,
                notStarted = 0;
              learners.forEach((l) => {
                const p = getLearnerProgress(l.id, currentModule.id);
                if (p?.isPassed) passed++;
                else if (p?.completedAt) failed++;
                else if (p && p.attempts.length > 0) inProg++;
                else notStarted++;
              });
              return [
                {
                  label: "Passed",
                  value: passed,
                  color: "text-[hsl(142_71%_45%)]",
                  bg: "bg-[hsl(142_71%_45%)]/10",
                },
                {
                  label: "Failed",
                  value: failed,
                  color: "text-destructive",
                  bg: "bg-destructive/10",
                },
                { label: "In Progress", value: inProg, color: "text-primary", bg: "bg-primary/10" },
                {
                  label: "Not Started",
                  value: notStarted,
                  color: "text-muted-foreground",
                  bg: "bg-muted/50",
                },
              ].map((s) => (
                <Card key={s.label} className="border-border/60">
                  <CardContent className="py-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}
                    >
                      <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ));
            })()}
          </div>

          {/* Learner Table */}
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Assigned Learners
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Learner</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Score</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Attempts</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {learners.map((learner) => {
                      const prog = getLearnerProgress(learner.id, currentModule.id);
                      const status = prog?.isPassed
                        ? "passed"
                        : prog?.completedAt
                          ? "failed"
                          : prog && prog.attempts.length > 0
                            ? "in-progress"
                            : "not-started";
                      const statusCfg = {
                        passed: {
                          bg: "bg-[hsl(142_71%_45%)]/10",
                          text: "text-[hsl(142_71%_45%)]",
                          label: "Passed",
                        },
                        failed: {
                          bg: "bg-destructive/10",
                          text: "text-destructive",
                          label: "Failed",
                        },
                        "in-progress": {
                          bg: "bg-primary/10",
                          text: "text-primary",
                          label: "In Progress",
                        },
                        notStarted: {
                          bg: "bg-muted",
                          text: "text-muted-foreground",
                          label: "Not Started",
                        },
                      };
                      const cfg = statusCfg["notStarted"];

                      return (
                        <TableRow key={learner.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {learner.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">
                                  {learner.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{learner.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {learner.department}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={prog?.score ?? 0} className="w-16 h-1.5" />
                              <span className="text-sm font-medium text-foreground">
                                {Math.round(prog?.score ?? 0)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${cfg.bg} ${cfg.text} border-0 text-xs`}
                            >
                              {cfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {prog?.attemptCount ?? 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {status === "failed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-[hsl(38_92%_50%)] border-[hsl(38_92%_50%)]/30 hover:bg-[hsl(38_92%_50%)]/10 bg-transparent"
                                onClick={() =>
                                  setRetakeConfirm({
                                    learnerId: learner.id,
                                    moduleId: currentModule.id,
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
            </CardContent>
          </Card>
        </div>

        {/* Retake Dialog */}
        <Dialog open={!!retakeConfirm} onOpenChange={() => setRetakeConfirm(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Retake</DialogTitle>
              <DialogDescription>
                This will reset the learner&apos;s progress and allow them to retake the module from
                the beginning.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setRetakeConfirm(null)}>
                Cancel
              </Button>
              <Button
                className="bg-[hsl(38_92%_50%)] text-[hsl(0_0%_100%)] hover:bg-[hsl(38_92%_45%)]"
                onClick={() => {
                  if (retakeConfirm) {
                    retakeModule(retakeConfirm.learnerId, retakeConfirm.moduleId);
                    setRetakeConfirm(null);
                  }
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Confirm Retake
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // List View
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
                  <Label className="text-sm font-medium">Module</Label>
                  <Select value={newModuleId} onValueChange={setNewModuleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module..." />
                    </SelectTrigger>
                    <SelectContent>
                      {publishedModules.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
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
                      <span className="text-primary ml-1">
                        ({selectedLearners.length} selected)
                      </span>
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
                  {users.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {users.map((id) => {
                        const l = mockLearners.find((x) => x.id === id);
                        return l ? (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/20 transition-colors"
                            onClick={() => toggleLearner(id)}
                          >
                            {l.name} x
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="space-y-1 max-h-48 overflow-y-auto border border-border rounded-lg p-1">
                    {filteredNewLearners.map((learner) => {
                      const isSelected = selectedLearners.includes(learner.id);
                      return (
                        <button
                          key={learner.id}
                          type="button"
                          onClick={() => toggleLearner(learner.id)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
                            isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-border"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{learner.name}</p>
                            <p className="text-xs text-muted-foreground">{learner.email}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {learner.role}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Max Attempts</Label>
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
                  {selectedLearners.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Assignments",
              value: assignments.length,
              icon: CheckCircle2,
              color: "text-primary bg-primary/10",
            },
            {
              label: "Published Modules",
              value: publishedModules.length,
              icon: BookOpen,
              color: "text-[hsl(142_71%_45%)] bg-[hsl(142_71%_45%)]/10",
            },
            // {
            //   label: "Total Learners",
            //   value: totalLearners,
            //   icon: Users,
            //   color: "text-accent bg-accent/10",
            // },
            // {
            //   label: "Avg per Module",
            //   value: assignments.length > 0 ? Math.round(totalLearners / assignments.length) : 0,
            //   icon: FileText,
            //   color: "text-[hsl(38_92%_50%)] bg-[hsl(38_92%_50%)]/10",
            // },
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
            placeholder="Search assignments by module name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Assignments List */}
        {filteredAssignments.length === 0 ? (
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
            {filteredAssignments.map((assignment) => {
              const moduleData = modules.find((m) => m.id === assignment.module?._id);
              if (!moduleData) return null;
              const learners =
                mockLearners.filter((l) => assignment.assignedTo?.includes(l.id)) || [];
              const qCount = moduleData.parts.reduce((a, p) => a + p.questions.length, 0);

              let passedCount = 0;
              let failedCount = 0;
              learners.forEach((l) => {
                const p = getLearnerProgress(l.id, moduleData.id);
                if (p?.isPassed) passedCount++;
                else if (p?.completedAt) failedCount++;
              });

              return (
                <Card
                  key={assignment._id}
                  className="border-border/60 overflow-hidden hover:shadow-md transition-all group"
                >
                  <CardContent className="py-5">
                    <div className="flex items-center gap-5">
                      {/* Icon */}
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{moduleData.title}</h3>
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
                            {learners.length} learners
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {moduleData.parts.length} parts
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {qCount} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(assignment.assignedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Completion Bar */}
                      <div className="hidden md:flex items-center gap-3 shrink-0 w-36">
                        <Progress
                          value={learners.length > 0 ? (passedCount / learners.length) * 100 : 0}
                          className="h-2 flex-1"
                        />
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                          {passedCount}/{learners.length}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {failedCount > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-[hsl(38_92%_50%)] border-[hsl(38_92%_50%)]/30 hover:bg-[hsl(38_92%_50%)]/10 bg-transparent"
                            onClick={() => {
                              setSelectedAssignment(assignment.id);
                              setViewMode("detail");
                            }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Retake
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5"
                          onClick={() => {
                            setSelectedAssignment(assignment.id);
                            setViewMode("detail");
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Retake Dialog */}
      <Dialog open={!!retakeConfirm} onOpenChange={() => setRetakeConfirm(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Retake</DialogTitle>
            <DialogDescription>
              This will reset the learner's progress and allow them to retake the module.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setRetakeConfirm(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[hsl(38_92%_50%)] text-[hsl(0_0%_100%)] hover:bg-[hsl(38_92%_45%)]"
              onClick={() => {
                if (retakeConfirm) {
                  retakeModule(retakeConfirm.learnerId, retakeConfirm.moduleId);
                  setRetakeConfirm(null);
                }
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Confirm Retake
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
