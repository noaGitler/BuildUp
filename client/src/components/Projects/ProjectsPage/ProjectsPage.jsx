// // src/components/Projects/ProjectsPage.jsx
// import React from 'react';
// import { useFilterParams } from '../../../Hooks/useFilterParams.js';
// import { useCategories } from '../../../context/categoryContext.jsx';
// import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
// import './ProjectsPage.css';

// const ProjectsPage = () => {
//   // 1. שליפת הפרמטרים והפונקציה מה-URL באמצעות ההוק
//   const { search, sortBy, category, page, updateFilters } = useFilterParams();

//   // 2. שליפת מערך הקטגוריות הגלובלי ישירות מהקונטקסט שלכן
//   // הערה: ודאי שבתוך ה-CategoryContext מוחזר שדה שמכיל את מערך הקטגוריות מה-DB (למשל: categories)
//   const { categories = [] } = useCategories();

//   // אריזה של הפרמטרים הנוכחיים כדי להעביר אותם לרכיב התצוגה של הפילטר בר
//   const currentFilters = { search, sortBy, category, page };

//   // פונקציה זמנית כדי לבדוק את שינוי ה-Page ב-URL בלחיצה
//   const handleLoadMoreFake = () => {
//     updateFilters({ page: page + 1 });
//   };

//   return (
//     <div className="projects-page-container">

//       <h1 className="projects-page-title">
//         Projects Catalog
//       </h1>
//       <p className="projects-page-subtitle">
//         Current Page in URL: <strong>{page}</strong>
//       </p>

//       {/* רכיב הפילטר בר הטיפש - מקבל את הערכים ומעביר את מערך הקטגוריות שהגיע מהקונטקסט */}
//       <FilterBar 
//         categories={categories}
//         currentFilters={currentFilters}
//         onFilterChange={updateFilters}
//       />

//       {/* אזור הפיד הריק - כאן ירונדרו כרטיסיות הפרויקטים בהמשך */}
//       <div className="projects-empty-feed">
//         <p className="empty-feed-text">
//           The projects grid items will be rendered here based on the URL parameters.
//         </p>
//         <div className="active-query-debug">
//           Active Query Parameters: 
//           {search && ` [Search: "${search}"]`} 
//           {category && ` [Category_ID: ${category}]`} 
//           {` [Sort: "${sortBy}"]`}
//         </div>
//       </div>

//       {/* כפתור טען עוד זמני לבדיקת המערכת */}
//       <div className="actions-wrapper">
//         <button onClick={handleLoadMoreFake} className="btn-load-more-test">
//           Fake Load More (Test Page Param)
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ProjectsPage;





// src/components/Projects/ProjectsPage.jsx
import React from 'react';
import { FiClock, FiTrendingUp, FiCheck } from 'react-icons/fi';
import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import { useCategories } from '../../../context/categoryContext.jsx';
import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const { search, sortBy, category, updateFilters } = useFilterParams();
    const { categories = [] } = useCategories();

    const currentFilters = { search, sortBy, category };
    const sortOptions = [
        { id: 'newest', name: 'Latest', icon: <FiClock /> },
        { id: 'oldest', name: 'Oldest', icon: <FiTrendingUp /> },
        { id: 'title', name: 'A-Z', icon: <FiCheck /> }
    ];

    return (
        <div className="projects-page-container">
            {/* זימון ה-FilterBar המשודרג עם האפשרויות והסטייט מה-URL */}
            <FilterBar
                currentFilters={currentFilters}
                onFilterChange={updateFilters}
                sortOptions={sortOptions}
            />

            {/* אזור תוכן הפיד הריק */}
            <div className="projects-empty-feed">
                <p className="empty-feed-text">
                    Projects grid data will be displayed here based on URL query tracking.
                </p>
            </div>
        </div>
    );
};

export default ProjectsPage;