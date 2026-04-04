import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Sparkles, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ResultScreen({ result }) {
  const router = useRouter();

  if (activePart && partScore !== null) {
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
}
