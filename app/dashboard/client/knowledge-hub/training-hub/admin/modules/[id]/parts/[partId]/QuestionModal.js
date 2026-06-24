import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createQuestion, updateQuestion } from "../../../../../actions";
import { toast } from "sonner";

const defaultOptions = [
  { key: "A", text: "" },
  { key: "B", text: "" },
  { key: "C", text: "" },
  { key: "D", text: "" },
];

// API uses "boolean" for true/false; UI label is "true-false"
const toApiType = (uiType) => (uiType === "true-false" ? "boolean" : uiType);
const toUiType = (apiType) => (apiType === "boolean" ? "true-false" : apiType);

export default function QuestionModal({
  openDialog,
  setOpenDialog,
  partId,
  fetchQuestions,
  questionData,
  setQuestionData,
}) {
  const isEdit = !!questionData;

  const [form, setForm] = useState({
    text: "",
    type: "single",
    explanation: "",
    points: "",
    order: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [correctAnswer, setCorrectAnswer] = useState("A");

  // Pre-fill when editing
  useEffect(() => {
    if (questionData) {
      const uiType = toUiType(questionData.type);
      setForm({
        text: questionData.text || "",
        type: uiType,
        explanation: questionData.explanation || "",
        points: questionData.points ?? "",
        order: questionData.order ?? "",
      });
      if (uiType === "single" || uiType === "multiple") {
        setOptions(
          questionData.options?.length
            ? questionData.options.map((o) => ({ key: o.key, text: o.text }))
            : defaultOptions,
        );
        setCorrectAnswer(questionData.correctAnswers?.[0] || "A");
      } else {
        setCorrectAnswer(questionData.correctAnswers?.[0] || "A");
      }
    } else {
      setForm({ text: "", type: "single", explanation: "", points: "", order: "" });
      setOptions(defaultOptions);
      setCorrectAnswer("A");
    }
  }, [questionData, openDialog]);

  const handleOptionChange = (key, value) => {
    setOptions((prev) => prev.map((o) => (o.key === key ? { ...o, text: value } : o)));
  };

  const handleTypeChange = (val) => {
    setForm((f) => ({ ...f, type: val }));
    setCorrectAnswer("A");
  };

  const handleSave = async () => {
    if (!form.text.trim()) {
      toast.error("Question text is required");
      return;
    }
    const payload = {
      text: form.text,
      type: toApiType(form.type),
      explanation: form.explanation,
      points: form.points ? Number(form.points) : 1,
      order: form.order ? Number(form.order) : undefined,
      options: form.type === "true-false"
        ? [{ key: "A", text: "True" }, { key: "B", text: "False" }]
        : options,
      correctAnswers: [correctAnswer],
    };

    setIsLoading(true);
    const res = isEdit
      ? await updateQuestion(payload, questionData._id)
      : await createQuestion(payload, partId);
    setIsLoading(false);

    if (res.success) {
      toast.success(isEdit ? "Question updated" : "Question created");
      setOpenDialog(false);
      if (setQuestionData) setQuestionData(null);
      fetchQuestions();
    } else {
      toast.error(res.message || (isEdit ? "Failed to update question" : "Failed to create question"));
    }
  };

  const handleClose = (open) => {
    if (!open && setQuestionData) setQuestionData(null);
    setOpenDialog(open);
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Question" : "Add New Question"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the question details below" : "Create a question for learners to answer"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question</Label>
            <Textarea
              id="question-text"
              placeholder="Enter the question..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-type">Question Type</Label>
            <Select value={form.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="question-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Multiple Choice (Single)</SelectItem>
                <SelectItem value="multiple">Multiple Choice (Multi)</SelectItem>
                <SelectItem value="true-false">True / False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(form.type === "single" || form.type === "multiple") && (
            <div className="space-y-3">
              <Label>Options</Label>
              {options.map((option) => (
                <div key={option.key} className="flex gap-2 items-center">
                  <span className="w-5 text-sm font-medium text-muted-foreground">{option.key})</span>
                  <Input
                    placeholder={`Option ${option.key}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.key, e.target.value)}
                    className="flex-1"
                  />
                  <input
                    type="radio"
                    name="correct"
                    checked={correctAnswer === option.key}
                    onChange={() => setCorrectAnswer(option.key)}
                    className="w-4 h-4 accent-primary"
                    title="Mark as correct"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer.</p>
            </div>
          )}

          {form.type === "true-false" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="true-false"
                    checked={correctAnswer === "A"}
                    onChange={() => setCorrectAnswer("A")}
                    className="accent-primary"
                  />
                  <span className="text-sm">True</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="true-false"
                    checked={correctAnswer === "B"}
                    onChange={() => setCorrectAnswer("B")}
                    className="accent-primary"
                  />
                  <span className="text-sm">False</span>
                </label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Explain why this is the correct answer..."
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                value={form.points}
                placeholder="e.g., 1"
                onChange={(e) => setForm({ ...form, points: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                placeholder="e.g., 1"
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSave}>
              {isLoading ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add Question"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
