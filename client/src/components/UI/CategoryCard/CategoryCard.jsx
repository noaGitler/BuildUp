import React from 'react';
import { useCategories } from '../../../context/categoryContext.jsx';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from "react-icons/fa6";
import { FiLayers } from 'react-icons/fi';
import './CategoryCard.css';

const CategoryCard = ({ categoryId, categoryName, isSelected, onClick, variant = 'card' }) => {
    const { categories } = useCategories();

    const category = categories.find(item => categoryId ? item.id === categoryId : item.name === categoryName);

    if (!category) {
        if (variant === 'pill' && categoryName) {
            return <span className="category-pill-variant default-fallback">{categoryName}</span>;
        }
        return null;
    }

    let IconComponent = null;
    if (category.icon_url && category.icon_url.startsWith('Md')) {
        IconComponent = MdIcons[category.icon_url];
    } else if (category.icon_url && category.icon_url.startsWith('Fa')) {
        IconComponent = FaIcons[category.icon_url];
    }

    const dynamicStyle = {
        '--cat-color': category.color_hex || '#60665D'
    };

    // A small tag (Pill)
    if (variant === 'pill') {
        return (
            <div
                className={`category-pill-variant ${isSelected ? 'pill-selected-active' : ''}`}
                style={dynamicStyle}
                onClick={() => onClick && onClick(category.id)}
            >
                <span className="pill-icon">
                    {IconComponent ? <IconComponent /> : <FiLayers />}
                </span>
                <span className="pill-text">{category.name}</span>
            </div>
        );
    }

    // A round card (Card)
    return (
        <div
            className={`category-card-wrapper ${isSelected ? 'category-selected-active' : ''}`}
            onClick={() => onClick && onClick(category.id)}
            style={dynamicStyle}
        >
            <div className="category-circle-avatar">
                {IconComponent ? <IconComponent /> : <FiLayers />}
            </div>
            <span className="category-display-label">
                {category.name}
            </span>
        </div>
    );
};

export default CategoryCard;