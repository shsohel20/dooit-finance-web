"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactPlayer from "react-player";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getModuleById, getPartById, deleteQuestion } from "../../../../../actions";
import QuestionModal from "./QuestionModal";
import { toast } from "sonner";
import PartModal from "../../PartModal";
import { Skeleton } from "@/components/ui/skeleton";

const TYPE_LABELS = {
  single: "Multiple Choice",
  multiple: "Multiple Choice (Multi)",
  boolean: "True / False",
  "true-false": "True / False",
};

export default function PartEditorPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id;
  const partId = params.partId;
  const [part, setPart] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPartForm, setOpenPartForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteQuestionTarget, setDeleteQuestionTarget] = useState(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  const fetchPart = useCallback(async () => {
    setLoading(true);
    const res = await getPartById(partId);
    setPart(res.data);
    setLoading(false);
  }, [partId]);

  useEffect(() => {
    if (!partId) return;
    fetchPart();
    const fetchModule = async () => {
      const res = await getModuleById(moduleId);
      setModuleData(res.data);
    };
    fetchModule();
  }, [partId]);

  const handleDeleteQuestion = async () => {
    if (!deleteQuestionTarget) return;
    setIsDeletingQuestion(true);
    const res = await deleteQuestion(deleteQuestionTarget._id);
    setIsDeletingQuestion(false);
    setDeleteQuestionTarget(null);
    if (res.success) {
      toast.success("Question deleted");
      fetchPart();
    } else {
      toast.error("Failed to delete question");
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setOpenDialog(true);
  };

  if (!moduleData || !part || loading) {
    return (
      <div>
        <Skeleton className="h-[60vh] w-full" />
        <Skeleton className="h-10 w-1/3 mt-4" />
        <Skeleton className="h-6 w-1/4 mt-2" />
      </div>
    );
  }

  return (
    <>
      <AlertDialog
        open={!!deleteQuestionTarget}
        onOpenChange={(open) => !open && setDeleteQuestionTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingQuestion}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestion}
              disabled={isDeletingQuestion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingQuestion ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuestionModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        partId={partId}
        fetchQuestions={fetchPart}
        questionData={editingQuestion}
        setQuestionData={setEditingQuestion}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{part.title}</h1>
              <p className="text-muted-foreground">{moduleData.title}</p>
            </div>
            <div>
              <Button variant="outline" onClick={() => setOpenPartForm(true)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Part
              </Button>
              {openPartForm && (
                <PartModal
                  openDialog={openPartForm}
                  setOpenDialog={setOpenPartForm}
                  moduleId={moduleId}
                  fetchParts={fetchPart}
                  partData={part}
                />
              )}
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="bg-muted rounded-lg p-4 h-[60vh]">
          <ReactPlayer
            src={part.video?.url}
            style={{ width: "100%", height: "100%", aspectRatio: "16/9" }}
            controls={true}
          />
        </div>

        {/* Questions Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Questions ({part.questions.length})</CardTitle>
              <CardDescription>
                Learners will answer these after watching the video
              </CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={() => { setEditingQuestion(null); setOpenDialog(true); }}>
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
                {part.questions.map((question, index) => {
                  const isCorrect = (key) => question.correctAnswers?.includes(key);
                  return (
                    <div
                      key={question._id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-muted-foreground">
                              Q{index + 1}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {TYPE_LABELS[question.type] || question.type}
                            </Badge>
                            {question.points && (
                              <Badge variant="outline" className="text-xs">
                                {question.points} pt{question.points !== 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground font-medium">{question.text}</p>
                          <div className="mt-3 space-y-1">
                            {question.options?.map((option) => (
                              <div
                                key={option.key}
                                className={`text-sm p-2 rounded flex items-center gap-2 ${
                                  isCorrect(option.key)
                                    ? "bg-success/20 text-success font-semibold"
                                    : "text-muted-foreground"
                                }`}
                              >
                                <span className="font-medium">{option.key})</span>
                                {option.text}
                                {isCorrect(option.key) && (
                                  <span className="text-xs ml-auto">✓ correct</span>
                                )}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <p className="text-sm text-muted-foreground mt-3 italic">
                              Explanation: {question.explanation}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteQuestionTarget(question)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
