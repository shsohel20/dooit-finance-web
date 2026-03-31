"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useModules } from "@/contexts/module-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Lock,
  CheckCircle2,
  Video,
  HelpCircle,
  BookOpen,
  Trophy,
  Sparkles,
} from "lucide-react";

export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const user = { id: "1", role: "learner", name: "John Doe" };
  const { getModuleById, getLearnerProgress, recordAttempt, completeModule } = useModules();

  const moduleId = params.moduleId;
  const moduleData = getModuleById(moduleId);
  const progress = getLearnerProgress(user?.id || "", moduleId);

  const [phase, setPhase] = useState("overview");
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [watchPercent, setWatchPercent] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  // Quiz state - per-part only
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [partScore, setPartScore] = useState(null);
  const [partPassed, setPartPassed] = useState(false);

  const videoRef = useRef(null);

  // Track which parts are completed in this session
  const [completedParts, setCompletedParts] = useState(new Set());

  // Determine which parts are already completed from progress
  useEffect(() => {
    if (progress && moduleData) {
      const done = new Set();
      moduleData.parts.forEach((part, idx) => {
        const partAttempts = progress.attempts.filter((a) => a.partId === part.id);
        if (partAttempts.length >= part.questions.length) {
          const correct = partAttempts.filter((a) => a.isCorrect).length;
          const score = (correct / part.questions.length) * 100;
          if (score >= 70) {
            done.add(idx);
          }
        }
      });
      setCompletedParts(done);
      // Set active part to first incomplete
      const firstIncomplete = moduleData.parts.findIndex((_, i) => !done.has(i));
      if (firstIncomplete >= 0) setActivePartIndex(firstIncomplete);
    }
  }, []);

  if (!user || !moduleData) {
    return (
      // <MainLayout>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">Module Not Found</p>
        <Button
          onClick={() =>
            router.push("/dashboard/client/knowledge-hub/training-hub/learner/dashboard")
          }
          className="gap-2 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
      // </MainLayout>
    );
  }

  const activePart = moduleData.parts[activePartIndex];
  const totalParts = moduleData.parts.length;
  const overallProgress = totalParts > 0 ? Math.round((completedParts.size / totalParts) * 100) : 0;

  const isPartUnlocked = (idx) => {
    if (idx === 0) return true;
    return completedParts.has(idx - 1);
  };

  // --- Video tracking ---
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) {
        setWatchPercent(Math.round((currentTime / duration) * 100));
      }
    }
  };

  const canTakeQuiz = watchPercent >= 80;

  // --- Quiz Logic ---
  const startQuiz = () => {
    setPhase("quiz");
    setCurrentQIndex(0);
    setAnswers({});
    setPartScore(null);
    setPartPassed(false);
  };

  const submitPartQuiz = () => {
    if (!activePart || !user) return;

    // Record attempts
    activePart.questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        recordAttempt(user.id, moduleId, activePart.id, q.id, answers[q.id]);
      }
    });

    // Calculate score
    const correct = activePart.questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / activePart.questions.length) * 100);
    const passed = score >= 70;

    setPartScore(score);
    setPartPassed(passed);

    if (passed) {
      const newCompleted = new Set(completedParts);
      newCompleted.add(activePartIndex);
      setCompletedParts(newCompleted);

      // If all parts complete, complete the whole module
      if (newCompleted.size === totalParts) {
        completeModule(user.id, moduleId);
      }
    }

    setPhase("part-result");
  };

  const goToNextPart = () => {
    if (activePartIndex < totalParts - 1) {
      setActivePartIndex(activePartIndex + 1);
      setWatchPercent(0);
      setVideoReady(false);
      setPhase("video");
    }
  };

  // --- OVERVIEW PHASE ---
  if (phase === "overview") {
    const allDone = completedParts.size === totalParts;

    return (
      // <MainLayout>
      <div className="max-w-6xl mx-auto py-6 w-full">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() =>
            router.push("/dashboard/client/knowledge-hub/training-hub/learner/dashboard")
          }
          className="gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
                {moduleData.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">{moduleData.description}</p>
            </div>
            {allDone && (
              <Badge className="bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] border-0 gap-1.5 px-3 py-1.5 flex-shrink-0">
                <Trophy className="w-4 h-4" />
                Completed
              </Badge>
            )}
          </div>

          {/* Overall Progress */}
          <div className="mt-6 bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Module Progress</span>
              <span className="text-sm font-semibold text-primary">
                {completedParts.size} / {totalParts} parts
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </div>

        {/* Parts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Training Parts</h2>

          {moduleData.parts.map((part, idx) => {
            const unlocked = isPartUnlocked(idx);
            const done = completedParts.has(idx);

            return (
              <Card
                key={part.id}
                className={`overflow-hidden transition-all duration-300 ${
                  done
                    ? "border-[hsl(142,71%,45%)]/20 bg-[hsl(142,71%,45%)]/[0.02]"
                    : unlocked
                      ? "border-primary/20 hover:shadow-lg hover:border-primary/40 cursor-pointer"
                      : "opacity-60 border-border"
                }`}
              >
                <div
                  className={`h-1 ${
                    done
                      ? "bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)]"
                      : unlocked
                        ? "bg-gradient-to-r from-primary to-primary/60"
                        : "bg-muted"
                  }`}
                />
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-5">
                    {/* Part Number */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${
                        done
                          ? "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)]"
                          : unlocked
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-7 h-7" /> : idx + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Part {idx + 1} of {totalParts}
                        </p>
                        {done && (
                          <Badge className="bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] border-0 text-[10px] px-2 py-0">
                            Passed
                          </Badge>
                        )}
                        {!unlocked && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0 gap-1 border-0"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-foreground truncate">
                        {part.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </span>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> {part.questions.length} question
                          {part.questions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {done ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActivePartIndex(idx);
                            setWatchPercent(0);
                            setVideoReady(false);
                            setPhase("video");
                          }}
                          className="gap-2 bg-transparent"
                        >
                          Review
                        </Button>
                      ) : unlocked ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setActivePartIndex(idx);
                            setWatchPercent(0);
                            setVideoReady(false);
                            setPhase("video");
                          }}
                          className="gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {completedParts.size > 0 &&
                          idx === [...completedParts].sort((a, b) => b - a)[0] + 1
                            ? "Start"
                            : "Begin"}
                        </Button>
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground/50" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      // </MainLayout>
    );
  }

  // --- VIDEO PHASE ---
  if (phase === "video" && activePart) {
    return (
      // <MainLayout>
      <div className="max-w-4xl mx-auto py-6">
        {/* Breadcrumb */}
        <Button
          variant="ghost"
          onClick={() => setPhase("overview")}
          className="gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Parts
        </Button>

        <div className="mb-6">
          <Badge variant="secondary" className="mb-3 border-0">
            Part {activePartIndex + 1} of {totalParts}
          </Badge>
          <h1 className="text-2xl font-bold text-foreground mb-1">{activePart.title}</h1>
          <p className="text-muted-foreground text-sm">Watch the video to unlock the quiz</p>
        </div>

        {/* Video Card */}
        <Card className="overflow-hidden shadow-xl border-0 mb-6">
          <div className="aspect-video bg-secondary/80 relative">
            <video
              ref={videoRef}
              src={activePart.videoUrl}
              className="w-full h-full object-cover"
              controls
              onTimeUpdate={handleTimeUpdate}
              onLoadedData={() => setVideoReady(true)}
              crossOrigin="anonymous"
            />
          </div>

          <CardContent className="pt-5 pb-5">
            {/* Progress */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Video Progress</span>
                <Badge
                  className={`border-0 text-xs ${
                    watchPercent >= 80
                      ? "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)]"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {watchPercent}% Watched
                </Badge>
              </div>
              <Progress value={watchPercent} className="h-2.5" />
              {watchPercent < 80 && (
                <p className="text-xs text-muted-foreground">
                  Watch at least 80% to unlock the quiz
                </p>
              )}
            </div>

            {/* Take Quiz Button */}
            <Button
              className="w-full h-12 text-base gap-2"
              onClick={startQuiz}
              disabled={!canTakeQuiz}
            >
              {canTakeQuiz ? (
                <>
                  <HelpCircle className="w-5 h-5" />
                  Take Quiz ({activePart.questions.length} question
                  {activePart.questions.length !== 1 ? "s" : ""})
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Watch Video to Unlock Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      // </MainLayout>
    );
  }

  // --- QUIZ PHASE (per-part) ---
  if (phase === "quiz" && activePart) {
    const questions = activePart.questions;
    const currentQ = questions[currentQIndex];
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === questions.length;
    const qProgressPercent = Math.round(((currentQIndex + 1) / questions.length) * 100);

    const options = currentQ.type === "true-false" ? ["True", "False"] : currentQ.options || [];

    return (
      // <MainLayout>
      <div className="max-w-6xl w-full mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setPhase("video")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Video
          </Button>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            Part {activePartIndex + 1} Quiz
          </Badge>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1">{activePart.title}</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Answer all questions to complete this part
        </p>

        {/* Progress */}
        <Card className="mb-6 border-primary/10 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-primary">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <Progress value={qProgressPercent} className="h-2 mb-4" />
            <div className="flex gap-1.5 flex-wrap">
              {questions.map((q, i) => (
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
                Question {currentQIndex + 1} of {questions.length}
              </Badge>
              {currentQ.type === "true-false" && (
                <Badge variant="secondary" className="border-0">
                  True / False
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-3">
              {options.map((option, i) => {
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
                      {option}
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

          {currentQIndex < questions.length - 1 ? (
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

        {!allAnswered && currentQIndex === questions.length - 1 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Answer all {questions.length - answeredCount} remaining question
            {questions.length - answeredCount > 1 ? "s" : ""} to submit
          </p>
        )}
      </div>
      // </MainLayout>
    );
  }

  // --- PART RESULT PHASE ---
  if (phase === "part-result" && activePart && partScore !== null) {
    const isModuleComplete = completedParts.size === totalParts;
    const hasNextPart = activePartIndex < totalParts - 1;

    if (isModuleComplete) {
      // Show module complete screen
      return (
        // <MainLayout>
        <div className="max-w-xl mx-auto py-12">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="h-2 bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)]" />
            <CardContent className="pt-10 pb-10 px-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[hsl(142,71%,45%)]/20 to-[hsl(168,76%,42%)]/20">
                  <Trophy className="w-12 h-12 text-[hsl(142,71%,45%)]" />
                </div>
              </div>
              <div className="text-center mb-8">
                <Badge className="mb-4 text-sm px-4 py-1 bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] border-[hsl(142,71%,45%)]/20">
                  MODULE COMPLETE
                </Badge>
                <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
                  Congratulations!
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  You have completed all {totalParts} parts of <strong>{moduleData.title}</strong>.
                </p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Parts Completed
                    </p>
                    <p className="text-4xl font-bold text-[hsl(142,71%,45%)]">
                      {totalParts}/{totalParts}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Last Part Score
                    </p>
                    <p className="text-4xl font-bold text-[hsl(142,71%,45%)]">{partScore}%</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() =>
                  router.push("/dashboard/client/knowledge-hub/training-hub/learner/dashboard")
                }
                className="w-full h-12 text-base gap-2 bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)] hover:opacity-90"
                size="lg"
              >
                <Sparkles className="w-5 h-5" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
        // </MainLayout>
      );
    }

    // Individual part result
    return (
      // <MainLayout>
      <div className="max-w-4xl mx-auto py-12">
        <Card className="overflow-hidden shadow-2xl border-0">
          <div
            className={`h-2 ${
              partPassed
                ? "bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)]"
                : "bg-gradient-to-r from-destructive to-[hsl(38,92%,50%)]"
            }`}
          />
          <CardContent className="pt-10 pb-10 px-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  partPassed
                    ? "bg-gradient-to-br from-[hsl(142,71%,45%)]/20 to-[hsl(168,76%,42%)]/20"
                    : "bg-gradient-to-br from-destructive/20 to-[hsl(38,92%,50%)]/20"
                }`}
              >
                {partPassed ? (
                  <CheckCircle2 className="w-12 h-12 text-[hsl(142,71%,45%)]" />
                ) : (
                  <HelpCircle className="w-12 h-12 text-destructive" />
                )}
              </div>
            </div>

            <div className="text-center mb-8">
              <Badge
                className={`mb-4 text-sm px-4 py-1 ${
                  partPassed
                    ? "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] border-[hsl(142,71%,45%)]/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                {partPassed ? "PART PASSED" : "NOT PASSED"}
              </Badge>
              <h1 className="text-2xl font-bold text-foreground mb-2 text-balance">
                Part {activePartIndex + 1}: {activePart.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {partPassed
                  ? hasNextPart
                    ? "Well done! You can now proceed to the next part."
                    : "All parts completed!"
                  : "You need at least 70% to pass this part. Watch the video again and retry."}
              </p>
            </div>

            {/* Score */}
            <div className="bg-muted/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Your Score
                  </p>
                  <p
                    className={`text-5xl font-bold ${partPassed ? "text-[hsl(142,71%,45%)]" : "text-destructive"}`}
                  >
                    {partScore}%
                  </p>
                </div>
                <div className="w-px h-16 bg-border" />
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Pass Mark
                  </p>
                  <p className="text-5xl font-bold text-muted-foreground/60">70%</p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      partPassed
                        ? "bg-gradient-to-r from-[hsl(142,71%,45%)] to-[hsl(168,76%,42%)]"
                        : "bg-gradient-to-r from-destructive to-[hsl(38,92%,50%)]"
                    }`}
                    style={{ width: `${partScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span className="font-medium">70% to pass</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {partPassed && hasNextPart ? (
                <Button onClick={goToNextPart} className="w-full h-12 text-base gap-2" size="lg">
                  Next Part
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : !partPassed ? (
                <Button
                  onClick={() => {
                    setWatchPercent(0);
                    setVideoReady(false);
                    setPhase("video");
                  }}
                  className="w-full h-12 text-base gap-2"
                  size="lg"
                >
                  Retry Part
                </Button>
              ) : null}

              <Button
                onClick={() => setPhase("overview")}
                variant="outline"
                className="w-full h-12 text-base bg-transparent"
                size="lg"
              >
                Back to Overview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      // </MainLayout>
    );
  }

  return null;
}
