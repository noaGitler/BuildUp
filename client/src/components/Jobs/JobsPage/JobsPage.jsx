import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { FiClock, FiTrendingUp, FiCheck, FiPlus } from 'react-icons/fi';

import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import { useAuth } from '../../../context/authContext.jsx';
import { useJobs } from '../../../context/JobContext.jsx';

import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
import JobCard from '../JobCard/JobCard.jsx';
import JobForm from '../JobForm/JobForm.jsx';
import './JobsPage.css';

const JobsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const { jobs, fetchJobs, fetchJobById, handleUpdateJob, handleCreateJob } = useJobs();
    const { search, sortBy, category, updateFilters } = useFilterParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(12);

    const [selectedJob, setSelectedJob] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);


    const currentFilters = { search, sortBy, category };

    const sortOptions = [
        { id: 'newest', name: 'Latest', icon: <FiClock /> },
        { id: 'oldest', name: 'Oldest', icon: <FiTrendingUp /> },
        { id: 'title', name: 'A-Z', icon: <FiCheck /> }
    ];

    const fetchMarketplaceJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            const activeCompiledQuery = {
                search: search || null,
                sort: sortBy || 'newest',
                category_id: category || null
            };

            await fetchJobs(activeCompiledQuery);
        } catch (err) {
            console.error("Database connection failed:", err);
            setError("Failed to sync marketplace elements array.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditJobSubmit = async (payload) => {
        try {
            const result = await handleUpdateJob(id, user.id, payload);

            if (result.success || !result.error) {
                await fetchMarketplaceJobs();
                const updatedJobData = await fetchJobById(id);
                setSelectedJob(updatedJobData);
                navigate(`/jobs/${id}`);
                return null;
            }
        } catch (error) {
            console.error("Failed to update job post registry:", error);
            return error.response?.data?.message || "Failed to commit modifications. Please try again.";
        }
    };

    useEffect(() => {
        fetchMarketplaceJobs();
    }, [search, sortBy, category]);

    useEffect(() => {
        if (!id || id === 'new') {
            setSelectedJob(null);
            return;
        }

        let isMounted = true;

        const fetchSingleJobDetails = async () => {
            try {
                setDetailsLoading(true);
                const data = await fetchJobById(id);

                if (!isMounted) return;
                if (!data) {
                    navigate('/jobs', { replace: true });
                    return;
                }

                const isEditPath = window.location.pathname.includes('/edit/');
                const isOwner = user?.id && data?.client_id && Number(data.client_id) === Number(user.id);
                const isAdmin = user?.role === 'admin';

                if (isEditPath && !isOwner && !isAdmin) {
                    navigate('/jobs', { replace: true });
                    return;
                }

                setSelectedJob(data);
            } catch (err) {
                if (isMounted) {
                    setSelectedJob(null);
                    navigate('/jobs', { replace: true });
                }
            } finally {
                if (isMounted) {
                    setDetailsLoading(false);
                }
            }
        };

        fetchSingleJobDetails();

        return () => { isMounted = false; };
    }, [id, navigate, user, fetchJobById]);

    useEffect(() => {
        setLimit(12);
    }, [search, sortBy, category]);

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 12);
    };

    const displayedJobs = jobs.slice(0, limit);

    const handleCreateJobWrapper = async (payload) => {
        try {
            const response = await handleCreateJob(payload);

            if (response.success) {
                await fetchMarketplaceJobs();
                navigate('/jobs');
                return null;
            }
        } catch (error) {
            console.error("Failed to commit job registry:", error);
            return error.response?.data?.message || "Network error. Please try again.";
        }
    };

    return (
        <div className="jobs-page-container">
            <div className="jobs-page-container">
                <div className="jobs-hero-header">
                    <h1>Job Opportunities Marketplace</h1>
                    <p>Browse current structural projects and architectural opportunities.</p>
                </div>

                <div className="filter-and-action-row">
                    <div className="filter-wrapper">
                        <FilterBar currentFilters={currentFilters} onFilterChange={updateFilters} sortOptions={sortOptions} />
                    </div>
                    <button type="button" className="btn-create-new-job-post" onClick={() => navigate('/jobs/new')}>
                        <FiPlus size={14} /> Add New Job
                    </button>
                </div>
            </div>

            {error && (
                <div className="jobs-error-message">
                    <p>Failed to sync marketplace elements array: {error}</p>
                </div>
            )}

            <div className={`jobs-split-layout ${id ? 'active-layout' : ''}`}>
                <div className="jobs-master-list">
                    {displayedJobs.length === 0 && !loading ? (
                        <div className="jobs-empty-feed">
                            <p className="empty-feed-text">
                                No job opportunities matching your design search scope.
                            </p>
                        </div>
                    ) : (
                        <div className="jobs-grid-layout">
                            {displayedJobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    {...job}
                                    isActive={String(id) === String(job.id)}
                                />
                            ))}
                        </div>
                    )}

                    {loading && (
                        <div className="jobs-feed-spinner">
                            <p>Compiling latest professional marketplace updates data...</p>
                        </div>
                    )}

                    {!loading && !error && jobs.length > limit && (
                        <div className="load-more-action-wrapper">
                            <button className="btn-feed-load-more" onClick={handleLoadMore}>
                                Load More Jobs
                            </button>
                        </div>
                    )}
                </div>

                {id && (
                    <div className="jobs-detail-panel">
                        <Outlet />
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobsPage;