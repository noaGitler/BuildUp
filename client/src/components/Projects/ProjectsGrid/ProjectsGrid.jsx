import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard.jsx';
import './ProjectsGrid.css'

const ProjectsGrid = ({ projects = [], isLoading, error, emptyMessage, showLoadMore = false, onLoadMore, limit }) => {

    if (error) {
        return (
            <div className="projects-error-message">
                <p>Failed to sync catalog elements array: {error}</p>
            </div>
        );
    }

    if (projects.length === 0 && !isLoading) {
        return (
            <div className="projects-empty-feed">
                <p className="empty-feed-text">
                    {emptyMessage || "No architecture matching design assets compiled your query search scope."}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="projects-grid-layout">
                {projects.map(project => (
                    <ProjectCard key={project.id} {...project} />
                ))}
            </div>

            {isLoading && (
                <div className="projects-feed-spinner">
                    <p>Compiling latest professional workspace updates catalog data...</p>
                </div>
            )}

            {/* Functional load pagination interaction button interface rendering block execution */}
            {showLoadMore && !isLoading && !error && projects.length >= limit && (
                <div className="load-more-action-wrapper">
                    <button className="btn-feed-load-more" onClick={onLoadMore}>
                        Load More Designs
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectsGrid;