import CategoryTabs from "@/components/category-tabs";
import Videogrid from "@/components/Videogrid";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex-1 p-4 overflow-y-auto">
      <CategoryTabs />
      
       <Suspense fallback={<div>Loading videos...</div>}>
        <Videogrid />
      </Suspense>       
      

    </main>
  );
}