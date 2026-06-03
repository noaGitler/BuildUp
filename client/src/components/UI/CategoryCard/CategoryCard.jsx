import React from 'react';
import { useCategories } from '../../../context/CategoryContext';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from "react-icons/fa6";
import { FiLayers } from 'react-icons/fi';
import './CategoryCard.css';

const CategoryCard = ({ categoryId, isSelected, onClick }) => {
    const { categories } = useCategories();
    
    const category = categories.find(item => item.id === categoryId);

    if (!category) return null;

    let IconComponent = null;
    if (category.icon_url && category.icon_url.startsWith('Md')) {
        IconComponent = MdIcons[category.icon_url];
    } else if (category.icon_url && category.icon_url.startsWith('Fa')) {
        IconComponent = FaIcons[category.icon_url];
    }

    const activeColor = isSelected ? '#557A61' : (category.color_hex || '#60665D');

    return (
        <div 
            className={`category-card-wrapper ${isSelected ? 'category-selected-active' : ''}`}
            onClick={() => onClick(categoryId)}
        >
            <div 
                className="category-circle-avatar"
                style={{
                    color: isSelected ? '#FFFFFF' : activeColor,
                    borderColor: isSelected ? '#557A61' : 'transparent',
                    backgroundColor: isSelected ? '#557A61' : '#F7F7F4'
                }}
            >
                {IconComponent ? <IconComponent /> : <FiLayers />}
            </div>
            <span 
                className="category-display-label"
                style={{ 
                    color: activeColor, 
                    fontWeight: isSelected ? '700' : '500' 
                }}
            >
                {category.name}
            </span>
        </div>
    );
};

export default CategoryCard;