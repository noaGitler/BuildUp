// src/components/Home/HomePage.jsx
import React from 'react';
import { useAuth } from '../../context/authContext.jsx';
import { ProjectProvider } from '../../context/ProjectContext';
import DashboardHome from './DashboardHome/DashboardHome.jsx';
import LandingHome from './LandingHome/LandingHome.jsx';

const HomeGuard = () => {
    const { user } = useAuth();

    // Conditional routing: Render dashboard if logged in, otherwise show marketing page
    return user ? <DashboardHome /> : <LandingHome />;
};

const HomePage = () => {
    return (
        <ProjectProvider>
            <HomeGuard />
        </ProjectProvider>
    );
};

export default HomePage;