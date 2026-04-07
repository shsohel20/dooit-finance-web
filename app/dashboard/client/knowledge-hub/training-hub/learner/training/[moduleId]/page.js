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
import { getModuleById } from "../../../actions";
import PartScreen from "@/views/traininng-module/learner/PartScreen";
import QuizScreen from "@/views/traininng-module/learner/QuizScreen";

export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const [partData, setPartData] = useState(null);
  const user = { id: "1", role: "learner", name: "John Doe" };
  const { getLearnerProgress, recordAttempt, completeModule } = useModules();

  const moduleId = params.moduleId;
  const [moduleData, setModuleData] = useState(null);
  // const moduleData = getModuleById(moduleId);
  const progress = getLearnerProgress(user?.id || "", moduleId);

  useEffect(() => {
    const fetchModuleData = async () => {
      const res = await getModuleById(moduleId);
      setModuleData(res?.data || null);
    };
    fetchModuleData();
  }, [moduleId]);

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

    console.log("moduleData", moduleData);
    return (
      // <MainLayout>
      <div className="max-w-6xl mx-auto  w-full">
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
              <h1 className="text-3xl font-bold text-foreground mb-2 text-balance tracking-tighter">
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
                            router.push(
                              `/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}/part/${part.id}`,
                            );
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
      <PartScreen
        setPhase={setPhase}
        activePartIndex={activePartIndex}
        totalParts={totalParts}
        activePart={activePart}
        videoRef={videoRef}
        setWatchPercent={setWatchPercent}
        setVideoReady={setVideoReady}
        startQuiz={startQuiz}
        partData={partData}
        setPartData={setPartData}
      />
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
      <QuizScreen
        activePart={activePart}
        currentQIndex={currentQIndex}
        answers={answers}
        setCurrentQIndex={setCurrentQIndex}
        setPhase={setPhase}
        activePartIndex={activePartIndex}
        partData={partData}
        // setPartData={setPartData}
      />
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
