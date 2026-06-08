import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService';
import { useAuth } from './authContext';

const FavoriteContext = createContext(null);

export const FavoriteProvider = ({ children }) => {
    const [favoritedProjectIds, setFavoritedProjectIds] = useState([]);
    const [favoriteProjects, setFavoriteProjects] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [favoritesError, setFavoritesError] = useState(null);
    
    const { user } = useAuth();

    // Retrieving the Favorites Array
    const syncFavoriteIds = useCallback(async () => {
        if (!user || !user.id) {
            setFavoritedProjectIds([]);
            return;
        }
        try {
            const response = await favoriteService.getFavoriteProjectsList(user.id);
            if (response.success && response.data) {
                const idsOnly = response.data.map(project => project.id);
                setFavoritedProjectIds(idsOnly);
            }
        } catch (err) {
            console.error("Error within FavoriteProvider sync sequence:", err);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            syncFavoriteIds();
        } else {
            setFavoritedProjectIds([]);
        }
    }, [user?.id, syncFavoriteIds]);

    // Fetches the full detailed favorite project objects with optional catalog filters.
    const fetchFavoriteProjects = useCallback(async (filters = {}) => {
        if (!user || !user.id) {
            setFavoriteProjects([]);
            return;
        }
        setLoadingFavorites(true);
        setFavoritesError(null);
        try {
            const response = await favoriteService.getFavoriteProjectsList(user.id, filters);
            if (response.success) {
                setFavoriteProjects(response.data);
            } else {
                setFavoritesError(response.message || "Failed to fetch favorite projects collection.");
            }
        } catch (err) {
            console.error("Error inside FavoriteProvider fetch batch sequence:", err);
            setFavoritesError(err.response?.data?.message || "Internal server setup error.");
        } finally {
            setLoadingFavorites(false);
        }
    }, [user?.id]);

    /**
     * Appends a project reference row inside the remote database instance.
     */
    const addFavorite = useCallback(async (projectId) => {
        if (!user || !user.id) return { success: false, message: "Authentication parameter missing." };
        try {
            const response = await favoriteService.addProjectToFavorites(user.id, projectId);
            if (response.success) {
                setFavoritedProjectIds(prev => [...prev, projectId]);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (err) {
            console.error("FavoriteProvider tracking error during append request node:", err);
            return { success: false, message: err.response?.data?.message || "Server error." };
        }
    }, [user?.id]);

    /**
     * Clears a project reference row from the remote database instance.
     */
    const removeFavorite = useCallback(async (projectId) => {
        if (!user || !user.id) return { success: false, message: "Authentication parameter missing." };
        try {
            const response = await favoriteService.removeProjectFromFavorites(user.id, projectId);
            if (response.success) {
                setFavoritedProjectIds(prev => prev.filter(id => id !== projectId));
                setFavoriteProjects(prev => prev.filter(p => p.id !== projectId));
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (err) {
            console.error("FavoriteProvider tracking error during delete request node:", err);
            return { success: false, message: err.response?.data?.message || "Server error." };
        }
    }, [user?.id]);

    /**
     * Synchronous boolean utility method to let card nodes resolve their heart fill state instantly.
     */
    const isProjectFavorited = useCallback((projectId) => {
        return favoritedProjectIds.includes(projectId);
    }, [favoritedProjectIds]);

    return (
        <FavoriteContext.Provider
            value={{
                favoriteProjects,
                favoritedProjectIds,
                loadingFavorites,
                favoritesError,
                fetchFavoriteProjects,
                addFavorite,
                removeFavorite,
                isProjectFavorited
            }}>
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoriteProvider");
    }
    return context;
};