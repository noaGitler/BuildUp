import React, {useState} from 'react';
import { FiX } from 'react-icons/fi';
import { useFilterParams } from '../../../../Hooks/useFilterParams.js';
import CategoryList from '../../CategoryList/CategoryList.jsx';
import './Sidebar.css';

<<<<<<< HEAD
const Sidebar = ({
  isOpen,
  onClose,
  onSortChange, // Logic function received from the FilterBar orchestrator parent
  selectedCategoryIds = [],
  onCategorySelect,
  sortOptions = []
}) => {
=======
const Sidebar = ({ isOpen, onClose, onSortChange, selectedCategoryIds = [], onCategorySelect, sortOptions = []}) => {
  
>>>>>>> upstream/main
  // Extracting ONLY the dry string parameter variable configuration to serve as single source of truth
  const { sort } = useFilterParams();

  // Active validation checkpoint sync constraint identifier tracking
  const [activeSortId, setActiveSortId] = useState(sort || 'newest');
  return (
    <>
      <div className={`category-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
          <h3>Filters & Sorting</h3>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-sort-section">
            <h4 className="sidebar-section-title">Sort By:</h4>
            <div className="sort-circles-container">
              {sortOptions.map((option) => {
                // Evaluating active color presentation layers cleanly using the strict dry URL parameter
                const isSelected = String(activeSortId) === String(option.id);

                return (
                  <div
                    key={option.id}
                    className={`sort-circle-clickable-item ${isSelected ? 'sort-selected-active' : ''}`}
                    onClick={() => {
                      onSortChange(option.id);
                      setActiveSortId(option.id);
                    }}
                  >
                    <div className="sort-circle-avatar-icon">
                      {option.icon}
                    </div>
                    <span className="sort-circle-text-label">
                      {option.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="sidebar-section-divider" />

          <div className="sidebar-categories-section">
            <h4 className="sidebar-section-title">Categories</h4>
            <CategoryList
              isVertical={true}
              selectedIds={selectedCategoryIds}
              onCategorySelect={onCategorySelect}
            />
          </div>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  );
};

export default Sidebar;