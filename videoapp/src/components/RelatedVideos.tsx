import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface RelatedVideosProps {
  videos: Array<{
    _id: string;
    videotitle: string;
    videochanel: string;
    views: number;
    createdAt: string;
    filepath: string; 
  }>;
}

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

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  return (
    <div className="space-y-2">
      <p>Related Videos</p>
      {videos.map((video) => {
        const thumbnailUrl = getThumbnailFromCloudinary(video.filepath);
        return (
          <Link
            key={video._id}
            href={`/watch/${video._id}`}
            className="flex gap-2 group"
          >
            <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={thumbnailUrl}
                alt={video.videotitle}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
                {video.videotitle}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{video.videochanel}</p>
              <p className="text-xs text-gray-600">
                {video.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(new Date(video.createdAt))} ago
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
