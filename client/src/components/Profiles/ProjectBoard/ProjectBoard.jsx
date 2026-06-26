import React, { useState, useEffect } from 'react';

import { useProjects } from '../../../context/ProjectContext.jsx';

import ProjectsGrid from '../../Projects/ProjectsGrid/ProjectsGrid.jsx';
import './ProjectBoard.css';

const ProjectBoard = ({ professional, user }) => {
    const { fetchProjectsRaw } = useProjects();
    const [userProjects, setUserProjects] = useState([]);
    const [limit, setLimit] = useState(6);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects specifically for this professional
    useEffect(() => {
        if (!professional || !professional.id) return;

        setLoading(true);
        setError(null);

        fetchProjectsRaw({ professional_id: professional.id, limit: limit })
            .then(res => {
                if (res.success) {
                    setUserProjects(res.data);
                } else {
                    setError(res.message || "Failed to load professional portfolio.");
                }
            })
            .catch(err => {
                console.error("Failed to fetch professional projects:", err);
                setError("A network error disrupted the catalog sync.");
            })
            .finally(() => setLoading(false));
            
    }, [professional.id, limit, fetchProjectsRaw]);

    const hasMoreProjects = userProjects.length >= limit;

    return (
        <div className="project-board-main-panel animate-fade-in">
            <div className="project-board-header">
                <h3>Portfolio Catalog</h3>
                <p>Explore the creative work and completed projects by {professional.name}.</p>
            </div>
            
            <div className="project-grid-wrapper">
                <ProjectsGrid 
                    projects={userProjects}
                    isLoading={loading}
                    error={error}
                    limit={limit}
                    emptyMessage="No projects have been published yet by this studio."
                    showLoadMore={hasMoreProjects}
                    onLoadMore={() => setLimit(prev => prev + 6)}
                />
            </div>
        </div>
    );
};

export default ProjectBoard;