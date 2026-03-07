"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useModules } from "@/contexts/module-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function PartEditorPage() {
  const params = useParams();
  const router = useRouter();
  const user = { id: "1", role: "admin" };
  const { getModuleById, addQuestion, deleteQuestion } = useModules();
  const moduleId = params.id;
  const partId = params.partId;

  const moduleData = getModuleById(moduleId);
  const part = moduleData?.parts.find((p) => p.id === partId);

  const [openDialog, setOpenDialog] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("0");
  const [explanation, setExplanation] = useState("");

  if (!user || !moduleData || !part) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Part not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    if (questionType === "multiple-choice" && options.some((o) => !o.trim())) {
      alert("Please fill in all options");
      return;
    }

    const finalOptions = questionType === "true-false" ? ["True", "False"] : options;

    addQuestion(moduleId, partId, {
      question: questionText,
      type: questionType,
      options: finalOptions,
      correctAnswer: parseInt(correctAnswer),
      explanation,
    });

    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("0");
    setExplanation("");
    setOpenDialog(false);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <>
      {/* Add Question Dialog - Rendered at root level for proper positioning */}
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
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-type">Question Type</Label>
              <Select value={questionType} onValueChange={(val) => setQuestionType(val)}>
                <SelectTrigger id="question-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {questionType === "multiple-choice" && (
              <div className="space-y-3">
                <Label>Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <Input
                      type="radio"
                      name="correct"
                      checked={correctAnswer === index.toString()}
                      onChange={() => setCorrectAnswer(index.toString())}
                      className="w-6"
                    />
                  </div>
                ))}
              </div>
            )}

            {questionType === "true-false" && (
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="true-false"
                      checked={correctAnswer === "0"}
                      onChange={() => setCorrectAnswer("0")}
                    />
                    <span>True</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="true-false"
                      checked={correctAnswer === "1"}
                      onChange={() => setCorrectAnswer("1")}
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
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddQuestion}>Add Question</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{part.title}</h1>
            <p className="text-muted-foreground">{moduleData.title}</p>
          </div>
        </div>

        {/* Video Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Video URL:</p>
              <p className="text-foreground break-all">{part.videoUrl}</p>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Questions ({part.questions.length})</CardTitle>
              <CardDescription>Learners will answer these after watching the video</CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setOpenDialog(true)}>
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent>
            {part.questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {part.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            {question.type === "true-false" ? "True/False" : "Multiple Choice"}
                          </span>
                        </div>
                        <p className="text-foreground font-medium">{question.question}</p>
                        <div className="mt-3 space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`text-sm p-2 rounded ${
                                optIndex === question.correctAnswer
                                  ? "bg-success/20 text-success font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}) {option}
                            </div>
                          ))}
                        </div>
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground mt-3 italic">
                            Explanation: {question.explanation}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteQuestion(moduleId, partId, question.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
