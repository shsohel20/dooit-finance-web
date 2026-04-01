"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getPartById } from "@/app/dashboard/client/knowledge-hub/training-hub/actions";

export default function PartScreen({
  setPhase,
  activePartIndex,
  totalParts,
  activePart,
  // videoRef,
  setWatchPercent,
  setVideoReady,
  watchPercent,
  canTakeQuiz,
  startQuiz,
  partData,
  setPartData,
}) {
  const videoRef = useRef(null);

  const getPartData = async () => {
    const res = await getPartById(activePart?._id);
    console.log("partData", res.data);
    setPartData(res.data);
  };

  useEffect(() => {
    getPartData();
  }, [activePart._id]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0) {
        setWatchPercent(Math.round((currentTime / duration) * 100));
      }
    }
  };

  return (
    // <MainLayout>
    <div className="py-6">
      {/* Breadcrumb */}
      <Button
        variant="ghost"
        onClick={() => setPhase("overview")}
        className="gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Parts
      </Button>

      <div className="">
        <Badge variant="secondary" className=" border-0">
          Part {activePartIndex + 1} of {totalParts}
        </Badge>
        <h1 className="text-2xl font-bold text-foreground mb-1">{partData?.title}</h1>
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
              <p className="text-xs text-muted-foreground">Watch at least 80% to unlock the quiz</p>
            )}
          </div>

          {/* Take Quiz Button */}
          <Button
            className="w-full h-12 text-base gap-2"
            onClick={startQuiz}
            // disabled={!canTakeQuiz}
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
