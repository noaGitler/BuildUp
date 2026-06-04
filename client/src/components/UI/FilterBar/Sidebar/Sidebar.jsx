import React from 'react';
import { FiX } from 'react-icons/fi';
import { useFilterParams } from '../../../../Hooks/useFilterParams.js';
import CategoryList from '../../CategoryList/CategoryList.jsx';
import './Sidebar.css';

const Sidebar = ({
  isOpen,
  onClose,
  selectedCategoryIds = [],
  onCategorySelect,
  sortOptions = []
}) => {
  const { sort, updateFilters } = useFilterParams();

  const activeSortId = sort || 'newest';

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
                const isSelected = String(activeSortId) === String(option.id);

                return (
                  <div
                    key={option.id}
                    className={`sort-circle-clickable-item ${isSelected ? 'sort-selected-active' : ''}`}
                    onClick={() => updateFilters({ sortBy: option.id })}
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



// import React from 'react';
// import { FiX } from 'react-icons/fi';
// import CategoryList from '../../CategoryList/CategoryList.jsx';
// import './Sidebar.css';

// const Sidebar = ({ isOpen,
//   onClose,
//   currentSort = 'newest',
//   onSortChange,
//   selectedCategoryIds = [],
//   onCategorySelect,
//   sortOptions = []
// }) => {
//   return (
//     <>
//       <div className={`category-sidebar ${isOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <button className="close-btn" onClick={onClose}>
//             <FiX size={20} />
//           </button>
//           <h3>Filters & Sorting</h3>
//         </div>

//         <div className="sidebar-content">
//           {/* Section 1: Interactive Sort Circles Integration Layer */}
//           <div className="sidebar-sort-section">
//             <h4 className="sidebar-section-title">Sort By:</h4>
//             <div className="sort-circles-container">
//               {sortOptions.map((option) => {
//                 const isSelected = currentSort === option.id;
//                 return (
//                   <div
//                     key={option.id}
//                     className={`sort-circle-clickable-item ${isSelected ? 'selected-active' : ''}`}
//                     onClick={() => onSortChange(option.id)}
//                   >
//                     <div className="sort-circle-avatar-icon">{option.icon}</div>
//                     <span className="sort-circle-text-label">{option.name}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <hr className="sidebar-section-divider" />

//           {/* Section 2: Rendering your CategoryList dynamically with URL states wired up */}
//           <div className="sidebar-categories-section">
//             <h4 className="sidebar-section-title">Categories</h4>
//             <CategoryList isVertical={true} />
//           </div>
//         </div>
//       </div>

//       {/* Background overlay when sidebar is active */}
//       {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
//     </>
//   );
// };

// export default Sidebar;










// // src/components/UI/Sidebar/Sidebar.jsx
// import React from 'react';
// import { FiX } from 'react-icons/fi';
// import CategoryList from '../../CategoryList/CategoryList.jsx';
// import './Sidebar.css';

// const Sidebar = ({ 
//   isOpen, 
//   onClose, 
//   currentSort = 'newest', 
//   onSortChange, 
//   selectedCategoryIds = [], 
//   onCategorySelect, 
//   sortOptions = [] 
// }) => {
//   return (
//     <>
//       <div className={`category-sidebar ${isOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <button className="close-btn" onClick={onClose}>
//             <FiX size={20} />
//           </button>
//           <h3>Filters & Sorting</h3>
//         </div>

//         <div className="sidebar-content">
//           {/* Section 1: Interactive Sort Circles built dynamically using your card structure */}
//           <div className="sidebar-sort-section">
//             <h4 className="sidebar-section-title">Sort By:</h4>
//             <div className="sort-circles-container">
//               {sortOptions.map((option) => {
//                 const isSelected = currentSort === option.id;
//                 return (
//                   <div
//                     key={option.id}
//                     className={`category-card-wrapper sort-circle-clickable-item ${isSelected ? 'category-selected-active' : ''}`}
//                     onClick={() => onSortChange(option.id)}
//                   >
//                     <div 
//                       className="category-circle-avatar"
//                       style={{
//                         color: isSelected ? '#FFFFFF' : '#60665D',
//                         borderColor: isSelected ? '#557A61' : 'transparent',
//                         backgroundColor: isSelected ? '#557A61' : '#ffffff'
//                       }}
//                     >
//                       {option.icon}
//                     </div>
//                     <span 
//                       className="category-display-label"
//                       style={{ 
//                         color: isSelected ? '#557A61' : '#60665D',
//                         fontWeight: isSelected ? '700' : '500' 
//                       }}
//                     >
//                       {option.name}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <hr className="sidebar-section-divider" />

//           {/* Section 2: Fixed CategoryList call to properly forward routing variables */}
//           <div className="sidebar-categories-section">
//             <h4 className="sidebar-section-title">Categories</h4>
//             <CategoryList 
//               isVertical={true} 
//               selectedIds={selectedCategoryIds}
//               onCategorySelect={onCategorySelect}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Background overlay when sidebar is active */}
//       {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
//     </>
//   );
// };

// export default Sidebar;









// // src/components/UI/Sidebar/Sidebar.jsx
// import React from 'react';
// import { FiX } from 'react-icons/fi';
// import CategoryList from '../../CategoryList/CategoryList.jsx';
// import './Sidebar.css';

// const Sidebar = ({
//   isOpen,
//   onClose,
//   currentSort,
//   onSortChange,
//   selectedCategoryIds = [],
//   onCategorySelect,
//   sortOptions = []
// }) => {


//   const activeSortId = currentSort || 'newest';

//   return (
//     <>
//       <div className={`category-sidebar ${isOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <button className="close-btn" onClick={onClose}>
//             <FiX size={20} />
//           </button>
//           <h3>Filters & Sorting</h3>
//         </div>

//         <div className="sidebar-content">
//           {/* Section 1: Interactive Sort Circles aligned straight according to image_339444.png */}
//           <div className="sidebar-sort-section">
//             <h4 className="sidebar-section-title">Sort By:</h4>
//             <div className="sort-circles-container">
//               {sortOptions.map((option) => {
//                 const isSelected = String(activeSortId) === String(option.id);

//                 return (
//                   <div
//                     key={option.id}
//                     className={`sort-circle-clickable-item ${isSelected ? 'sort-selected-active' : ''}`}
//                     onClick={() => onSortChange(option.id)}
//                   >
                  
//                     <div
//                       className="sort-circle-avatar-icon"
//                       style={{
//                         color: isSelected ? '#FFFFFF' : '#60665D',
//                         borderColor: isSelected ? '#557A61' : 'transparent',
//                         backgroundColor: isSelected ? '#557A61' : '#FFFFFF'
//                       }}
//                     >
//                       {option.icon}
//                     </div>
//                     <span
//                       className="sort-circle-text-label"
//                       style={{
//                         color: isSelected ? '#557A61' : '#60665D',
//                         fontWeight: isSelected ? '700' : '500'
//                       }}
//                     >
//                       {option.name}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <hr className="sidebar-section-divider" />

//           {/* Section 2: Categories Listing */}
//           <div className="sidebar-categories-section">
//             <h4 className="sidebar-section-title">Categories</h4>
//             <CategoryList
//               isVertical={true}
//               selectedIds={selectedCategoryIds}
//               onCategorySelect={onCategorySelect}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Background overlay when sidebar is active */}
//       {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
//     </>
//   );
// };

// export default Sidebar;