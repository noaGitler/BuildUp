import React from 'react';
import { FiX } from 'react-icons/fi';
import CategoryList from '../../UI/CategoryList/CategoryList.jsx';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`category-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
          <h3>Categories</h3>
        </div>
        <div className="sidebar-content" onClick={onClose}>
          {/* Rendering the CategoryList dynamically in vertical layout */}
          <CategoryList isVertical={true} />
        </div>
      </div>

      {/* Background overlay when sidebar is active */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;