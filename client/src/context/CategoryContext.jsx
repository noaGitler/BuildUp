import React, { createContext, useState, useEffect, useContext } from 'react';
import categoryService from '../services/categoryService';

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dynamic array containing only the unique primitive IDs of all active database rows
    const categoryIds = categories.map(cat => cat.id);

    // Fetch routine invoked on initial application bootstrap lifecycle
    const fetchCategoriesData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await categoryService.getAllCategories();

            if (result.success && result.data) {
                setCategories(result.data);
            } else {
                setError(result.message || "Failed to parse categories repository");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred while loading categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoriesData();
    }, []);

    return (
        <CategoryContext.Provider
            value={{
                categories,
                categoryIds,
                loading,
                error,
                refreshCategories: fetchCategoriesData
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => useContext(CategoryContext);