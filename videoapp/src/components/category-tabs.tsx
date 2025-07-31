"use client";

import { useEffect, useState } from "react";

const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Science",
  "Travel",
  "Food",
  "Fashion",
];

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 

    return () => window.removeEventListener("resize", handleResize); 
  }, []);

  if (isMobile) {
    // Mobile dropdown
    return (
      <div className="w-full px-4 mb-4">
        <p className="mb-2 text-sm font-medium">Categories</p>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="w-full p-2 rounded-md border border-gray-300 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    );
  }

   return (
    <div className="w-full mb-4 px-4">
      <div
        className="
          flex flex-wrap gap-2 py-3
        "
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 cursor-pointer rounded-full text-sm transition-all duration-200 whitespace-nowrap ${
  activeCategory === category
    ? "bg-gray-600 text-white shadow-sm"
    : "bg-gray-100 text-gray-800 hover:bg-gray-300"
}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );


}
