// import React, { useState } from "react";
// import CategoryTabs from "./category-tabs";
// import Videogrid from "./Videogrid";

// const HomePage = () => {
//   const [activeCategory, setActiveCategory] = useState("All");

//   return (
//     <div>
//       {/* Pass both value + setter to CategoryTabs */}
//       <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

//       {/* Pass only activeCategory to Videogrid */}
//       <Videogrid activeCategory={activeCategory} />
//     </div>
//   );
// };

// export default HomePage;







import React, { useState } from "react";
import CategoryTabs from "./category-tabs";
import Videogrid from "./Videogrid";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div>
      {/* ✅ Pass both value and handler to CategoryTabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* ✅ Pass activeCategory to Videogrid for filtering */}
      <Videogrid activeCategory={activeCategory} />
    </div>
  );
};

export default HomePage;
