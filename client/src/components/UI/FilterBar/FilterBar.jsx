<<<<<<< HEAD

=======
>>>>>>> upstream/main
import React, { useState } from 'react';
import { FiMenu, FiSearch, FiX, FiPlus } from 'react-icons/fi'; // ייבוא אייקון הפלוס
import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import { useNavigate } from 'react-router-dom'; // ייבוא ה-useNavigate לניווט ה-URL
import Sidebar from '../FilterBar/Sidebar/Sidebar.jsx';
import './FilterBar.css';

const FilterBar = ({ sortOptions = [] }) => {
<<<<<<< HEAD
  const navigate = useNavigate(); // אתחול פונקציית הניווט עבור הטופס החדש
  
=======
>>>>>>> upstream/main
  // Extracting unified filter fields and orchestrator from the custom hook
  const { search, sort, category, updateFilters } = useFilterParams();
  
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

  // Convert category URL string parameter to array format for downstream compliance
  const selectedCategoryIds = category ? [parseInt(category, 10)] : [];

  const handleCategorySelect = (categoryId) => {
    const targetValue = category === String(categoryId) ? null : categoryId;
    updateFilters({ category: targetValue });
  };

  // Callback wrapper function passed explicitly down to handle sort updates
  const handleSortChange = (newSortId) => {
    updateFilters({ sortBy: newSortId });
  };

  return (
    <div className="filter-bar-unified-wrapper">
      
      {/* Top Action Bar controls */}
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

      {/* Invoking Sidebar and passing controlled operational logic parameters cleanly */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleToggleSidebar}
        currentSort={sort} // Passing the raw static context string variable
        onSortChange={handleSortChange} // Passing the explicit state execution callback function
        selectedCategoryIds={selectedCategoryIds}
        onCategorySelect={handleCategorySelect}
        sortOptions={sortOptions}
      />

    </div>
  );
};

export default FilterBar;