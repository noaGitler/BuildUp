import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/authContext.jsx';
import { FavoriteProvider } from '../../context/FavoriteContext';
import { ProjectProvider } from '../../context/ProjectContext.jsx';

import ProjectsPage from './ProjectsPage/ProjectsPage.jsx';
import Modal from '../UI/Modal/Modal';

const FavoritesGuard = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    
    const [canRender, setCanRender] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        const isFavoritesRoute = location.pathname.includes('/favorites');

        if (isFavoritesRoute) {
            // Condition 1: Anonymous browsing - block render and fire up your custom Modal trigger
            if (!user) {
                setCanRender(false);
                setIsModalOpen(true);
                return;
            }

            // Condition 2: Verified session check against potential path tampering attempts
            if (id && Number(id) !== user.id) {
                setCanRender(false);
                navigate(-1); // Safety fallback mechanism
                return;
            }

            // All clear - safe context boundaries verified
            setCanRender(true);
        }
    }, [user, authLoading, id, location.pathname, navigate]);

    if (authLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#60665D' }}>
                Loading security verification metrics...
            </div>
        );
    }

    /**
     * Rejects the identity alignment action, shifting client browser history backward.
     */
    const handleCancelAction = () => {
        setIsModalOpen(false);
        navigate(-1); // Bounce back to the previous workspace screen instance
    };

    /**
     * Validates and processes the request to launch account configuration alignment routes.
     */
    const handleConfirmAction = () => {
        setIsModalOpen(false);
        navigate('/login'); // Route directly to login page view node
    };

    return (
        <>
            {/* Render the standard shared workspace layout, setting the internal context flags */}
            {canRender ? <ProjectsPage isFavoritesPage={true} /> : null}

            {/* Utilizing your custom reusable modal structure with explicit programmatic handlers */}
            <Modal
                isOpen={isModalOpen}
                title="View Stored Favorites?"
                message="To save design assets and view your personalized inspiration boards, please authenticate your profile."
                confirmText="Log In"
                cancelText="Cancel"
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
            />
        </>
    );
};

const Favorites = () => {
    return (
        <ProjectProvider>
            <FavoriteProvider>
                <FavoritesGuard />
            </FavoriteProvider>
        </ProjectProvider>
    );
};

export default Favorites;