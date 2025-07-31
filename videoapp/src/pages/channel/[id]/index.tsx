import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import { useUser } from "@/lib/AuthContext";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  try {
    let channel = user;
   
    
    return (
      <div className="flex-1 min-h-screen bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChannelHeader channel={channel} user={user} />
          <Channeltabs />
          <div className=" pb-8">
            <VideoUploader channelId={id} channelName={channel?.channelname} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching channel data:", error);
   
  }
};

export default index;