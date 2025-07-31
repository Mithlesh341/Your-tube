import React, { useState } from "react";
import { Button } from "./ui/button";
const tabs = [
  { id: "home", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "playlists", label: "Playlists" },
  { id: "community", label: "Community" },
  { id: "about", label: "About" },
];
const Channeltabs = () => {
  const [activeTab, setActiveTab] = useState("videos");
  return (
    <div className="border-b px-4">
      <div className="flex flex-wrap md:flex-nowrap gap-4 sm:gap-6 md:gap-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
          className={`px-0 py-4 cursor-pointer border-b-2 rounded-none text-sm sm:text-base ${
            activeTab === tab.id
              ? "border-black text-black"
              : "border-transparent text-gray-600 hover:text-black"
          }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Channeltabs;