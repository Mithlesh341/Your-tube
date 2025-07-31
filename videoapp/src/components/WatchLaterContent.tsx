"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

export default function WatchLaterContent() {
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadWatchLater();
    }
  }, [user]);

  const loadWatchLater = async () => {
    if (!user) return;

    try {
      const watchLaterData = await axiosInstance.get(`/watch/${user._id}`);
      setWatchLater(watchLaterData.data);
    } catch (error) {
      console.error("Error loading Watch Later:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchLater = async (watchLaterId: string) => {
    try {
      setWatchLater(watchLater.filter((item) => item._id !== watchLaterId));
    } catch (error) {
      console.error("Error removing from Watch Later:", error);
    }
  };

  const getThumbnailFromCloudinary = (videoUrl: string) => {
    if (!videoUrl?.includes("cloudinary")) return "/placeholder.svg";
    try {
      const parts = videoUrl.split("/upload/");
      if (parts.length !== 2) return "/placeholder.svg";
      const publicId = parts[1].replace(/\.[^/.]+$/, "");
      return `${parts[0]}/upload/so_2/${publicId}.jpg`;
    } catch (err) {
      console.error("Thumbnail generation error:", err);
      return "/placeholder.svg";
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Save videos for later</h2>
        <p className="text-gray-600">
          Sign in to access your Watch later playlist.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading watch later...</div>;
  }

  const validVideos = watchLater.filter((item) => item?.videoid);

  if (validVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No videos saved</h2>
        <p className="text-gray-600">
          Videos you save for later will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{validVideos.length} videos</p>
      </div>

      <div className="space-y-4">
        {validVideos.map((item) => {
          const thumbnailUrl = getThumbnailFromCloudinary(item.videoid.filepath);
          return (
            <div key={item._id} className="flex gap-4 group">
              <Link href={`/watch/${item.videoid._id}`} className="flex-shrink-0">
                <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={thumbnailUrl}
                    alt={item.videoid.videotitle}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/watch/${item.videoid._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                    {item.videoid.videotitle}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600">{item.videoid.videochanel}</p>
                <p className="text-sm text-gray-600">
                  {item.videoid.views?.toLocaleString()} views • {formatDistanceToNow(new Date(item.videoid.createdAt))} ago
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Added {formatDistanceToNow(new Date(item.createdAt))} ago
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleRemoveFromWatchLater(item._id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove from Watch later
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}
