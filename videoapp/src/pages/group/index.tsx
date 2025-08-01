"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link as LinkIcon, Users, X } from "lucide-react";
import { useUser } from "@/lib/AuthContext";
import io from "socket.io-client";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { group } from "console";


const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  transports: ["websocket"], 
});

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
//const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

interface Group {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  admin?: {
    name: string;
    email: string;
  };
}

export default function GroupPage() {
   const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const { user } = useUser();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedInviteLink, setSelectedInviteLink] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");


  

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/group/get`);
      const data = await res.json();
      setGroups(data);
      setFilteredGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName, description: groupDesc }),
      });
      if (res.ok) {
        setGroupName("");
        setGroupDesc("");
        setShowModal(false);
        fetchGroups();
        toast.success("Group Created Successfully !");
      }
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const handleJoinGroup = async () => {
    //const token = await user.getIdToken();
    if (!joinGroupId.trim()) return;

    const groupIdFromLink = joinGroupId.split("/").pop();
    //const token = await user?.getIdToken(); // Firebase ID token
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/group/join/${groupIdFromLink}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseBody = await res.json();

     

      if (res.ok) {
        setJoinGroupId("");
        fetchGroups();
        
         toast.success("Successfully joined the group!");
        setTimeout(() => {
          router.push(`/group/chat/${groupIdFromLink}`);
        }, 1500);
       
      } else {
        // const err = await res.json();
        // alert("Error: " + err.error);
        if (responseBody.error === "Admin cannot join their own group") {
          toast.error("You are the admin, You cannot join");
        } else {
          toast.error("Error: " + responseBody.error);
        }
      }
    } catch (err) {
      console.error("Join error:", err);
      toast.error("Unexpected error while joining group.");
    }
  };
  const generateInviteLink = (groupId: string) => {
    return `${window.location.origin}/group/join/${groupId}`;
  };

  const handleInviteClick = (groupId: string) => {
    const group = groups.find((g) => g._id === groupId)
    const link = generateInviteLink(groupId);
    setSelectedInviteLink(link);
    setSelectedGroupName(group?.name || "Unnamed Group");
    setShowInviteModal(true);
  };

  const notify = () => toast("Message copied to clipboard!");

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div
            id="invite-modal-content"
            className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl relative space-y-5"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Invite to Group
            </h2>
            <p className="text-center text-sm text-gray-600">
              Share this link with your friends and family to join the group.
            </p>

            {/* Invite Link Box */}
            <div  className="bg-gray-100 p-4 rounded-lg border border-gray-200 text-sm font-mono text-gray-700 overflow-auto">
              <p>
                <strong>
                  Group Name : 
                </strong> {selectedGroupName}
              </p>
              <p>
                <strong>Invite Link:</strong> {selectedInviteLink}
              </p>
              <p>
                <strong>Paste Above link here:</strong> {window.location.origin}/group
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={() => {
                const textToCopy = `Group Name: ${selectedGroupName}\nInvite Link: ${selectedInviteLink}\nPaste Above Link Here: ${window.location.origin}/group`;
                navigator.clipboard.writeText(textToCopy);
                notify();

                setTimeout(() => {
                  setShowInviteModal(false); 
                }, 4500); // A short delay ensures toast is triggered while container is present
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
            >
              Copy Message
            </Button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
            <Input
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-3"
            />
            <Input
              placeholder="Group description"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full cursor-pointer" onClick={handleCreateGroup}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <Input
          placeholder="Search groups..."
          value={searchTerm}
          onChange={handleSearch}
          className="md:w-2/3 w-full"
        />
        <Button onClick={() => setShowModal(true)} className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      {/* Join Group */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-2">
        <Input
          placeholder="Paste group ID or link to join"
          value={joinGroupId}
          onChange={(e) => setJoinGroupId(e.target.value)}
          className="w-full md:w-2/3"
        />
        <Button onClick={handleJoinGroup} className="w-full cursor-pointer md:w-auto">
          Join
        </Button>
      </div>

      {/* Group List */}
      {filteredGroups.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No groups yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => (
            <div
              key={group._id}
              className="border rounded-lg p-4 flex flex-col justify-between shadow hover:shadow-md transition"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1">{group.name}</h2>
                {group.description && (
                  <p className="text-sm text-gray-600 mb-1">
                    {group.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {group.members?.length || 0} member(s)
                </p>

                {group.admin && (
                  <p className="text-sm text-gray-500">
                    Admin - {group.admin.name}
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => handleInviteClick(group._id)} className="cursor-pointer">
                  <LinkIcon className="w-4 h-4 mr-1" /> Invite
                </Button>
                <Button
                  onClick={() =>
                    window.location.assign(`/group/chat/${group._id}`)
                  } className="cursor-pointer"
                >
                  <Users className="w-4 h-4 mr-1" /> Open Chat
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
