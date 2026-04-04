"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getMyProgressForModule,
  getPartById,
  submitQuiz,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { useRouter, useSearchParams } from "next/navigation";
import ResultScreen from "./ResultScreen";

export default function QuizScreen({
  activePart,
  // currentQIndex,
  // setCurrentQIndex,
  setPhase,
  activePartIndex,
  // partData,
  partId,
  moduleId,
}) {
  const [partData, setPartData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progressData, setProgressData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const questions = partData?.questions;
  const currentQ = questions?.[currentQIndex];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions?.length;
  const qProgressPercent = Math.round(((currentQIndex + 1) / questions?.length) * 100);

  //router
  const router = useRouter();

  console.log("partId", partId);
  const options = currentQ?.options || [];

  const submitPartQuiz = async () => {
    // setPhase("part-result");
    const mapAnswers = {
      0: "A",
      1: "B",
      2: "C",
      3: "D",
    };
    const updatedAnswers = [];
    for (const [key, value] of Object.entries(answers)) {
      updatedAnswers.push({
        questionId: key,
        selectedAnswer: mapAnswers[value] || value, // Map index to letter or use value directly if not in map
      });
    }
    const payload = {
      partId,
      answers: updatedAnswers,
    };
    const res = await submitQuiz(moduleId, payload);
    setResultData(res?.data || null);
  };
  console.log("partData", partData);
  const getPartData = async () => {
    const res = await getPartById(partId);
    // console.log("progressData", res.data);
    setPartData(res?.data || null);
  };

  const getProgressData = async () => {
    const res = await getMyProgressForModule(moduleId);
    console.log("progressData", res.data);
    setProgressData(res?.data || null);
  };
  useEffect(() => {
    getPartData();
  }, [partId]);
  useEffect(() => {
    getProgressData();
  }, [moduleId]);

  if (resultData) {
    return <ResultScreen result={resultData} />;
  }
  return (
    // <MainLayout>
    <div className="max-w-6xl w-full mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router?.back()}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Video
        </Button>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
          Part {activePartIndex + 1} Quiz
        </Badge>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-1">{partData?.title}</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Answer all questions to complete this part
      </p>

      {/* Progress */}
      <Card className="mb-6 border-primary/10 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 shadow-sm">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              Question {currentQIndex + 1} of {partData?.questions.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {answeredCount}/{questions?.length} answered
            </span>
          </div>
          <Progress value={qProgressPercent} className="h-2 mb-4" />
          <div className="flex gap-1.5 flex-wrap">
            {questions?.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQIndex(i)}
                className={`w-9 h-9 rounded-lg font-medium text-xs transition-all duration-200 ${
                  i === currentQIndex
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110"
                    : answers[q.id] !== undefined
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="overflow-hidden border-border/50 shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-primary/10 text-primary border-0 font-semibold">
              Question {currentQIndex + 1} of {questions?.length}
            </Badge>
            {currentQ?.type === "true-false" && (
              <Badge variant="secondary" className="border-0">
                True / False
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg leading-relaxed">{currentQ?.text}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="space-y-3">
            {options?.map((option, i) => {
              const isSelected = answers[currentQ.id] === i;
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQ.id]: i })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {letter}
                  </div>
                  <span
                    className={`font-medium ${isSelected ? "text-foreground" : "text-foreground/80"}`}
                  >
                    {option?.text}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Nav Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
          disabled={currentQIndex === 0}
          className="gap-2 bg-transparent"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentQIndex < questions?.length - 1 ? (
          <Button onClick={() => setCurrentQIndex(currentQIndex + 1)} className="gap-2" size="sm">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={submitPartQuiz} disabled={!allAnswered} className="gap-2" size="sm">
            Submit Quiz
          </Button>
        )}
      </div>

      {!allAnswered && currentQIndex === questions?.length - 1 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Answer all {questions.length - answeredCount} remaining question
          {questions.length - answeredCount > 1 ? "s" : ""} to submit
        </p>
      )}
    </div>
    // </MainLayout>
  );
}
