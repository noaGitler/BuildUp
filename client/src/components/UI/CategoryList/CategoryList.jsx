import React from 'react';
import { useCategories } from '../../../context/categoryContext';
import CategoryCard from '../CategoryCard/CategoryCard';
import './CategoryList.css';

const CategoryList = ({ selectedIds = [], onCategorySelect, none = false }) => {
    const { categories, loading, error } = useCategories();

    if (loading) return <div className="categories-status-msg">Loading design categories...</div>;
    if (error) return <div className="categories-status-msg error-msg">Error: {error}</div>;

    return (
        <div className="categories-flex-container">
            {categories.map((category) => {
                // Check inclusion parameters directly against primitive array tracking inputs
                const isSelected = selectedIds.includes(category.id);

                return (
                    <CategoryCard
                        key={category.id}
                        categoryId={category.id}
                        isSelected={isSelected}
                        onClick={onCategorySelect}
                    />
                );
            })}
        </div>
    );
};

export default CategoryList;