<<<<<<< HEAD

// src/context/JobContext.jsx
=======
>>>>>>> upstream/main
import React, { createContext, useContext, useState, useCallback } from 'react';
import jobService from '../services/jobService';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
<<<<<<< HEAD
    const [latestJobs, setLatestJobs] = useState([]);    //  הפונקציה החדשה ל4 המעודכנים

    //  הפונקציה החדשה ל4 המעודכנים
    const fetchLatestJobs = useCallback(async () => {
        try {
            const result = await jobService.getLatestJobs(4);
            setLatestJobs(result || []);
        } catch (err) {
            console.error("Failed to fetch latest jobs", err);
        }
    }, []);

=======
    const [latestJobs, setLatestJobs] = useState([]);

    // Fetch the latest jobs for marketing dashboard modules
    const fetchLatestJobs = useCallback(async () => {
        try {
            const result = await jobService.getAllJobs({ sort: 'newest', limit: 4 });
            const dataArray = Array.isArray(result) ? result : (result?.data || []);
            setLatestJobs(dataArray.slice(0, 4));
        } catch (err) {
            console.error("Failed to fetch latest jobs:", err);
        }
    }, []);

    // Fetch jobs with dynamic filtration parameters
>>>>>>> upstream/main
    const fetchJobs = useCallback(async (filters) => {
        try {
            setLoading(true);
            setError(null);
            const result = await jobService.getAllJobs(filters);
            setJobs(Array.isArray(result) ? result : (result?.data || []));
        } catch (err) {
            setError(err.message || "Failed to sync jobs catalog.");
        } finally {
            setLoading(false);
        }
    }, []);

<<<<<<< HEAD
    // פונקציית עדכון
=======
    // Fetch a single designated job post data payload by ID
    const fetchJobById = useCallback(async (id) => {
        try {
            setError(null);
            const result = await jobService.getJobById(id);
            return result;
        } catch (err) {
            setError(err.message || "Failed to fetch single job details.");
            throw err;
        }
    }, []);

    // Commit a brand new job opportunity to the server layers
    const handleCreateJob = useCallback(async (payload) => {
        try {
            setError(null);
            const response = await jobService.createJob(payload);
            return response;
        } catch (err) {
            setError(err.message || "Failed to commit job posting.");
            throw err;
        }
    }, []);

    // Update an existing job post configuration specifications row
>>>>>>> upstream/main
    const handleUpdateJob = useCallback(async (id, userId, updatedData) => {
        try {
            setError(null);
            const result = await jobService.updateJob(id, userId, updatedData);

            if (result) {
                setJobs(prevJobs =>
                    prevJobs.map(job => job.id === id ? { ...job, ...updatedData } : job)
                );
            }
            return result;
        } catch (err) {
            setError(err.message || "Failed to update job blueprint.");
            throw err;
        }
    }, []);

<<<<<<< HEAD
    // פונקציית מחיקת משרה
=======
    // Completely purge a designated job posting record from persistent database catalogs
>>>>>>> upstream/main
    const handleDeleteJob = useCallback(async (id, userId) => {
        try {
            setError(null);
            const result = await jobService.deleteJob(id, userId);
<<<<<<< HEAD

=======
>>>>>>> upstream/main
            setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
            return result;
        } catch (err) {
            setError(err.message || "Failed to delete job registry row.");
            throw err;
        }
    }, []);

    return (
        <JobContext.Provider value={{
            jobs,
            loading,
            error,
<<<<<<< HEAD
            fetchJobs,
=======
            latestJobs,
            fetchJobs,
            fetchJobById,
            handleCreateJob,
>>>>>>> upstream/main
            handleUpdateJob,
            handleDeleteJob,
            fetchLatestJobs
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => {
    const context = useContext(JobContext);
    if (!context) {
        throw new Error('useJobs must be used within a JobProvider');
    }
    return context;
};