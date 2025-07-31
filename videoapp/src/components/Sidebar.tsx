import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";
import { X } from "lucide-react";

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useUser();

  const [isdialogeopen, setisdialogeopen] = useState(false);
  return (
    <div className="h-full relative">
      {/* Close button for mobile only */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-3 p-2 rounded-full hover:bg-gray-200 md:hidden cursor-pointer"
        >
          <X size={20} />
        </button>
      )}

      {/* Sidebar content */}
      <aside className="w-64 bg-white  border-r min-h-screen p-2">
        <nav className="space-y-1">
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
              onClick={onClose}
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <Compass className="w-5 h-5 mr-3" />
              Explore
            </Button>
          </Link>
          <Link href="/subscriptions">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
            >
              <PlaySquare className="w-5 h-5 mr-3" />
              Subscriptions
            </Button>
          </Link>

          {user && (
            <>
              <div className="border-t pt-2 mt-2">
                <Link href="/history">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                    onClick={onClose}
                  >
                    <History className="w-5 h-5 mr-3" />
                    History
                  </Button>
                </Link>
                <Link href="/liked">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                    onClick={onClose}
                  >
                    <ThumbsUp className="w-5 h-5 mr-3" />
                    Liked videos
                  </Button>
                </Link>
                <Link href="/watch-later">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                    onClick={onClose}
                  >
                    <Clock className="w-5 h-5 mr-3" />
                    Watch later
                  </Button>
                </Link>

                <Link href="/group">
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                    onClick={onClose}
                  >
                    <UsersRound className="w-5 h-5 mr-3" />
                    Groups
                  </Button>
                </Link>

                {user?.channelname ? (
                  <Link href={`/channel/${user.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start cursor-pointer"
                      onClick={onClose}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Your channel
                    </Button>
                  </Link>
                ) : (
                  <div className="px-2 py-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full cursor-pointer"
                      onClick={() => setisdialogeopen(true)}
                    >
                      Create Channel
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
        <Channeldialogue
          isopen={isdialogeopen}
          onclose={() => setisdialogeopen(false)}
          mode="create"
        />
      </aside>
    </div>
  );
};

export default Sidebar;
