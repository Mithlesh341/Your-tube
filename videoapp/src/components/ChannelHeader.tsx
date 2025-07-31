import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user }: any) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-64 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden"></div>

      {/* Channel Info */}
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-start items-center text-center md:text-left">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
            <AvatarFallback className="text-2xl">
              {channel?.channelname[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words">{channel?.channelname}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600">
              <span>@{channel?.channelname.toLowerCase().replace(/\s+/g, "")}</span>
            </div>
            {channel?.description && (
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto md:mx-0">
                {channel?.description}
              </p>
            )}
          </div>

          {user && user?._id !== channel?._id && (
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <Button
                onClick={() => setIsSubscribed(!isSubscribed)}
                variant={isSubscribed ? "outline" : "default"}
              className={`w-full cursor-pointer sm:w-auto ${
                isSubscribed
                  ? "bg-gray-100"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;