"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useModules } from "@/contexts/module-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReactPlayer from "react-player";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { getModuleById, getPartById, deleteQuestion } from "../../../../../actions";
import QuestionModal from "./QuestionModal";
import { toast } from "sonner";
import PartModal from "../../PartModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartEditorPage() {
  const params = useParams();
  const router = useRouter();
  const user = { id: "1", role: "admin" };
  const moduleId = params.id;
  const partId = params.partId;
  const [part, setPart] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPartForm, setOpenPartForm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDeleteQuestion = async (questionId) => {
    const res = await deleteQuestion(questionId);
    if (res.success) {
      toast.success("Question deleted successfully");
      fetchPart();
    } else {
      toast.error("Failed to delete question");
    }
  };

  if (!user || !moduleData || !part || loading) {
    return (
      <div>
        <Skeleton className={"h-[60vh] w-full"} />
        <Skeleton className={"h-10 w-1/3 mt-4"} />
        <Skeleton className={"h-6 w-1/4 mt-2"} />
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div>
  //       <Skeleton className={"h-[60vh] w-full"} />
  //       <Skeleton className={"h-10 w-1/3 mt-4"} />
  //       <Skeleton className={"h-6 w-1/4 mt-2"} />
  //     </div>
  //   );
  // }

  return (
    <>
      {/* Add Question Dialog - Rendered at root level for proper positioning */}
      <QuestionModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        partId={partId}
        fetchQuestions={fetchPart}
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
              <Button variant={"outline"} onClick={() => setOpenPartForm(true)}>
                <Edit /> Edit
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

        <div className="bg-muted rounded-lg p-4 text-center h-[60vh]">
          <ReactPlayer
            // ref={setPlayerRef}
            src={part.video?.url}
            // onReady={handleReady}
            style={{ width: "100%", height: "100%", aspectRatio: "16/9" }}
            // onTimeUpdate={handleTimeUpdate}

            controls={true}
          />
        </div>

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
                              {String.fromCharCode(65 + optIndex)}) {option?.text}
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
                        onClick={() => handleDeleteQuestion(question.id)}
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
