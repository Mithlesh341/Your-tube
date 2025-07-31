import SearchResult from "@/components/SearchResult";
import { useRouter } from "next/router";
import React, { Suspense } from "react";

const index = () => {
  const router = useRouter();
  const { q } = router.query;
  return (
    <div className="flex-1 px-4 sm:px-6 md:px-8 py-4">
      <div className="max-w-6xl mx-auto">
        {q && (
          <div className="mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium mb-4">
              Search results for "{q}"
            </h1>
          </div>
        )}
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResult query={q || ""} />
        </Suspense>
      </div>
    </div>
  );
};

export default index;