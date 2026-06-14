// src/components/Jobs/Jobs.jsx
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { JobProvider } from '../../context/JobContext';
import { useAuth } from '../../context/authContext';

const Jobs = () => {
    const { user } = useAuth(); 
    const location = useLocation();

    // בדיקת אבטחה: אם מישהו מנסה להגיע לנתיב היצירה והוא לא מחובר
    if (location.pathname.endsWith('/new') && !user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <JobProvider>
            <Outlet />
        </JobProvider>
    );
};

export default Jobs;