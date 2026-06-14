import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { JobProvider, useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/authContext';
import UnauthorizedView from '../Jobs/UnauthorizedView/UnauthorizedView.jsx';

const JobsGuard = () => {
    const { user, loading: authLoading } = useAuth();
    const { jobs } = useJobs();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        // Wait processing if user session authentication state is still loading
        if (authLoading) return;

        const isNewRoute = location.pathname.includes('/jobs/new') || id === 'new';
        const isEditRoute = id && location.pathname.includes(`/jobs/edit/`);

        // 3. New Job post creation rules constraint setup
        if (isNewRoute) {
            setCanRender(true);
            return;
        }

        // 4. Edit validation checkpoint layer: Creator owner verification match routine
        if (isEditRoute) {
            if (jobs.length === 0) return;

            const currentJob = jobs.find(j => j.id === Number(id));

            // If the jobs data context array state hasn't resolved yet, bypass redirect temporarily
            if (jobs.length > 0 && !currentJob) {
                setCanRender(false);
                navigate('/jobs', { replace: true });
                return;
            }

            if (currentJob) {
                const isOwner = Number(currentJob.client_id) === Number(user.id);
                const isAdmin = user.role === 'admin';

                if (isOwner || isAdmin) {

                    setCanRender(true);
                } else {
                    setCanRender(false);
                    navigate('/jobs', { replace: true });
                }
            }
        }

        // 1. Public baseline paths (browsing marketplace main listing feed)
        if (!isNewRoute && !isEditRoute) {
            setCanRender(true);
            return;
        }

        // 2. Guest protection layer: Strict block for protected creation/editing actions
        if (!user) {
            setCanRender(false);
            navigate('/login', { replace: true, state: { from: location } });
            return;
        }

    }, [location.pathname, user, authLoading, id, jobs, navigate]);

    if (authLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#60665D' }}>Loading security context...</div>;
    }

    // Soft-wall view setup for guests trying to access public marketplace layouts
    if (!user && !location.pathname.includes('/new') && !location.pathname.includes('/edit/')) {
        return <UnauthorizedView />;
    }

    return canRender ? <Outlet /> : null;
};

const Jobs = () => {
    return (
        <JobProvider>
            <JobsGuard />
        </JobProvider>
    );
};

export default Jobs;