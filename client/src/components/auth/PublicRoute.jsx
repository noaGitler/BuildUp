import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; 
    }

    // If user is authenticated, redirect to home page
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;