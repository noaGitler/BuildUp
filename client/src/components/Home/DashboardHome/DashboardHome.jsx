import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiArrowRight } from 'react-icons/fi';

import { useProjects } from '../../../context/ProjectContext.jsx';
import { JobProvider, useJobs } from '../../../context/JobContext.jsx';

import ProjectsGrid from '../../Projects/ProjectsGrid/ProjectsGrid.jsx';
import JobCard from '../../Jobs/JobCard/JobCard.jsx';
import './DashboardHome.css';

const DashboardHomeContent = () => {
    const navigate = useNavigate();
    
    const { fetchProjectsRaw } = useProjects();
    const [latestProjects, setLatestProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState(null);

    const { latestJobs, fetchLatestJobs } = useJobs();
    const [jobsLoading, setJobsLoading] = useState(true);

    useEffect(() => {
        fetchProjectsRaw({ sort: 'newest', limit: 3 })
            .then(res => {
                if (res.success) {
                    setLatestProjects(res.data);
                } else {
                    setProjectsError(res.message);
                }
            })
            .catch(err => setProjectsError("Failed to fetch fresh catalog items."))
            .finally(() => setProjectsLoading(false));

        fetchLatestJobs().finally(() => setJobsLoading(false));

    }, [fetchProjectsRaw, fetchLatestJobs]);

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

                <ProjectsGrid 
                    projects={latestProjects} 
                    isLoading={projectsLoading} 
                    error={projectsError} 
                    showLoadMore={false}
                    limit={3}
                />
            </section>

            {/* Hot Jobs Section המעודכן */}
            <section className="dashboard-section">
                <div className="section-meta-row">
                    <div className="section-title-group">
                        <h2>Hot Jobs & Tenders</h2>
                        <p className="section-quote">"The right opportunity often appears when you least expect it"</p>
                    </div>
                    <button className="btn-explore-more" onClick={() => navigate('/jobs')}>
                        View Job Board <FiArrowRight />
                    </button>
                </div>

                <div className="dashboard-jobs-grid">
                    {jobsLoading ? (
                        <div className="dashboard-loading-message">Loading latest jobs...</div>
                    ) : latestJobs && latestJobs.length > 0 ? (
                        latestJobs.slice(0, 3).map(job => (
                            <JobCard 
                                key={job.id} 
                                {...job} 
                            />
                        ))
                    ) : (
                        <div className="dashboard-empty-message">
                            No new jobs posted recently. Check back later!
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};


const DashboardHome = () => {
    return (
        <JobProvider>
            <DashboardHomeContent />
        </JobProvider>
    );
};


export default DashboardHome;