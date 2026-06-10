import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../../context/ProjectContext.jsx';
import ProjectsGrid from '../../Projects/ProjectsGrid/ProjectsGrid.jsx';
import { FiBriefcase, FiArrowRight } from 'react-icons/fi';
import './DashboardHome.css';

const DashboardHome = () => {
    const navigate = useNavigate();
    const { fetchProjectsRaw } = useProjects();
    const [latestProjects, setLatestProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch only the 3 latest projects for preview without mutating global state
        fetchProjectsRaw({ sort: 'newest', limit: 3 })
            .then(res => {
                if (res.success) {
                    setLatestProjects(res.data);
                } else {
                    setError(res.message);
                }
            })
            .catch(err => setError("Failed to fetch fresh catalog items."))
            .finally(() => setLoading(false));
    }, [fetchProjectsRaw]);

    return (
        <div className="home-dashboard-container">
            {/* Main Welcome Hero Banner */}
            <header className="dashboard-hero-header">
                <h1>What's New Today?</h1>
                <p>Explore new projects, discover creative ideas, and connect with emerging opportunities.</p>
            </header>

            {/* New Projects Section */}
            <section className="dashboard-section">
                <div className="section-meta-row">
                    <div className="section-title-group">
                        <h2>Fresh Ideas in the Gallery</h2>
                        <p className="section-quote">"Today's inspiration could become tomorrow's client."</p>
                    </div>
                    <button className="btn-explore-more" onClick={() => navigate('/projects')}>
                        Explore Full Gallery <FiArrowRight />
                    </button>
                </div>

                {/* Unified generic grid component capped at a limit of 3, with load more deactivated */}
                <ProjectsGrid 
                    projects={latestProjects} 
                    isLoading={loading} 
                    error={error} 
                    showLoadMore={false}
                    limit={3}
                />
            </section>

            {/* Hot Jobs Section - Placeholder for pending module integration */}
            <section className="dashboard-section jobs-placeholder-section">
                <div className="section-meta-row">
                    <div className="section-title-group">
                        <h2>Hot Jobs & Tenders</h2>
                        <p className="section-quote">"The right opportunity often appears when you least expect it"</p>
                    </div>
                    <button className="btn-explore-more" onClick={() => navigate('/jobs')}>
                        View Job Board <FiArrowRight />
                    </button>
                </div>

                {/* Under construction fallback template block */}
                <div className="jobs-under-construction">
                    <FiBriefcase className="construction-icon" />
                    <h3>Jobs Module Integration in Progress</h3>
                    <p>Soon you will be able to review the top 3 live vocational offers published in your local market area.</p>
                </div>
            </section>
        </div>
    );
};

export default DashboardHome;