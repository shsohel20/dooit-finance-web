"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  getMyProgressForPart,
  getModuleById,
  getPartById,
  submitQuiz,
  completeModule,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { useRouter } from "next/navigation";
import ResultScreen from "./ResultScreen";

const PASS_MARK = 70;

function getQuestionId(q) {
  return q?._id || q?.id;
}

function formatWatchTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuizScreen({
  activePartIndex: activePartIndexProp,
  partId,
  moduleId,
}) {
  const [partData, setPartData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [progressData, setProgressData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const questions = partData?.questions;
  const currentQ = questions?.[currentQIndex];
  const currentQId = getQuestionId(currentQ);
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions?.length;
  const qProgressPercent = Math.round(((currentQIndex + 1) / questions?.length) * 100);

  const router = useRouter();
  const attemptResults = progressData?.results;
  const hasPreviousAttempt = attemptResults?.attempted === true;

  const activePartIndex =
    activePartIndexProp ??
    moduleData?.parts?.findIndex((p) => (p._id || p.id) === partId) ??
    0;

  const options = currentQ?.options || [];

  const submitPartQuiz = async () => {
    const mapAnswers = { 0: "A", 1: "B", 2: "C", 3: "D" };
    const updatedAnswers = Object.entries(answers).map(([key, value]) => ({
      questionId: key,
      selectedAnswer: mapAnswers[value] ?? value,
    }));
    const payload = { partId, answers: updatedAnswers };
    const res = await submitQuiz(moduleId, payload);
    const result = res?.data || null;
    setResultData(result);

    // If this part was passed, check if all parts are now complete
    if (result?.passed && moduleData) {
      const totalParts = moduleData.parts?.length ?? 0;
      // currentPartIndex is 0-based and advances after completion
      // if it equals totalParts, the learner has finished every part
      if (totalParts > 0 && result.currentPartIndex >= totalParts) {
        await completeModule(moduleId).catch(() => {});
      }
    }
  };
  const getPartData = async () => {
    const res = await getPartById(partId);
    setPartData(res?.data || null);
  };

  const getProgressData = async () => {
    const res = await getMyProgressForPart(partId);
    setProgressData(res?.data || null);
  };

  useEffect(() => {
    getPartData();
    getProgressData();
  }, [partId]);

  useEffect(() => {
    getModuleById(moduleId).then((res) => {
      if (res?.data) setModuleData(res.data);
    });
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
          Part {activePartIndex >= 0 ? activePartIndex + 1 : "?"} Quiz
        </Badge>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-1">{partData?.title}</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Answer all questions to complete this part
      </p>

      {hasPreviousAttempt && (
        <Card
          className={`mb-6 overflow-hidden border shadow-sm ${
            attemptResults.passed
              ? "border-emerald-500/25 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5"
              : "border-destructive/20 bg-gradient-to-r from-destructive/5 via-transparent to-orange-400/5"
          }`}
        >
          <div
            className={`h-1 ${
              attemptResults.passed
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-destructive to-orange-400"
            }`}
          />
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    attemptResults.passed ? "bg-emerald-500/10" : "bg-destructive/10"
                  }`}
                >
                  {attemptResults.passed ? (
                    <Trophy className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Previous attempt</p>
                  <p className="text-xs text-muted-foreground">
                    {attemptResults.passed
                      ? "You passed this part. You can retake the quiz below if allowed."
                      : `Score at least ${PASS_MARK}% to pass. Review the video and try again.`}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  attemptResults.passed
                    ? "bg-emerald-500/10 text-emerald-600 border-0"
                    : "bg-destructive/10 text-destructive border-0"
                }
              >
                {attemptResults.passed ? "Passed" : "Not passed"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Score
                </p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    attemptResults.passed ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {attemptResults.score ?? 0}%
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Correct
                </p>
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {attemptResults.correct ?? 0}
                  <span className="text-sm font-medium text-muted-foreground">
                    /{attemptResults.total ?? 0}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Points
                </p>
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  {attemptResults.earned ?? 0}
                  <span className="text-sm font-medium text-muted-foreground">
                    /{attemptResults.possible ?? 0}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  Pass mark
                </p>
                <p className="text-2xl font-bold tabular-nums text-muted-foreground/50">
                  {PASS_MARK}%
                </p>
              </div>
            </div>

            {attemptResults.watch && (
              <div className="rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    Video watch progress
                  </div>
                  {attemptResults.watch.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">In progress</span>
                  )}
                </div>
                <Progress value={attemptResults.watch.watchPercent ?? 0} className="h-2 mb-2" />
                <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                  <span className="tabular-nums">{attemptResults.watch.watchPercent ?? 0}% watched</span>
                  <span className="tabular-nums">
                    {formatWatchTime(attemptResults.watch.watchedSeconds)} watched
                  </span>
                </div>
              </div>
            )}

            {!attemptResults.passed && (
              <p className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                {partData?.maxRetries > 0
                  ? `Up to ${partData.maxRetries} retr${partData.maxRetries > 1 ? "ies" : "y"} allowed for this part.`
                  : "Unlimited retries allowed for this part."}
              </p>
            )}
          </CardContent>
        </Card>
      )}

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
            {questions?.map((q, i) => {
              const qId = getQuestionId(q);
              return (
              <button
                key={qId}
                onClick={() => setCurrentQIndex(i)}
                className={`w-9 h-9 rounded-lg font-medium text-xs transition-all duration-200 ${
                  i === currentQIndex
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110"
                    : answers[qId] !== undefined
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            );
            })}
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
              const isSelected = answers[currentQId] === i;
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={i}
                  onClick={() => setAnswers({ ...answers, [currentQId]: i })}
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
