import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "@/lib/axiosinstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SearchResult = ({ query }: any) => {
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        setAllVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const results = allVideos.filter(
        (vid) =>
          vid.videotitle.toLowerCase().includes(query.toLowerCase()) ||
          vid.videochanel.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredVideos(results);
    } else {
      setFilteredVideos([]);
    }
  }, [query, allVideos]);

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Enter a search term to find videos and channels.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading videos...</p>
      </div>
    );
  }

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }

  return (
  <div className="space-y-6">
    {/* Video Results */}
    <div className="space-y-6">
      {filteredVideos.map((video: any) => (
        <div
          key={video._id}
          className="flex flex-col sm:flex-row gap-4 group"
        >
          {/* Thumbnail */}
          <Link href={`/watch/${video._id}`} className="flex-shrink-0">
            <div className="relative w-full sm:w-60 md:w-72 lg:w-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                src={video.filepath}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                10:24
              </div>
            </div>
          </Link>

          {/* Video Details */}
          <div className="flex-1 min-w-0 py-1">
            <Link href={`/watch/${video._id}`}>
              <h3 className="font-medium text-base sm:text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                {video.videotitle}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
              <span>{video.views?.toLocaleString()} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div>

            <Link
              href={`/channel/${video.uploader}`}
              className="flex items-center gap-2 mb-2 hover:text-blue-600"
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {video.videochanel[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {video.videochanel}
              </span>
            </Link>

            <p className="text-sm text-gray-700 line-clamp-2">
              {video.description ||
                "Sample video description that shows what the video is about."}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Footer Summary */}
    <div className="text-center py-8">
      <p className="text-gray-600">
        Showing {filteredVideos.length} result
        {filteredVideos.length > 1 ? "s" : ""} for "{query}"
      </p>
    </div>
  </div>
);






};

export default SearchResult;
