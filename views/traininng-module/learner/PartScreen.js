"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Lock,
  CheckCircle,
  Loader2,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getMyProgressForModule,
  getModuleById,
  getAllParts,
  getPartById,
  startWatchingVideo,
  updateVideoProgress,
} from "@/app/dashboard/client/knowledge-hub/training-hub/actions";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { cn } from "@/lib/utils";

const QUIZ_UNLOCK_THRESHOLD = 90;
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(secs) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getYoutubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

// Load YouTube IFrame API once globally
let _ytPromise = null;
function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.reject("ssr");
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (_ytPromise) return _ytPromise;
  _ytPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    // In case onYouTubeIframeAPIReady already fired
    if (window.YT?.Player) resolve(window.YT);
  });
  return _ytPromise;
}

export default function PartScreen({ partId, moduleId }) {
  const containerRef = useRef(null);
  const controlsTimer = useRef(null);
  const partDataRef = useRef(null);
  const flashCount = useRef(0);
  const didResume = useRef(false);

  // YouTube
  const ytDiv = useRef(null); // div YT replaces with iframe
  const ytPlayer = useRef(null); // YT.Player instance

  // Native video
  const videoRef = useRef(null);

  // Playback state (mirrors actual player state)
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // UI state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPct, setBufferedPct] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeed, setShowSpeed] = useState(false);
  const [centerFlash, setCenterFlash] = useState(null);

  // Data
  const [partData, setPartData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [allParts, setAllParts] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const router = useRouter();
  const videoUrl = partData?.video?.url;
  const youtubeId = getYoutubeId(videoUrl);
  const isYT = !!youtubeId;

  useEffect(() => {
    partDataRef.current = partData;
  }, [partData]);

  // ── Fetch part + progress ──────────────────────────────────────
  useEffect(() => {
    getPartById(partId).then((r) => setPartData(r.data));
  }, [partId]);

  useEffect(() => {
    getMyProgressForModule(moduleId).then((r) => {
      if (!r.data) return;
      setProgressData(r.data);
      if (r.data.status === "started") setHasStarted(true);
      const rec = r.data.watchRecords?.find((x) => x.part === partId);
      if (rec) setWatchedPercent(rec.watchPercent || 0);
    });
  }, [moduleId, partId]);

  useEffect(() => {
    getModuleById(moduleId).then((r) => {
      if (r?.data) setModuleData(r.data);
    });
    getAllParts(moduleId).then((r) => {
      if (r?.data) setAllParts(r.data);
    });
  }, [moduleId]);

  // ── Resume to last position (runs once when both ready + progress loaded) ──
  useEffect(() => {
    if (!isReady || !progressData || didResume.current) return;
    const rec = progressData.watchRecords?.find((x) => x.part === partId);
    const secs = rec?.watchedSeconds || 0;
    if (secs > 0) {
      if (isYT) ytPlayer.current?.seekTo(secs, true);
      else if (videoRef.current) videoRef.current.currentTime = secs;
    }
    didResume.current = true;
  }, [isReady, progressData, partId, isYT]);

  // ── Local real-time watched % (max position reached) ─────────
  useEffect(() => {
    if (!duration || !currentTime) return;
    const pct = Math.min(Math.floor((currentTime / duration) * 100), 100);
    setWatchedPercent((prev) => Math.max(prev, pct));
  }, [currentTime, duration]);

  // ── Progress update ────────────────────────────────────────────
  const sendProgress = useCallback(
    async (secs) => {
      const pData = partDataRef.current;
      if (!pData) return;
      const watched =
        secs ?? (isYT ? ytPlayer.current?.getCurrentTime?.() : videoRef.current?.currentTime) ?? 0;
      const res = await updateVideoProgress(moduleId, {
        partId,
        watchedSeconds: watched,
        durationSec: pData?.video?.durationSec,
      });
      if (res?.data) {
        const dur =
          duration || (isYT ? ytPlayer.current?.getDuration?.() : videoRef.current?.duration) || 0;
        if (dur)
          setWatchedPercent(Math.min(Math.floor((res.data.watchedSeconds / dur) * 100), 100));
      }
    },
    [moduleId, partId, duration, isYT],
  );

  const debouncedProgress = useRef(
    _.throttle((s) => sendProgress(s), 5000, { leading: false, trailing: true }),
  ).current;

  // ── YouTube IFrame API setup ──────────────────────────────────
  useEffect(() => {
    if (!youtubeId) return;
    let destroyed = false;

    loadYouTubeApi()
      .then((YT) => {
        if (destroyed || !ytDiv.current) return;

        const player = new YT.Player(ytDiv.current, {
          videoId: youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            controls: 0,
            disablekb: 1,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            fs: 0,
            playsinline: 1,
          },
          events: {
            onReady(e) {
              if (destroyed) return;
              ytPlayer.current = e.target;
              setDuration(e.target.getDuration() || 0);
              setIsReady(true);
            },
            onStateChange(e) {
              if (destroyed) return;
              const S = YT.PlayerState;
              if (e.data === S.PLAYING) {
                setPlaying(true);
                setIsBuffering(false);
              }
              if (e.data === S.PAUSED) {
                setPlaying(false);
                setIsBuffering(false);
                sendProgress();
              }
              if (e.data === S.BUFFERING) {
                setIsBuffering(true);
              }
              if (e.data === S.ENDED) {
                setPlaying(false);
                setIsBuffering(false);
                sendProgress(ytPlayer.current?.getDuration?.());
                // setIsBuffering(false);
              }
            },
          },
        });

        ytPlayer.current = player;
      })
      .catch(() => {});

    return () => {
      destroyed = true;
      try {
        ytPlayer.current?.destroy();
      } catch {
        /* ignore */
      }
      ytPlayer.current = null;
    };
  }, [youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── YouTube progress polling ──────────────────────────────────
  useEffect(() => {
    if (!isYT || !isReady || !playing) return;
    const id = setInterval(() => {
      const p = ytPlayer.current;
      if (!p) return;
      const cur = p.getCurrentTime?.() ?? 0;
      const dur = p.getDuration?.() ?? 0;
      setCurrentTime(cur);
      if (dur && dur !== duration) setDuration(dur);
      debouncedProgress(cur);
    }, 1000);
    return () => clearInterval(id);
  }, [isYT, isReady, playing, duration, debouncedProgress]);

  // ── Native video event handlers ──────────────────────────────
  const onNativeLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    setIsReady(true);
  };
  const onNativeTime = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0)
      setBufferedPct((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    debouncedProgress(v.currentTime);
  };
  const onNativePlay = async () => {
    setPlaying(true);
    setIsBuffering(false);
    if (!hasStarted) {
      await startWatchingVideo(moduleId);
      setHasStarted(true);
    }
  };
  const onNativePause = () => {
    setPlaying(false);
    sendProgress();
  };
  const onNativeEnded = () => {
    setPlaying(false);
    sendProgress(duration);
  };

  // ── Flash center icon ─────────────────────────────────────────
  const flashCenter = useCallback((type) => {
    flashCount.current += 1;
    setCenterFlash({ type, id: flashCount.current });
    setTimeout(() => setCenterFlash(null), 600);
  }, []);

  // ── Toggle play — directly drives the player, no prop indirection ──
  const togglePlay = useCallback(async () => {
    if (!isReady) return;
    if (isYT) {
      const p = ytPlayer.current;
      if (!p) return;
      if (playing) {
        p.pauseVideo();
        flashCenter("pause");
      } else {
        p.playVideo();
        flashCenter("play");
        if (!hasStarted) {
          startWatchingVideo(moduleId);
          setHasStarted(true);
        }
      }
    } else {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => {});
        flashCenter("play");
      } else {
        v.pause();
        flashCenter("pause");
      }
    }
  }, [isReady, isYT, playing, flashCenter, hasStarted, moduleId]);

  const skip = useCallback(
    (secs) => {
      if (isYT) {
        const p = ytPlayer.current;
        if (!p) return;
        const next = Math.max(0, Math.min((p.getCurrentTime() ?? 0) + secs, p.getDuration() ?? 0));
        p.seekTo(next, true);
        setCurrentTime(next);
      } else {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.max(0, Math.min(v.currentTime + secs, v.duration));
        setCurrentTime(v.currentTime);
      }
      flashCenter(secs > 0 ? "forward" : "backward");
      sendProgress();
    },
    [isYT, flashCenter, sendProgress],
  );

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = pct * duration;
    if (isYT) ytPlayer.current?.seekTo(t, true);
    else if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
    sendProgress(t);
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (isYT) {
      ytPlayer.current?.setVolume(v * 100);
      v === 0 ? ytPlayer.current?.mute() : ytPlayer.current?.unMute();
    } else if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
    }
  };

  const toggleMute = useCallback(() => {
    if (isYT) {
      const muted = ytPlayer.current?.isMuted?.();
      muted ? ytPlayer.current.unMute() : ytPlayer.current?.mute();
      setIsMuted(!muted);
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, [isYT]);

  const setSpeed = (s) => {
    setPlaybackRate(s);
    setShowSpeed(false);
    if (isYT) ytPlayer.current?.setPlaybackRate(s);
    else if (videoRef.current) videoRef.current.playbackRate = s;
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }, []);

  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  // Auto-hide controls
  const resetTimer = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    if (playing)
      controlsTimer.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeed(false);
      }, 3000);
  };
  useEffect(() => {
    if (!playing) {
      setShowControls(true);
      clearTimeout(controlsTimer.current);
    }
    return () => clearTimeout(controlsTimer.current);
  }, [playing]);

  // Keyboard shortcuts
  useEffect(() => {
    const fn = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        skip(10);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        skip(-10);
      }
      if (e.key === "m") toggleMute();
      if (e.key === "f") toggleFullscreen();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [togglePlay, skip, toggleMute, toggleFullscreen]);

  // ── Derived ───────────────────────────────────────────────────
  const quizUnlocked = watchedPercent >= QUIZ_UNLOCK_THRESHOLD;
  const playedPct = duration ? (currentTime / duration) * 100 : 0;
  const RING_R = 34;
  const RING_CIRC = 2 * Math.PI * RING_R;
  const ringOffset = RING_CIRC - (watchedPercent / 100) * RING_CIRC;
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const goToQuiz = () =>
    router.push(
      `/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}/part/${partId}/quiz`,
    );

  const goToPart = (pid) =>
    router.push(
      `/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}/part/${pid}`,
    );

  const goToMain = () =>
    router.push(`/dashboard/client/knowledge-hub/training-hub/learner/training/${moduleId}`);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="w-full min-w-0 overflow-x-hidden flex flex-col xl:flex-row gap-6 pb-10 items-start">
      {/* ───────── MAIN CONTENT ───────── */}
      <div className="flex-1 min-w-0 overflow-hidden space-y-5">
        {/* ───────── PLAYER ───────── */}
        <div
          ref={containerRef}
          className="relative w-full max-w-full rounded-2xl overflow-hidden select-none"
          style={{
            aspectRatio: "16/9",
            maxHeight: "calc(90vh - 180px)",
            // boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px -12px rgba(0,0,0,0.5)",
          }}
          onMouseMove={resetTimer}
          onMouseLeave={() => playing && setShowControls(false)}
        >
          {/* YouTube — YT API replaces this div with an iframe */}
          {isYT && (
            <div
              ref={ytDiv}
              className="absolute inset-0 w-full h-full"
              style={{ maxWidth: "100%", overflow: "hidden" }}
            />
          )}

          {/* Native video */}
          {!isYT && videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-contain"
              onLoadedMetadata={onNativeLoaded}
              onTimeUpdate={onNativeTime}
              onPlay={onNativePlay}
              onPause={onNativePause}
              onEnded={onNativeEnded}
              onWaiting={() => setIsBuffering(true)}
              onCanPlay={() => setIsBuffering(false)}
              onSeeked={() => sendProgress()}
              preload="metadata"
              playsInline
            />
          )}

          {/* Loading skeleton */}
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <Loader2 className="w-10 h-10 text-white/30 animate-spin" />
              <span className="text-white text-xs tracking-wide">Loading video…</span>
            </div>
          )}

          {/* Buffering spinner */}
          {isBuffering && isReady && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-black/40 rounded-full p-3 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-white/80 animate-spin" />
              </div>
            </div>
          )}

          {/* Center click flash */}
          {centerFlash && (
            <div
              key={centerFlash.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div
                className="bg-black/50 rounded-full p-5 animate-ping"
                style={{ animationIterationCount: 1, animationDuration: "0.55s" }}
              >
                {centerFlash.type === "play" && <Play className="w-9 h-9 text-white fill-white" />}
                {centerFlash.type === "pause" && (
                  <Pause className="w-9 h-9 text-white fill-white" />
                )}
                {centerFlash.type === "forward" && (
                  <div className="flex items-center gap-1 text-white font-bold text-sm">
                    <SkipForward className="w-8 h-8 fill-white" />
                    +10s
                  </div>
                )}
                {centerFlash.type === "backward" && (
                  <div className="flex items-center gap-1 text-white font-bold text-sm">
                    <SkipBack className="w-8 h-8 fill-white" />
                    -10s
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Always-on click overlay */}
          <div className="absolute inset-0 z-10" onClick={togglePlay} />

          {/* Watched badge (top-right) */}
          <div
            className={cn(
              "absolute top-3 right-3 z-30 transition-all duration-300",
              showControls
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border",
                quizUnlocked
                  ? "bg-emerald-500/80 text-white border-emerald-400/40"
                  : "bg-black/60 text-white/90 border-white/10",
              )}
            >
              {quizUnlocked ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              {watchedPercent}% watched
            </div>
          </div>

          {/* Controls overlay */}
          <div
            className={cn(
              "absolute inset-0 z-20 transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
            onClick={togglePlay}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/5 to-transparent pointer-events-none" />

            {/* Controls panel */}
            <div
              className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-12 space-y-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Seek bar */}
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-xs font-mono tabular-nums shrink-0 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="relative flex-1 h-1 rounded-full cursor-pointer group/seek hover:h-1.5 transition-all duration-150"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  onClick={handleSeek}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${bufferedPct}%`, backgroundColor: "rgba(255,255,255,0.2)" }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-150"
                    style={{ width: `${playedPct}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `${playedPct}%` }}
                  />
                </div>
                <span className="text-white/40 text-xs font-mono tabular-nums shrink-0 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Button row */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => skip(-10)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Rewind 10s (←)"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="Play/Pause (Space)"
                >
                  {playing ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white" />
                  )}
                </button>
                <button
                  onClick={() => skip(10)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Skip 10s (→)"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1 ml-1 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <VolumeIcon className="w-5 h-5" />
                  </button>
                  <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-200">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolume}
                      className="w-20 h-1 cursor-pointer accent-white"
                    />
                  </div>
                </div>

                <div className="flex-1" />

                {/* Speed picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeed((v) => !v)}
                    className="px-2.5 py-1 text-white/70 hover:text-white text-xs font-bold hover:bg-white/10 rounded-lg transition-colors min-w-[36px]"
                  >
                    {playbackRate}×
                  </button>
                  {showSpeed && (
                    <div className="absolute bottom-full right-0 mb-2 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30 min-w-[120px]">
                      <p className="text-white/35 text-[10px] font-semibold uppercase tracking-widest px-3 pt-2.5 pb-1">
                        Playback Speed
                      </p>
                      {PLAYBACK_SPEEDS.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSpeed(s)}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 text-xs transition-colors",
                            playbackRate === s
                              ? "text-primary font-bold bg-primary/10"
                              : "text-white/70 hover:text-white hover:bg-white/8",
                          )}
                        >
                          <span>{s}×</span>
                          {s === 1 && <span className="text-white/30 text-[10px]">Normal</span>}
                          {playbackRate === s && s !== 1 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                      <div className="pb-1.5" />
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Fullscreen (F)"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground leading-snug">
            {partData?.title || "Loading…"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Watch at least{" "}
            <span className="text-foreground font-medium">{QUIZ_UNLOCK_THRESHOLD}%</span> of the
            video to unlock the quiz
          </p>
        </div>
        {/* ───────── PROGRESS STRIP ───────── */}
        <div className="rounded-xl border bg-card/60 px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Watch progress</span>
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                quizUnlocked ? "text-emerald-600" : "text-foreground",
              )}
            >
              {watchedPercent}%{" "}
              <span className="text-muted-foreground font-normal">
                / {QUIZ_UNLOCK_THRESHOLD}% required
              </span>
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                quizUnlocked ? "bg-emerald-500" : "bg-primary",
              )}
              style={{ width: `${Math.min(watchedPercent, 100)}%` }}
            />
          </div>
          {quizUnlocked && (
            <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Great job! The quiz is now unlocked.
            </p>
          )}
        </div>

        {/* ───────── BELOW VIDEO ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Lesson info + keyboard shortcuts */}
          <div className="lg:col-span-3 rounded-2xl border bg-card p-5 space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                About this lesson
              </p>
              <h2 className="font-semibold text-foreground text-base leading-snug">
                {partData?.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {partData?.description ||
                  "Work through this lesson at your own pace. Complete at least 90% of the video to unlock the quiz and test your knowledge."}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Keyboard shortcuts
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["Space / K", "Play/Pause"],
                  ["← →", "Skip 10s"],
                  ["M", "Mute"],
                  ["F", "Fullscreen"],
                ].map(([k, l]) => (
                  <div
                    key={k}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border/50"
                  >
                    <kbd className="font-mono text-[10px] font-bold text-foreground">{k}</kbd>
                    <span className="text-xs text-muted-foreground">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end main content */}

      {/* ───────── SIDEBAR ───────── */}
      <aside className="xl:w-72 w-full shrink-0 min-w-0">
        <div className="flex items-center justify-between pt-1 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToMain()}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2 h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Parts
          </Button>

          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300",
              quizUnlocked
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : watchedPercent > 0
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted text-muted-foreground border-transparent",
            )}
          >
            {quizUnlocked ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            {quizUnlocked
              ? "Quiz Unlocked"
              : watchedPercent > 0
                ? `${watchedPercent}% watched`
                : "Quiz Locked"}
          </div>
        </div>

        <div
          className="sticky top-4 rounded-2xl border bg-card overflow-hidden shadow-sm flex flex-col"
          style={{ maxHeight: "calc(100vh - 32px)" }}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b bg-muted/30">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              Module Parts
            </p>
            <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
              {moduleData?.title || "Loading…"}
            </h3>
          </div>

          {/* Parts progress summary */}
          {allParts &&
            progressData &&
            (() => {
              const done = allParts.filter((p) => {
                const pid = p._id || p.id;
                const rec = progressData.watchRecords?.find((r) => r.part === pid);
                return (rec?.watchPercent || 0) >= QUIZ_UNLOCK_THRESHOLD;
              }).length;
              return (
                <div className="px-4 py-2.5 border-b bg-muted/20 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {allParts.length} parts total
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      done > 0 ? "text-emerald-600" : "text-muted-foreground",
                    )}
                  >
                    {done}/{allParts.length} completed
                  </span>
                </div>
              );
            })()}

          {/* Parts list */}
          <div className="divide-y divide-border/40 overflow-y-auto flex-1 min-h-0">
            {allParts?.map((part, idx) => {
              const pid = part._id || part.id;
              const rec = progressData?.watchRecords?.find((r) => r.part === pid);
              const pct = rec?.watchPercent || 0;
              const isActive = pid === partId;
              const isDone = pct >= QUIZ_UNLOCK_THRESHOLD;

              return (
                <button
                  key={pid}
                  onClick={() => goToPart(pid)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-150 border-l-[3px]",
                    isActive
                      ? "bg-primary/8 border-l-primary"
                      : "border-l-transparent hover:bg-muted/40 hover:border-l-muted-foreground/20",
                  )}
                >
                  {/* Status badge */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : isDone
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isDone && !isActive ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Title + progress */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug truncate",
                        isActive
                          ? "text-primary"
                          : isDone
                            ? "text-foreground"
                            : "text-foreground/80",
                      )}
                    >
                      {part.title || `Part ${idx + 1}`}
                    </p>

                    {pct > 0 ? (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              isDone ? "bg-emerald-500" : "bg-primary",
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-[10px] tabular-nums shrink-0 font-medium",
                            isDone ? "text-emerald-600" : "text-muted-foreground",
                          )}
                        >
                          {pct}%
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">Not started</p>
                    )}
                  </div>

                  {isActive && <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1.5" />}
                </button>
              );
            })}

            {!allParts && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Footer — next part shortcut */}
          {allParts &&
            (() => {
              const curIdx = allParts.findIndex((p) => (p._id || p.id) === partId);
              const next = allParts[curIdx + 1];
              if (!next) return null;
              const npid = next._id || next.id;
              const nrec = progressData?.watchRecords?.find((r) => r.part === npid);
              const npct = nrec?.watchPercent || 0;
              return (
                <div className="px-4 py-3.5 border-t bg-gradient-to-r from-primary/5 to-transparent">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Up next
                  </p>
                  <button
                    onClick={() => goToPart(npid)}
                    className="w-full flex items-center gap-3 text-left group rounded-xl px-3 py-2.5 hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <PlayCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 block">
                        {next.title || `Part ${curIdx + 2}`}
                      </span>
                      {npct > 0 && (
                        <span className="text-[10px] text-muted-foreground">{npct}% watched</span>
                      )}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </button>
                </div>
              );
            })()}
        </div>

        {/* Quiz CTA */}
        <div
          className={cn(
            "lg:col-span-2 rounded-2xl border p-5 flex flex-col items-center justify-center gap-4 transition-all duration-500 mt-4",
            quizUnlocked
              ? "bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-transparent border-emerald-500/20"
              : "bg-card border-border",
          )}
        >
          {/* Ring */}
          <div className="relative">
            <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
              <circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                strokeWidth="6"
                stroke="currentColor"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                strokeWidth="6"
                stroke={quizUnlocked ? "#10b981" : "hsl(var(--primary))"}
                strokeLinecap="round"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={ringOffset}
                style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {quizUnlocked ? (
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              ) : (
                <span className="text-lg font-bold tabular-nums">{watchedPercent}%</span>
              )}
            </div>
          </div>

          <div className="text-center space-y-1">
            <p
              className={cn(
                "text-base font-bold",
                quizUnlocked ? "text-emerald-600" : "text-foreground",
              )}
            >
              {quizUnlocked ? "Quiz Unlocked!" : "Quiz Locked"}
            </p>
            <p className="text-xs text-muted-foreground">
              {quizUnlocked
                ? "You've watched enough to take the quiz"
                : `Watch ${QUIZ_UNLOCK_THRESHOLD - watchedPercent}% more to unlock`}
            </p>
          </div>

          <Button
            onClick={goToQuiz}
            disabled={!quizUnlocked}
            size="sm"
            className={cn(
              "w-full gap-2 font-semibold h-9 transition-all duration-300",
              quizUnlocked
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                : "opacity-60 cursor-not-allowed",
            )}
          >
            {quizUnlocked ? (
              <>
                <CheckCircle className="w-4 h-4" /> Take the Quiz
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Quiz Locked
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {[
            ["Space / K", "Play/Pause"],
            ["← →", "Skip 10s"],
            ["M", "Mute"],
            ["F", "Fullscreen"],
          ].map(([k, l]) => (
            <div
              key={k}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border/50"
            >
              <kbd className="font-mono text-[10px] font-bold text-foreground">{k}</kbd>
              <span className="text-xs text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
      </aside>
    </div> /* end outer flex */
  );
}
