import React, { createContext, useState, useContext, useCallback } from 'react';
import profilesService from '../services/profilesService.js';

const ProfilesContext = createContext(null);

export const ProfilesProvider = ({ children }) => {
    const [professionals, setProfessionals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch professionals directory with "Load More" (append) support
    const fetchProfessionals = useCallback(async (filters = {}, isLoadMore = false) => {
        try {
            setLoading(true);
            setError(null);

            const currentPage = isLoadMore ? page + 1 : 1;
            // Inject pagination tracking parameters dynamically
            const compiledQuery = { ...filters, page: currentPage, limit: 6 };

            const result = await profilesService.getAllProfessionals(compiledQuery);

            if (result.success) {
                if (isLoadMore) {
                    setProfessionals(prev => [...prev, ...result.data]);
                    setPage(currentPage);
                } else {
                    setProfessionals(result.data);
                    setPage(1);
                }

                // If backend returns fewer items than the limit, we reached the repository bounds
                if (result.data.length < 6) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } else {
                setError(result.message || "Failed to compile professionals repository.");
            }
        } catch (err) {
            console.error("Exception in fetchProfessionals:", err);
            setError("Server sync failed while building directory catalog.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    // Reset pagination state when filters or categories adjust
    const resetProfessionals = useCallback(() => {
        setProfessionals([]);
        setPage(1);
        setHasMore(true);
    }, []);

    // Exposing raw API methods directly to local components
    const getProfileData = useCallback(async (id) => {
        return await profilesService.getProfile(id);
    }, []);

    const getReviewsData = useCallback(async (id) => {
        return await profilesService.getProfessionalReviews(id);
    }, []);

    const submitReviewData = useCallback(async (id, reviewData) => {
        return await profilesService.addReview(id, reviewData);
    }, []);

    const updateProfileData = useCallback(async (id, payload) => {
        return await profilesService.updateProfile(id, payload);
    }, []);

    const editReviewData = useCallback(async (reviewId, payload) => {
        return await profilesService.editReview(reviewId, payload);
    }, []);

    const deleteReviewData = useCallback(async (reviewId) => {
        return await profilesService.deleteReview(reviewId);
    }, []);

    return (
        <ProfilesContext.Provider value={{
            professionals,
            loading,
            error,
            hasMore,
            fetchProfessionals,
            resetProfessionals,
            getProfileData,
            getReviewsData,
            submitReviewData,
            updateProfileData,
            editReviewData,
            deleteReviewData
        }}>
            {children}
        </ProfilesContext.Provider>
    );
};

export const useProfiles = () => useContext(ProfilesContext);