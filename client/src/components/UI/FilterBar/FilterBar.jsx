// import React from 'react';
// import './FilterBar.css';

// const FilterBar = ({ currentFilters, onFilterChange, categories = [], showSort = true }) => {
//   return (
//     <div className="filter-bar-container">
//       <div className="filter-field-wrapper">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={currentFilters.search || ''}
//           onChange={(e) => onFilterChange({ search: e.target.value })}
//           className="filter-input-element"
//         />
//       </div>

//       <div className="filter-field-wrapper">
//         <select
//           value={currentFilters.category || ''}
//           onChange={(e) => onFilterChange({ category: e.target.value || null })}
//           className="filter-select-element"
//         >
//           <option value="">All Categories</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
//       </div>

//       {showSort && (
//         <div className="filter-field-wrapper">
//           <select 
//             value={currentFilters.sort || 'newest'} 
//             onChange={(e) => onFilterChange({ sortBy: e.target.value })}
//             className="filter-select-element"
//           >
//             <option value="newest">Latest Updates</option>
//             <option value="oldest">Oldest First</option>
//             <option value="title">Alphabetical Order</option>
//           </select>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterBar;










// // src/components/UI/FilterBar/FilterBar.jsx
// import React, { useState } from 'react';
// import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
// import { useFilterParams } from '../../../Hooks/useFilterParams.js';
// import Sidebar from '../FilterBar/Sidebar/Sidebar.jsx'; // Importing your existing Sidebar
// import './FilterBar.css';

// const FilterBar = () => {
//   // Synchronizing filter fields directly with the URL query state
//   const { search, sortBy, category, updateFilters } = useFilterParams();
  
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSearchVisible, setIsSearchVisible] = useState(!!search);

//   const handleToggleSidebar = () => {
//     setIsSidebarOpen(prev => !prev);
//   };

//   const handleToggleSearch = () => {
//     if (isSearchVisible) {
//       // Clearing the search query from URL when closing the search input
//       updateFilters({ search: '' });
//     }
//     setIsSearchVisible(prev => !prev);
//   };

//   // Convert category URL parameter to array format for your CategoryList component
//   const selectedCategoryIds = category ? [parseInt(category, 10)] : [];

//   const handleCategorySelect = (categoryId) => {
//     // If the category is already selected, clear it (toggle out), else set it as the exclusive active filter
//     const targetValue = category === String(categoryId) ? null : categoryId;
//     updateFilters({ category: targetValue });
//   };

//   return (
//     <div className="filter-bar-unified-wrapper">
      
//       {/* Top Action Bar matching image_3e5fdb.png drawing schema */}
//       <div className="filter-header-controls">
//         <button type="button" onClick={handleToggleSidebar} className="control-trigger-icon-btn hamburger-btn">
//           <FiMenu />
//         </button>
        
//         <button type="button" onClick={handleToggleSearch} className={`control-trigger-icon-btn search-btn ${isSearchVisible ? 'active' : ''}`}>
//           {isSearchVisible ? <FiX /> : <FiSearch />}
//         </button>

//         {isSearchVisible && (
//           <div className="search-input-field-container">
//             <input
//               type="text"
//               placeholder="Search by title..."
//               value={search}
//               onChange={(e) => updateFilters({ search: e.target.value })}
//               className="search-bar-element-input"
//               autoFocus
//             />
//           </div>
//         )}
//       </div>

//       {/* Invoking your customized Sidebar component, passing state modifiers and filter criteria */}
//       <Sidebar 
//         isOpen={isSidebarOpen} 
//         onClose={handleToggleSidebar}
//         currentSort={sortBy}
//         onSortChange={(newSort) => updateFilters({ sortBy: newSort })}
//         selectedCategoryIds={selectedCategoryIds}
//         onCategorySelect={handleCategorySelect}
//       />

//     </div>
//   );
// };

// export default FilterBar;









// src/components/UI/FilterBar/FilterBar.jsx
import React, { useState } from 'react';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import Sidebar from '../FilterBar/Sidebar/Sidebar.jsx';
import './FilterBar.css';

const FilterBar = ({ sortOptions = [] }) => {
  // Synchronizing filter fields directly with the URL query state
  const { search, sortBy, category, updateFilters } = useFilterParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(!!search);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleToggleSearch = () => {
    if (isSearchVisible) {
      updateFilters({ search: '' });
    }
    setIsSearchVisible(prev => !prev);
  };

  // Convert category URL parameter to array format for your CategoryList component
  const selectedCategoryIds = category ? [parseInt(category, 10)] : [];

  const handleCategorySelect = (categoryId) => {
    // Toggle mechanic: if selected again, remove it, otherwise switch to it exclusively
    const targetValue = category === String(categoryId) ? null : categoryId;
    updateFilters({ category: targetValue });
  };

  return (
    <div className="filter-bar-unified-wrapper">
      
      {/* Top Action Bar matching image_3e5fdb.png drawing schema */}
      <div className="filter-header-controls">
        <button type="button" onClick={handleToggleSidebar} className="control-trigger-icon-btn hamburger-btn">
          <FiMenu />
        </button>
        
        <button type="button" onClick={handleToggleSearch} className={`control-trigger-icon-btn search-btn ${isSearchVisible ? 'active' : ''}`}>
          {isSearchVisible ? <FiX /> : <FiSearch />}
        </button>

        {isSearchVisible && (
          <div className="search-input-field-container">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="search-bar-element-input"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Invoking Sidebar and passing all properties including the dynamic sort options array */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleToggleSidebar}
        currentSort={sortBy}
        onSortChange={(newSort) => updateFilters({ sortBy: newSort })}
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelect={handleCategorySelect}
        sortOptions={sortOptions}
      />

    </div>
  );
};

export default FilterBar;