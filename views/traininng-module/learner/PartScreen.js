"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  getMyProgressForModule,
  getPartById,
  startWatchingVideo,
  updateVideoProgress,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import _ from "lodash";

export default function PartScreen({ partId, moduleId }) {
  const hasCalledApi = useRef(false);
  const playerRef = useRef(null);
  const seekingRef = useRef(false); // use ref instead of state to avoid stale closure in handlers

  const [partData, setPartData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [playerState, setPlayerState] = useState({
    played: 0,
    loaded: 0,
    playedSeconds: 0,
    duration: 0,
  });

  const router = useRouter();

  // ── Data fetching ──────────────────────────────────────────────
  const getPartData = async () => {
    const res = await getPartById(partId);
    // console.log("partData", res.data);
    setPartData(res.data);
  };

  console.log("progressData", progressData);
  const getProgressData = async () => {
    const res = await getMyProgressForModule(moduleId);
    // console.log("progressData", res.data);
    setProgressData(res.data);
  };

  useEffect(() => {
    if (progressData) {
      handleReady();
    }
  }, []); // for debugging - remove in production
  useEffect(() => {
    getPartData();
  }, [partId]);
  useEffect(() => {
    getProgressData();
  }, [moduleId]);

  // ── Player ref (useCallback pattern from docs) ─────────────────
  const setPlayerRef = useCallback((player) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  // ── Player event handlers ──────────────────────────────────────
  const handleStartWatchingVideo = async () => {
    if (progressData && progressData.status === "started") {
      return;
    } else {
      const res = await startWatchingVideo(moduleId);
      console.log("startWatchingVideo res", res);
    }
  };

  // Fires when buffer advances — tracks how much is loaded
  const handleProgress = async () => {
    const player = playerRef.current;
    if (!player) return;

    const watchedSeconds = player.currentTime;

    const payload = {
      partId,
      watchedSeconds,
      durationSec: partData?.video?.durationSec,
    };
    console.log("handleProgress — updateVideoProgress payload", payload);
    const res = await updateVideoProgress(moduleId, payload);
  };

  const handleDebouncedProgressUpdate = _.debounce(handleProgress, 3000);

  // On pause, send the current playedSeconds to the API
  const handlePause = async () => {
    handleProgress();
  };

  const handleEnded = async () => {
    const player = playerRef.current;
    if (!player) return;

    // Send final progress when video finishes
    const payload = {
      partId,
      watchedSeconds: player.duration,
      durationSec: partData?.video?.durationSec,
    };
    console.log("onEnded — updateVideoProgress payload", payload);
    const res = await updateVideoProgress(moduleId, payload);
    console.log("updateVideoProgress res", res);
  };

  const handleReady = () => {
    const player = playerRef.current;
    if (!player || !progressData) return;
    const lastWatched =
      progressData?.watchRecords?.find((itm) => itm.part === partId)?.watchedSeconds || 0;
    console.log("laswatched", lastWatched);
    if (lastWatched && lastWatched > 0) {
      player.currentTime = lastWatched;
      // console.log("Resumed from", lastWatched, "seconds");
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Parts
      </Button>

      <div className="">
        <Badge variant="secondary" className="border-0">
          Part {partData?.index + 1} of {partData?.module?.parts?.length}
        </Badge>
        <h1 className="text-2xl font-bold text-foreground mb-1">{partData?.title}</h1>
        <p className="text-muted-foreground text-sm">Watch the video to unlock the quiz</p>
      </div>

      <Card className="overflow-hidden shadow-xl border-0 mb-6">
        <div className="aspect-video bg-secondary/80 relative">
          <ReactPlayer
            ref={setPlayerRef}
            src={partData?.video?.url}
            onReady={handleReady}
            style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
            onStart={handleStartWatchingVideo}
            // onTimeUpdate={handleTimeUpdate}
            onProgress={handleDebouncedProgressUpdate}
            // onDurationChange={handleDurationChange}
            // onSeeking={handleSeeking}
            // onSeeked={handleSeeked}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={(e) => console.log("onError", e)}
            controls={true}
          />
        </div>

        <CardContent className="pt-5 pb-5">
          {/* Debug: played fraction — remove in production */}
          <div className="text-xs text-muted-foreground">
            Progress: {(playerState.played * 100).toFixed(1)}% |{" "}
            <Progress value={(playerState.played * 100).toFixed(1)} />
            {playerState.playedSeconds.toFixed(0)}s / {playerState.duration.toFixed(0)}s
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
