import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CheckCircle2, Loader2, Search, Send, XCircle } from "lucide-react";
import {
  assignAssignment,
  getAssignmentsByModuleId,
  updateAssignment,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { toast } from "sonner";

const AssignmentForm = ({
  assignDialogOpen,
  setAssignDialogOpen,
  handleAssignDialogChange,
  isEditMode,
  fetchAll,
  modules,
  users,
  id = null,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [maxAttempts, setMaxAttempts] = useState(null);
  const [learnerSearch, setLearnerSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignFormMode, setAssignFormMode] = useState("create");

  const fetchAssignmentById = async () => {
    const res = await getAssignmentsByModuleId(id);
    console.log("getbymoduleid res", res);

    setSelectedModuleId(res.module.id);
    const learners = res.data.map((a) => a.learner);
    setSelectedLearners(learners);
    setDueDate(res.data.dueDate);
    setMaxAttempts(res.data.maxAttempts);
  };
  useEffect(() => {
    if (id) {
      fetchAssignmentById();
    }
  }, [id]);

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
    const learnerIds = selectedLearners.map((l) => {
      if (typeof l === "string") {
        return l;
      }
      return l._id;
    });
    const payload = {
      learnerIds: learnerIds,
      dueDate: dueDate || undefined,
      maxAttempts: maxAttempts === "unlimited" ? 0 : parseInt(maxAttempts),
    };
    try {
      const res = await assignAssignment(payload, selectedModuleId);
      console.log("payload", JSON.stringify(payload, null, 2));
      console.log("res", res);
      if (res.success) {
        if (assignFormMode === "edit") {
          toast.success("Assignment updated successfully");
        } else {
          toast.success(
            `Assigned to ${res.inserted} learner(s).${res.roleBlocked > 0 ? ` ${res.roleBlocked} blocked by role rules.` : ""}`,
          );
        }
        setAssignDialogOpen(false);
        //  resetAssignForm();
        fetchAll();
      } else {
        toast.error(
          res.message || (assignFormMode === "edit" ? "Update failed" : "Assignment failed"),
        );
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={assignDialogOpen} onOpenChange={handleAssignDialogChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? "Edit Assignment" : "Assign Module to Learners"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update learners, due date, and attempt limits for this assignment."
              : "Select a module, choose learners, and set the assignment details."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label className="font-semibold">Training Module</Label>
            <Select
              value={selectedModuleId}
              onValueChange={setSelectedModuleId}
              disabled={isEditMode}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a module..." />
              </SelectTrigger>
              <SelectContent>
                {(isEditMode ? modules : publishedModules).map((module) => (
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
                      key={learner?._id || id?._id || id}
                      variant="secondary"
                      className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
                      onClick={() => toggleLearner(id)}
                    >
                      {learner?.name || id?.name}
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
                      {learner.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
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
          {/*
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
          </div> */}

          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <Button variant="outline" onClick={() => handleAssignDialogChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedModuleId || selectedLearners.length === 0 || isAssigning}
              className="gap-2 font-semibold"
            >
              {isAssigning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditMode ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isAssigning
                ? isEditMode
                  ? "Saving..."
                  : "Assigning..."
                : isEditMode
                  ? "Save Changes"
                  : "Assign Module"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AssignmentForm;
