import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiTrendingUp, FiCheck, FiFolderPlus, FiHeart } from 'react-icons/fi';
import { FaHeart } from "react-icons/fa";

import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import { useCategories } from '../../../context/categoryContext.jsx';
import { useProjects } from '../../../context/ProjectContext';
import { useFavorites } from '../../../context/FavoriteContext';
import { useAuth } from '../../../context/authContext.jsx';

import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
import ProjectsGrid from '../ProjectsGrid/ProjectsGrid.jsx';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // בדיקה האם הניתוב הנוכחי הוא עמוד המועדפים
    const isFavoritesPage = location.pathname.includes('/favorites');

    const { search, sortBy, category, updateFilters } = useFilterParams();
    const { categories = [] } = useCategories();
    const { user } = useAuth();
    const { projects, loading, error, fetchProjects } = useProjects();
    const { favoriteProjects, loadingFavorites, favoritesError, fetchFavoriteProjects } = useFavorites();

    const [limit, setLimit] = useState(12);

    // בדיקה האם המשתמש המחובר הוא בעל מקצוע מורשה או מנהל
    const isProfessional = user && (user.role === 'professional' || user.role === 'admin');

    // השמת הנתונים הדינמיים בהתאם לסוג העמוד (מועדפים או כללי)
    const activeProjectsArray = isFavoritesPage ? favoriteProjects : projects;
    const activeLoadingState = isFavoritesPage ? loadingFavorites : loading;
    const activeErrorState = isFavoritesPage ? favoritesError : error;

    const currentFilters = { search, sortBy, category };
    const sortOptions = [
        { id: 'newest', name: 'Latest', icon: <FiClock /> },
        { id: 'oldest', name: 'Oldest', icon: <FiTrendingUp /> },
        { id: 'title', name: 'A-Z', icon: <FiCheck /> }
    ];

    // שליפת נתונים דינמית מה-Context המתאים בכל שינוי של פילטר או ניתוב
    useEffect(() => {
        const activeCompiledQuery = {
            search: search || null,
            sort: sortBy || 'newest',
            category_id: category || null,
            limit: limit
        };

        if (isFavoritesPage) {
            fetchFavoriteProjects(activeCompiledQuery);
        } else {
            fetchProjects(activeCompiledQuery);
        }
    }, [search, sortBy, category, limit, isFavoritesPage, fetchProjects, fetchFavoriteProjects]);

    // איפוס מגבלת הכמות בכל שינוי סינון
    useEffect(() => {
        setLimit(12);
    }, [search, sortBy, category]);

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 12);
    };

    const toggleFavoritesView = () => {
        if (isFavoritesPage) {
            navigate(-1);
        } else {
            navigate('/projects/favorites');
        }
    };

    return (
        <div className="projects-page-container">

            {isFavoritesPage ?
                <div className="creators-hero-header">
                    <h1>My Inspiration Board</h1>
                    <p>A curated collection of your saved structural highlights. Keep your preferred developments organized and accessible for your next endeavor.</p>
                </div>
                :
                <div className="creators-hero-header">
                    <h1>Project Gallery</h1>
                    <p>A comprehensive look at our latest developments. Witness the fusion of structural integrity and aesthetic vision.</p>
                </div>
            }

            <div className="projects-top-actions-row">

                {/* Filter control operational hub block structure section layout */}
                <FilterBar
                    currentFilters={currentFilters}
                    onFilterChange={updateFilters}
                    sortOptions={sortOptions}
                />

                {/* Hide create button when browsing favorites page view */}
                {isProfessional && !isFavoritesPage && (
                    <button
                        onClick={() => navigate('/projects/new')}
                        className="btn-create-project-trigger"
                    >
                        <FiFolderPlus />
                    </button>
                )}

                <button
                    onClick={toggleFavoritesView}
                    className={`btn-create-project-trigger ${isFavoritesPage ? 'active-heart' : 'outline-heart'}`}
                    title={isFavoritesPage ? "Show All Projects" : "Show My Favorites"}
                >
                    {isFavoritesPage ? <FaHeart /> : <FiHeart />}
                    {isFavoritesPage ? ' View All' : ' My Favorites'}
                </button>
            </div>

            {/* Main structural error fallback presentation layer */}
            {activeErrorState && (
                <div className="projects-error-message">
                    <p>Failed to sync catalog elements array: {activeErrorState}</p>
                </div>
            )}

            {/* Dynamic catalog response content core grid renderer block flow */}
            <ProjectsGrid
                projects={activeProjectsArray}
                isLoading={activeLoadingState}
                error={activeErrorState}
                emptyMessage={isFavoritesPage
                    ? "Your personalized inspiration board is empty. Start adding design assets to track them here."
                    : "No architecture matching design assets compiled your query search scope."
                }
                showLoadMore={true}
                onLoadMore={handleLoadMore}
                limit={limit}
            />

            {/* Loading background sequence visual cues layout tracker hooks placeholder */}
            {activeLoadingState && (
                <div className="projects-feed-spinner">
                    <p>Compiling latest professional workspace updates catalog data...</p>
                </div>
            )}

        </div>
    );
};

export default ProjectsPage;