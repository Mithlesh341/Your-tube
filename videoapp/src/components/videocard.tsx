"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";

export default function VideoCard({ video }: any) {
  const getThumbnailFromCloudinary = (videoUrl: string) => {
    if (!videoUrl?.includes("cloudinary")) return "/placeholder.svg";

    try {
      const url = new URL(videoUrl);
      const parts = videoUrl.split("/upload/");
      if (parts.length !== 2) return "/placeholder.svg";

      // Remove file extension (e.g., .mp4, .webm)
      const publicId = parts[1].replace(/\.[^/.]+$/, "");

      return `${parts[0]}/upload/so_2/${publicId}.jpg`;
    } catch (err) {
      console.error("Thumbnail generation error:", err);
      return "/placeholder.svg";
    }
  };

  const thumbnailUrl = getThumbnailFromCloudinary(video?.filepath);

  console.log("Original Cloudinary video URL:", video?.filepath);
  console.log("Generated thumbnail URL:", thumbnailUrl);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      const handleLoadedMetadata = () => {
        setDuration(videoEl.duration);
      };
      videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [video?.filepath]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };


  return (
    <Link href={`/watch/${video?._id}`} className="group block">
      <div className="space-y-3">
        
        <video
          ref={videoRef}
          src={video?.filepath}
          preload="metadata"
          className="hidden"
        />

        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          <img
            src={thumbnailUrl}
            alt={video?.videotitle}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded">
            {formatTime(duration)}
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
            <AvatarFallback>{video?.videochanel[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm sm:text-base line-clamp-2 group-hover:text-blue-600">
              {video?.videotitle}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">{video?.videochanel}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              {video?.views?.toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(video?.createdAt))} ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );






}
