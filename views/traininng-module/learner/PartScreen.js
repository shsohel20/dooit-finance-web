"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  getMyProgressForModule,
  getPartById,
  startWatchingVideo,
  updateVideoProgress,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";

export default function PartScreen({ partId, moduleId }) {
  const hasCalledApi = useRef(false);
  const [partData, setPartData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const router = useRouter();
  const progressRef = useRef(0);
  const getPartData = async () => {
    const res = await getPartById(partId);
    console.log("partData", res.data);
    setPartData(res.data);
  };

  useEffect(() => {
    getPartData();
  }, [partId]);

  const getProgressData = async () => {
    const res = await getMyProgressForModule(moduleId);
    console.log("progressData", res.data);
    setProgressData(res.data);
  };

  const handleStartWatchingVideo = async () => {
    if (!hasCalledApi.current) {
      hasCalledApi.current = true;
      const res = await startWatchingVideo(moduleId);
      console.log("res", res);
    }
  };

  useEffect(() => {
    getProgressData();
  }, [moduleId]);

  const updateWatchingProgress = async (playedSeconds) => {
    const payload = {
      partId: partId,
      watchedSeconds: playedSeconds,
      durationSec: partData?.video?.durationSec,
    };
    console.log("payload", payload);

    // const res = await updateVideoProgress(moduleId, payload);
    // console.log("res", res);
  };

  return (
    // <MainLayout>
    <div className="py-6">
      {/* Breadcrumb */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Parts
      </Button>

      <div className="">
        <Badge variant="secondary" className=" border-0">
          Part {partData?.index + 1} of {partData?.module?.parts?.length}
        </Badge>
        <h1 className="text-2xl font-bold text-foreground mb-1">{partData?.title}</h1>
        <p className="text-muted-foreground text-sm">Watch the video to unlock the quiz</p>
      </div>

      {/* Video Card */}
      <Card className="overflow-hidden shadow-xl border-0 mb-6">
        <div className="aspect-video bg-secondary/80 relative">
          <ReactPlayer
            src={partData?.video?.url}
            style={{ width: "100%", height: "auto", aspectRatio: "16/9", "--controls": "none" }}
            onStart={handleStartWatchingVideo}
            // onProgress={(data) => {
            //   console.log("playedSeconds", data);
            //   progressRef.current = data?.timeStamp;
            // }}
            onProgress={(state) => {
              console.log("state", state);
            }}
            onPause={(data) => {
              console.log("data", data);
              updateWatchingProgress(progressRef.current); // update on pause
            }}
          />
          {/* <video
            ref={videoRef}
            src={activePart.videoUrl}
            className="w-full h-full object-cover"
            controls
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={() => setVideoReady(true)}
            crossOrigin="anonymous"
          /> */}
        </div>

        <CardContent className="pt-5 pb-5">
          {/* Progress */}
          {/* <div className="space-y-2 mb-5">
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
          </div> */}

          {/* Take Quiz Button */}
          {/* <Button
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
          </Button> */}
        </CardContent>
      </Card>
    </div>
    // </MainLayout>
  );
}
