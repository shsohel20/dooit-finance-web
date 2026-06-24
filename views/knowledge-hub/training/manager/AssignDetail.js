import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Users,
  AlertTriangle,
  Target,
  FileText,
  Loader2,
  Edit,
  Award,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { grantRetake } from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { toast } from "sonner";
import AssignmentForm from "./AssignmentForm";

export default function AssignDetail({
  detailGroup,
  setSelectedModuleGroupId,
  setRetakeConfirm,
  retakeConfirm,
  fetchAll,
  modules,
  users,
}) {
  const [isRetaking, setIsRetaking] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  // const isOverdue = detailGroup.dueDate && new Date(detailGroup.dueDate) < new Date();
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
  const isOverdue = detailGroup.dueDate && new Date(detailGroup.dueDate) < new Date();
  const openEditDialog = async (group) => {
    //  setAssignFormMode("edit");
    //  const assignments = await getAssignmentsByModuleId(group.moduleId);
    //  const learners = assignments.data.map((a) => a.learner);
    //  console.log("learners", learners);
    //  setSelectedModuleId(group.moduleId);
    //  setSelectedLearners(learners);
    //  setDueDate(group.dueDate ? new Date(group.dueDate).toISOString().split("T")[0] : "");
    //  setMaxAttempts(group.maxAttempts === 0 ? "unlimited" : String(group.maxAttempts ?? 3));
    //  setLearnerSearch("");
    setAssignDialogOpen(true);
  };
  const handleAssignDialogChange = (open) => {
    setAssignDialogOpen(open);
    if (!open) {
      setSelectedModuleGroupId(null);
    }
  };
  return (
    <div>
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
            <Button variant="outline" className="gap-2" onClick={() => openEditDialog(detailGroup)}>
              <Edit className="w-4 h-4" />
              Edit Assignment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Learners",
              value: detailGroup.learnerData.length,
              icon: Users,
              bg: "bg-primary/10",
              color: "text-primary",
            },
            {
              label: "Passed",
              value: detailGroup.passedCount,
              icon: CheckCircle2,
              bg: "bg-[hsl(142_71%_45%)]/10",
              color: "text-[hsl(142_71%_45%)]",
            },
            {
              label: "Failed",
              value: detailGroup.failedCount,
              icon: AlertTriangle,
              bg: "bg-destructive/10",
              color: "text-destructive",
            },
            {
              label: "Completion",
              value: `${detailGroup.completionRate}%`,
              icon: Target,
              bg: "bg-[hsl(38_92%_50%)]/10",
              color: "text-[hsl(38_92%_50%)]",
            },
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Module
                </p>
                <p className="text-sm font-semibold text-foreground">{detailGroup.moduleTitle}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Parts / Questions
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {detailGroup.moduleParts} parts, {detailGroup.moduleQuestions} questions
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Due Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {detailGroup.dueDate
                    ? new Date(detailGroup.dueDate).toLocaleDateString("en-US", {
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
                  {detailGroup.maxAttempts === 0
                    ? "Unlimited"
                    : detailGroup.maxAttempts || "Unlimited"}
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
                          <div className="flex items-center gap-2.5">
                            <Progress value={learner.score} className="w-20 h-2" />
                            <span className="text-sm font-semibold text-foreground tabular-nums w-10">
                              {learner.score > 0 ? `${Math.round(learner.score)}%` : "-"}
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
                            <span className="text-sm tabular-nums">
                              {learner.attemptCount || "-"}
                            </span>
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
        <Dialog
          open={!!retakeConfirm}
          onOpenChange={(open) => !open && !isRetaking && setRetakeConfirm(null)}
        >
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[hsl(38_92%_50%)]" />
                Confirm Retake
              </DialogTitle>
              <DialogDescription>
                This resets the learner&apos;s progress and allows them to retake from the
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
                      <span className="font-medium text-foreground">{detailGroup.moduleTitle}</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setRetakeConfirm(null)}
                    disabled={isRetaking}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="gap-2 bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_45%)] text-white"
                    onClick={handleRetake}
                    disabled={isRetaking}
                  >
                    {isRetaking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Confirm Retake
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AssignmentForm
          assignDialogOpen={assignDialogOpen}
          setAssignDialogOpen={setAssignDialogOpen}
          handleAssignDialogChange={handleAssignDialogChange}
          isEditMode={true}
          id={detailGroup.moduleId}
          fetchAll={fetchAll}
          modules={modules}
          users={users}
        />
      </div>
    </div>
  );
}
