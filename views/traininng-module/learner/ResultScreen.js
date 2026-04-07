"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Trophy, RotateCcw, LayoutDashboard, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PASS_MARK = 70;

export default function ResultScreen({ result }) {
  const router = useRouter();
  const { passed, partScore, overallScore, results = [] } = result ?? {};

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Status banner */}
      <div
        className={`h-1.5 rounded-t-2xl ${
          passed
            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
            : "bg-gradient-to-r from-destructive to-orange-400"
        }`}
      />

      <Card className="rounded-t-none shadow-2xl border-0">
        <CardContent className="pt-10 pb-10 px-8">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                passed
                  ? "bg-emerald-500/10"
                  : "bg-destructive/10"
              }`}
            >
              {passed ? (
                <Trophy className="w-10 h-10 text-emerald-500" />
              ) : (
                <XCircle className="w-10 h-10 text-destructive" />
              )}
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <span
              className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${
                passed
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {passed ? "Part Passed" : "Not Passed"}
            </span>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {passed ? "Well done!" : "Keep going!"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {passed
                ? "You passed this part. You can move on to the next one."
                : `You need at least ${PASS_MARK}% to pass. Review the video and retry.`}
            </p>
          </div>

          {/* Score stats */}
          <div className="bg-muted/50 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-center gap-10 mb-5">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Your Score
                </p>
                <p
                  className={`text-5xl font-bold tabular-nums ${
                    passed ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {partScore}%
                </p>
              </div>
              <div className="w-px h-14 bg-border" />
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Pass Mark
                </p>
                <p className="text-5xl font-bold tabular-nums text-muted-foreground/40">
                  {PASS_MARK}%
                </p>
              </div>
            </div>

            {/* Score bar */}
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              {/* Pass mark line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/30 z-10"
                style={{ left: `${PASS_MARK}%` }}
              />
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  passed
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "bg-gradient-to-r from-destructive to-orange-400"
                }`}
                style={{ width: `${partScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>0%</span>
              <span className="font-medium">{PASS_MARK}% to pass</span>
              <span>100%</span>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Question Breakdown — {correctCount}/{totalCount} correct
            </p>
            <div className="grid grid-cols-2 gap-2">
              {results.map((r, i) => (
                <div
                  key={r.questionId}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                    r.isCorrect
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-destructive/20 bg-destructive/5"
                  }`}
                >
                  {r.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">Question {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      Answered: <span className="font-medium">{r.selectedAnswer}</span>
                      {r.pointsEarned > 0 && (
                        <span className="ml-1 text-emerald-600">+{r.pointsEarned}pt</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall score pill */}
          {overallScore !== undefined && (
            <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3 mb-6 text-sm">
              <span className="text-muted-foreground font-medium">Overall Module Score</span>
              <span className="font-bold text-foreground tabular-nums">{overallScore}%</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {!passed && (
              <Button
                onClick={() => router.back()}
                className="w-full h-11 gap-2"
                size="lg"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </Button>
            )}
            <Button
              onClick={() =>
                router.push("/dashboard/client/knowledge-hub/training-hub/learner/dashboard")
              }
              variant={passed ? "default" : "outline"}
              className={`w-full h-11 gap-2 ${!passed ? "bg-transparent" : ""}`}
              size="lg"
            >
              <LayoutDashboard className="w-4 h-4" />
              Back to Dashboard
            </Button>
            {passed && (
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full h-11 gap-2 bg-transparent"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Module
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
