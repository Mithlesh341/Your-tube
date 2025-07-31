import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videoplayer from "@/components/Videoplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";

const WatchPage = () => {
  const commentsRef = useRef<HTMLDivElement | null>(null); 
  const router = useRouter();
  const { id } = router.query;

  const [videoList, setVideoList] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        setVideoList(res.data);

        const matchedVideo = res.data.find((vid: any) => vid._id === id);
        setCurrentVideo(matchedVideo || null);
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]); 

  if (loading) return <div>Loading...</div>;
  if (!currentVideo) return <div>Video not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* <Videoplayer video={currentVideo} 
                    onNext={() => console.log("Go to next video")}
  onShowComments={() => console.log("Show comments")}
            />  */}
            <Videoplayer
                      video={currentVideo}
                      onNext={() => {
  const currentIndex = videoList.findIndex((v) => v._id === id);
  const nextIndex = (currentIndex + 1) % videoList.length;
  const nextVideo = videoList[nextIndex];
  router.push(`/watch/${nextVideo._id}`);
}}

  onShowComments={scrollToComments}
/>

            <VideoInfo video={currentVideo} />  
            <Comments ref={commentsRef} videoId={id as string} />
          </div>
          <div className="space-y-4">
            <RelatedVideos videos={videoList.filter((v) => v._id !== id)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
