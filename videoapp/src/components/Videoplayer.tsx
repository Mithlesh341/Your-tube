"use client";

import { useRef, useEffect, useState } from "react";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Volume2,
  Sun,
  ChevronsRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CommentsFullScreen from "./Commentsfullscreen";
import { useUser } from "@/lib/AuthContext";
import Subscriptionplans from "./SubscribePlans";
import axiosInstance from "@/lib/axiosinstance";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
  onNext?: () => void;
  onShowComments?: () => void;
}

export default function VideoPlayer({
  video,
  onNext,
  onShowComments,
}: VideoPlayerProps) {
  const router = useRouter();
  const commentsRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  if (!video) return;
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showLeftSkip, setShowLeftSkip] = useState(false);
  const [showRightSkip, setShowRightSkip] = useState(false);
  const [volumeFeedback, setVolumeFeedback] = useState<number | null>(null);
  const [showCommentsFullscreen, setShowCommentsFullscreen] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef(0);
  const lastYRef = useRef<number | null>(null);
  const [volume, setVolume] = useState(1);
  const [watchedTime, setWatchedTime] = useState(0);
  const watchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownLimitRef = useRef(false);
  const [watchedTimeTotal, setWatchedTimeTotal] = useState(0);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const planLimits: Record<string, number> = {
    Free: 5,
    Bronze: 7,
    Silver: 10,
    Gold: Infinity,
  };
  const maxMinutes = user?.plan ? planLimits[user.plan] : 0;

  useEffect(() => {
    const savedTime = localStorage.getItem(`watch_${video._id}_${user?.email}`);
    if (savedTime) {
      setWatchedTime(Number(savedTime));
    }
  }, [video._id, user]);
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `watch_${video._id}_${user.email}`,
        watchedTime.toString()
      );
    }
  }, [watchedTime, user, video._id]);

  const previousPlanRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchWatchTime = async () => {
      if (!user?.email) return;
      try {
        const res = await axiosInstance.post("/watchtime/get-watch-time", {
          email: user.email,
        });
        const backendTime = res.data?.watchTime ?? 0;
        setWatchedTimeTotal(backendTime); // converting minutes to seconds
      } catch (err) {
        console.error("Failed to fetch watch time from backend", err);
      }
    };

    fetchWatchTime();
  }, [user]);

  useEffect(() => {
    if (!user || !user.plan || user.plan === "Gold") return;

    const previousPlan = previousPlanRef.current;
    const currentPlan = user.plan;

    if (previousPlan && previousPlan !== currentPlan) {
      // Plan changed — reset everything
      const key = `watch_total_${user.email}`;
      const startKey = `watch_start_${user.email}`;
      localStorage.setItem(key, "0");
      localStorage.setItem(startKey, Date.now().toString());
      setWatchedTimeTotal(0);
      hasShownLimitRef.current = false;
    }

    if (previousPlan !== currentPlan) {
      // ✅ Plan changed — reset timer
      const key = `watch_total_${user.email}`;
      const startKey = `watch_start_${user.email}`;

      localStorage.setItem(key, "0");
      localStorage.setItem(startKey, Date.now().toString());
      setWatchedTimeTotal(0);
      hasShownLimitRef.current = false;
    }

    previousPlanRef.current = currentPlan;
  }, [user?.plan]);

  useEffect(() => {
    setWatchedTime(0);
    hasShownLimitRef.current = false;
  }, [video._id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.volume = volume;
      setIsPaused(true);
      setShowPlayPauseIcon(true);
    }
  }, [video.filepath]);

  useEffect(() => {
    if (!user || user.plan === "Gold" || !videoRef.current) return;

    const video = videoRef.current;

    const startTracking = () => {
      if (watchIntervalRef.current) clearInterval(watchIntervalRef.current);

      watchIntervalRef.current = setInterval(() => {
        setWatchedTimeTotal((prev) => {
          const next = prev + 1;
          const key = `watch_total_${user.email}`;

          if (next >= maxMinutes * 60 && !hasShownLimitRef.current) {
            hasShownLimitRef.current = true;
            video.pause();
            setShowUpgradeDialog(true);
          }

          axiosInstance
            .post("/watchtime/update-watch-time", {
              email: user.email,
              watchTime: Math.floor(next),
            })
            .catch((err) => {
              console.error("Failed to update watch time", err);
            });

          return next;
        });
      }, 1000);
    };

    // Attach event listeners to video
    const handlePlay = () => startTracking();
    const handlePause = () => {
      if (watchIntervalRef.current) {
        clearInterval(watchIntervalRef.current);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      if (watchIntervalRef.current) clearInterval(watchIntervalRef.current);
    };
  }, [user?.plan, maxMinutes, video.filepath]);

  const handleTap = (clientX: number, width: number) => {
    const now = Date.now();
    const region =
      clientX < width * 0.45
        ? "left"
        : clientX > width * 0.55
        ? "right"
        : "center";

    if (now - lastTapTimeRef.current < 400) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }

    lastTapTimeRef.current = now;

    if (tapTimeout.current) clearTimeout(tapTimeout.current);

    tapTimeout.current = setTimeout(() => {
      const count = tapCountRef.current;
      tapCountRef.current = 0;

      const videoEl = videoRef.current;
      if (!videoEl) return;

      if (count === 1) {
        if (videoEl.paused) {
          videoEl.play();
          setIsPaused(false);
        } else {
          videoEl.pause();
          setIsPaused(true);
        }

        setShowPlayPauseIcon(true);
        setTimeout(() => setShowPlayPauseIcon(false), 700);
        return;
      } else if (count === 2) {
        if (region === "right") {
          videoEl.currentTime += 10;
          setShowRightSkip(true);
          setTimeout(() => setShowRightSkip(false), 600);
        } else if (region === "left") {
          videoEl.currentTime -= 10;
          setShowLeftSkip(true);
          setTimeout(() => setShowLeftSkip(false), 600);
        }
      } else if (count >= 3) {
        if (region === "center" && onNext) {
          setFeedback("▶️ Next Video");
          onNext();
          setTimeout(() => setFeedback(null), 1000);
        } else if (region === "left") {
          setFeedback("💬 Comments");
          setShowCommentsFullscreen(true);
          setTimeout(() => setFeedback(null), 1000);
        } else if (region === "right") {
          const confirmExit = confirm("Are you sure you want to exit?");
          if (confirmExit) {
            setFeedback("🚪 Exiting...");
            setTimeout(() => {
              router.push("/exit");
            }, 500);
          }
        }
      }
    }, 450);
  };

  //REPLACEMENT OF ORIGNAL ABOVE
  const handleTapCount = (clientX: number, width: number, count: number) => {
    const region =
      clientX < width * 0.45
        ? "left"
        : clientX > width * 0.55
        ? "right"
        : "center";

    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (count === 2) {
      if (region === "right") {
        videoEl.currentTime += 10;
        setShowRightSkip(true);
        setTimeout(() => setShowRightSkip(false), 600);
      } else if (region === "left") {
        videoEl.currentTime -= 10;
        setShowLeftSkip(true);
        setTimeout(() => setShowLeftSkip(false), 600);
      }
    } else if (count >= 3) {
      if (region === "center" && onNext) {
        setFeedback("▶️ Next Video");
        onNext();
        setTimeout(() => setFeedback(null), 1000);
      } else if (region === "left") {
        setFeedback("💬 Comments");
        setShowCommentsFullscreen(true);
        setTimeout(() => setFeedback(null), 1000);
      } else if (region === "right") {
        const confirmExit = confirm("Are you sure you want to exit?");
        if (confirmExit) {
          setFeedback("🚪 Exiting...");
          setTimeout(() => {
            router.push("/exit");
          }, 500);
        }
      }
    }
  };

  const isSwipeRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLVideoElement>) => {
    const touch = e.touches[0];
    lastYRef.current = touch.clientY;
    isSwipeRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLVideoElement>) => {
    const touch = e.touches[0];
    const deltaY = lastYRef.current ? lastYRef.current - touch.clientY : 0;
    const clientX = touch.clientX;
    const width = e.currentTarget.getBoundingClientRect().width;

    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(deltaY) > 10) {
      isSwipeRef.current = true;
    }

    if (clientX > width * 0.5) {
      const newVolume = Math.min(1, Math.max(0, video.volume + deltaY / 300));
      video.volume = newVolume;
      setVolumeFeedback(Math.round(newVolume * 100));
      setVolume(newVolume);
      setTimeout(() => setVolumeFeedback(null), 800);
    }

    lastYRef.current = touch.clientY;
  };

  const handleTouchTap = (() => {
    let lastTapTime = 0;
    let tapCount = 0;
    let timeoutId: NodeJS.Timeout;

    return (e: React.TouchEvent<HTMLVideoElement>) => {
      if (isSwipeRef.current) return; // Ignore tap if user swiped

      const rect = e.currentTarget.getBoundingClientRect();
      //if (e.touches.length === 0) return;
      if (e.changedTouches.length === 0) return;
      const clientX = e.changedTouches[0].clientX - rect.left;
      const width = rect.width;

      const now = Date.now();
      if (now - lastTapTime < 400) {
        tapCount++;
      } else {
        tapCount = 1;
      }
      lastTapTime = now;

      clearTimeout(timeoutId);

      //Current working part

      timeoutId = setTimeout(() => {
        handleTapCount(clientX, width, tapCount);
        tapCount = 0;
      }, 450);


    };
  })();

  const handleMouseClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const width = rect.width;
    handleTap(clientX, width);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-visible w-full aspect-video sm:aspect-video md:aspect-video"
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => {
          handleTouchStart(e);
          //handleTapGesture(e);
        }}
        onTouchEnd={handleTouchTap}
        onTouchMove={handleTouchMove}
        //onMouseDown={handleTapGesture}

        onDoubleClick={(e) => e.preventDefault()}
        onPlay={() => {
          setIsPaused(false);
          setShowPlayPauseIcon(true);
          setTimeout(() => setShowPlayPauseIcon(false), 700);
        }}
        onPause={() => {
          setIsPaused(true);
          setShowPlayPauseIcon(true);
        }}
        onClick={handleMouseClick}
      >
        <source src={video.filepath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-50">
        {user?.plan === "Gold"
          ? "Gold Plan"
          : `${user?.plan || "Free"} - ${(watchedTimeTotal / 60).toFixed(
              1
            )} / ${maxMinutes} min`}
      </div>

      {/* Bottom Right Controls (Volume + Fullscreen) */}
      <div className="absolute bottom-4 right-4 flex flex-row flex-wrap items-center justify-end gap-3 bg-black/10 px-3 py-2 rounded-lg max-w-full">
        {/* Volume Control */}
        <div className="flex items-center gap-2 text-white">
          <Volume2 className="w-5 h-5" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              if (videoRef.current) videoRef.current.volume = newVolume;
              setVolume(newVolume);
            }}
            className="sm:w-24 w-16 accent-red-500"
          />
          <span className="text-sm w-10 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              containerRef.current?.requestFullscreen().then(() => {
                videoRef.current?.focus();
              });
            } else {
              document.exitFullscreen();
            }
          }}
          className="text-white p-1 cursor-pointer hover:text-red-400 transition"
          title="Toggle Fullscreen"
        >
          ⛶
        </button>
      </div>

      {/* Play/Pause Icon */}
      {showPlayPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade">
          <div className="bg-black/50 rounded-full p-3 sm:p-4 transition-all">
            {isPaused ? (
              <Play className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            ) : (
              <Pause className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            )}
          </div>
        </div>
      )}
      {/* Double Tap Feedback */}
      {showLeftSkip && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 animate-ping-once">
          <div className="text-white bg-black/40 px-4 py-2 rounded-full flex items-center gap-1">
            <Rewind className="w-5 h-5" /> -10s
          </div>
        </div>
      )}
      {showRightSkip && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-ping-once">
          <div className="text-white bg-black/40 px-4 py-2 rounded-full flex items-center gap-1">
            +10s <FastForward className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* Feedback for triple tap next */}
      {feedback === "▶️ Next Video" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 px-4 py-2 rounded-full flex items-center gap-2 text-white text-lg animate-fade-up">
            <ChevronsRight className="w-6 h-6" />
            Next Video
          </div>
        </div>
      )}

      {feedback === "💬 Comments" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 px-4 py-2 rounded-full flex items-center gap-2 text-white text-lg animate-fade-up">
            Comments
          </div>
        </div>
      )}

      {/* Video Progress Slider */}
      {videoRef.current && (
        <input
          type="range"
          min={0}
          max={videoRef.current.duration || 0}
          value={videoRef.current.currentTime}
          onChange={(e) => {
            const time = Number(e.target.value);
            if (videoRef.current) videoRef.current.currentTime = time;
          }}
          className="absolute bottom-2 left-2 right-16 h-1 appearance-none bg-white/50 rounded-lg cursor-pointer accent-red-500"
        />
      )}
      {showCommentsFullscreen && (
        <CommentsFullScreen
          ref={commentsRef}
          videoId={video._id}
          onClose={() => setShowCommentsFullscreen(false)}
        />
      )}

      {showUpgradeDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <Subscriptionplans />
        </div>
      )}
    </div>
  );
}
