import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiTrendingUp, FiCheck, FiFolderPlus } from 'react-icons/fi';

import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import { useCategories } from '../../../context/categoryContext.jsx';
import { useProjects } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/authContext.jsx'

import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import './ProjectsPage.css';

const ProjectsPage = () => {
    const navigate = useNavigate();

    const { search, sortBy, category, updateFilters } = useFilterParams();
    const { categories = [] } = useCategories();
    const { projects, loading, error, fetchProjects } = useProjects();
    const { user } = useAuth();

    const [limit, setLimit] = useState(12);

    const currentFilters = { search, sortBy, category };

    // Sorting metadata structure mapping array representation
    const sortOptions = [
        { id: 'newest', name: 'Latest', icon: <FiClock /> },
        { id: 'oldest', name: 'Oldest', icon: <FiTrendingUp /> },
        { id: 'title', name: 'A-Z', icon: <FiCheck /> }
    ];

    // Triggers a filter request whenever there is a change in one of the parameters.
    useEffect(() => {
        const activeCompiledQuery = {
            search: search || null,
            sort: sortBy || 'newest',
            category_id: category || null,
            limit: limit
        };
        fetchProjects(activeCompiledQuery);
    }, [search, sortBy, category, limit, fetchProjects]);

    // Automatic layout template reset function
    useEffect(() => {
        setLimit(12);
    }, [search, sortBy, category]);

    // Increments query batch limit window parameters variables values
    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 12);
    };

    // Checks if logged in user is a verified professional creator profile
    const isProfessional = user && (user.role === 'professional' || user.role === 'admin');

    return (
        <div className="projects-page-container">
            <div className="projects-top-actions-row">
                {/* Filter control operational hub block structure section layout */}
                <FilterBar
                    currentFilters={currentFilters}
                    onFilterChange={updateFilters}
                    sortOptions={sortOptions}
                />

                {/* Context control header action controls */}
                {isProfessional && (
                    <button
                        onClick={() => navigate('/projects/new')}
                        className="btn-create-project-trigger"
                    >
                        <FiFolderPlus />
                    </button>
                )}
            </div>

            {/* Main structural error fallback presentation layer */}
            {error && (
                <div className="projects-error-message">
                    <p>Failed to sync catalog elements array: {error}</p>
                </div>
            )}

            {/* Dynamic catalog response content core grid renderer block flow */}
            {projects.length === 0 && !loading ? (
                <div className="projects-empty-feed">
                    <p className="empty-feed-text">
                        No architecture matching design assets compiled your query search scope.
                    </p>
                </div>
            ) : (
                <div className="projects-grid-layout">
                    {projects.map(project => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            )}

            {/* Loading background sequence visual cues layout tracker hooks placeholder */}
            {loading && (
                <div className="projects-feed-spinner">
                    <p>Compiling latest professional workspace updates catalog data...</p>
                </div>
            )}

            {/* Functional load pagination interaction button interface rendering block execution */}
            {!loading && !error && projects.length >= limit && (
                <div className="load-more-action-wrapper">
                    <button className="btn-feed-load-more" onClick={handleLoadMore}>
                        Load More Designs
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;