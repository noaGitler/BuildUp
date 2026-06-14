
// src/context/JobContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import jobService from '../services/jobService';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    // פונקציית עדכון
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

    // פונקציית מחיקת משרה
    const handleDeleteJob = useCallback(async (id, userId) => {
        try {
            setError(null);
            const result = await jobService.deleteJob(id, userId);

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
            fetchJobs,
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