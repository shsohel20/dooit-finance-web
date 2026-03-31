import React, { useState } from "react";
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
import { createQuestion } from "../../../../../actions";
import { toast } from "sonner";

const optionTypes = [
  { key: "A", text: "" },
  { key: "B", text: "" },
  { key: "C", text: "" },
  { key: "D", text: "" },
];
const trueFalseOptions = [
  { key: "A", text: "True" },
  { key: "B", text: "False" },
];

export default function QuestionModal({ openDialog, setOpenDialog, partId, fetchQuestions }) {
  const [form, setForm] = useState({
    text: "",
    type: "single",
    // correctAnswers: "A",
    explanation: "",
    points: "",
    order: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(optionTypes);
  const [correctAnswer, setCorrectAnswer] = useState("0");

  const handleOptionChange = (option, value) => {
    const updatedOptions = options.map((o) => (o.key === option.key ? { ...o, text: value } : o));
    setOptions(updatedOptions);
  };

  const handleAddQuestion = async () => {
    const payload = {
      ...form,
      options,
      correctAnswers: [correctAnswer],
    };
    setIsLoading(true);
    const res = await createQuestion(payload, partId);
    setIsLoading(false);
    if (res.success) {
      toast.success("Question created successfully");
      setOpenDialog(false);
      fetchQuestions();
    } else {
      toast.error("Failed to create question");
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>Create a question for learners to answer</DialogDescription>
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
            <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
              <SelectTrigger id="question-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.type === "single" && (
            <div className="space-y-3">
              <Label>Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span>{option.key})</span>
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option, e.target.value)}
                  />
                  <Input
                    type="radio"
                    name="correct"
                    checked={correctAnswer === option.key}
                    onChange={() => setCorrectAnswer(option.key)}
                    className="w-6"
                  />
                </div>
              ))}
            </div>
          )}

          {form.type === "true-false" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="true-false"
                    checked={correctAnswer === "A"}
                    onChange={() => setCorrectAnswer("A")}
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="true-false"
                    checked={correctAnswer === "B"}
                    onChange={() => setCorrectAnswer("B")}
                  />
                  <span>False</span>
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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleAddQuestion}>
              {isLoading ? "Adding..." : "Add Question"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
