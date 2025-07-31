import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext"; 
import { getAuth } from "firebase/auth";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  transports: ["websocket"], 
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Message {
  _id?: string;
  message: string;
  sender: string;
  timestamp: string;
}

export default function GroupChatRoom() {
  const router = useRouter();
  const groupId = router.query.groupId as string;
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!router.isReady || !groupId) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/${groupId}`);
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        console.error("Failed to fetch group info", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroup();
  }, [router.isReady, groupId]);

  const isMemberOrAdmin =
    !!user &&
    (group?.admin?._id === user._id ||
      group?.members?.some((m: any) => m._id === user._id));

  useEffect(() => {
    if (!groupId || !user) return;
    socket.emit("join-room", groupId);
    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave-room", groupId);
      socket.off("receive-message");
    };
  }, [groupId, user]);

  useEffect(() => {
    if (!groupId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/msg/${groupId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !groupId || !user) return;

    const newMessage: Message = {
      message,
      sender: user.name || user.email,
      timestamp: new Date().toISOString(),
    };
    socket.emit("send-message", { groupId, ...newMessage });

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    try {
      await fetch(`${BACKEND_URL}/msg/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId,
          sender: user._id, 
          content: message, 
        }),
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

return (
  <div className="h-full flex flex-col items-center bg-white w-full">
    <ToastContainer position="top-right" autoClose={3000} />

    {/* Header */}
    <header className="w-full px-4 py-3 border-b shadow-sm">
      {/* <h1 className="text-2xl font-bold text-center">Group Chat</h1> */}
      <h1 className="text-2xl font-bold text-center">
  {group?.name ? group.name : "Group Chat"}
</h1>

    </header>

    {/* Chat container */}
    <main
      className={`
        flex flex-col flex-grow 
        w-full sm:max-w-[90%] md:max-w-[90%] lg:max-w-[80%] 
        px-4 py-4
      `}
    >
      <div className="flex-grow h-[70vh] sm:h-[65vh] md:h-[60vh] border p-3 overflow-y-auto bg-gray-100 rounded shadow-inner space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="bg-white p-2 rounded shadow-sm">
              <div className="text-sm text-gray-800 font-semibold">
                {msg.sender}
              </div>
              <div className="text-gray-700">{msg.message}</div>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(msg.timestamp), {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area or Join Button */}
      {isLoading ? (
        <div className="mt-4 text-center text-gray-500">Loading...</div>
      ) : isMemberOrAdmin ? (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Send
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <button 
            onClick={async () => {
              if (typeof window !== "undefined") {
                const url = window.location.href;
                const parts = url.split("/");
                const extractedGroupId = parts[parts.length - 1];

                const auth = getAuth();
                const token = await auth.currentUser?.getIdToken();
                const res = await fetch(
                  `${BACKEND_URL}/api/group/join/${extractedGroupId}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (res.ok) {
                  toast.success("You have joined the group!");
                  const updated = await res.json();
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                  setGroup(updated)
                } else {
                  toast.error("Failed to join group.");
                }
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Join Group
          </button>
        </div>
      )}
    </main>
  </div>
);
}
