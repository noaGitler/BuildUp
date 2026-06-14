import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProjectProvider, useProjects } from '../../context/ProjectContext';
import { FavoriteProvider } from '../../context/FavoriteContext';
import { CommentProvider } from '../../context/CommentContext';
import { useAuth } from '../../context/authContext';
import Modal from '../UI/Modal/Modal';

const ProjectsGuard = () => {
    const { user, loading: authLoading } = useAuth();
    const { projects } = useProjects();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [canRender, setCanRender] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // If the Auth is still loading, we will wait
        if (authLoading) return;

        const isNewRoute = location.pathname.endsWith('/projects/new');
        const isEditRoute = id && location.pathname.endsWith(`/projects/${id}/edit`);
        const isFavoritesRoute = location.pathname.includes('/favorites');

        // Public paths (feed, project details) -> approve immediately
        if (!isNewRoute && !isEditRoute) {
            setCanRender(true);
            return;
        }

        // Attempting to access a protected path when no user is logged in at all
        if (!user) {
            setCanRender(false);
            navigate(-1);
            return;
        }

        // Attempting to access new when a simple user is logged in
        if (isNewRoute) {
            if (user.role === 'professional' || user.role === 'admin') {
                setCanRender(true);
            } else {
                setCanRender(false);
                navigate(-1);
            }
            return;
        }


        if (isFavoritesRoute && !user) {
            return <AuthModal onOpen={true} />;
        }

        // Attempted editing access to a project that does not belong to the logged in user
        if (isEditRoute) {
            const currentProject = projects.find(p => p.id === Number(id));

            if (!currentProject) {
                setCanRender(false);
                navigate(-1);
                return;
            }

            const isOwner = currentProject.professional_id === user.id;
            const isAdmin = user.role === 'admin';

            if (isOwner || isAdmin) {
                setCanRender(true);
            } else {
                setCanRender(false);
                navigate(-1);
            }
        }

    }, [location.pathname, user, authLoading, id, projects, navigate]);


    // Rejects the identity alignment action, shifting client browser history backward.
    const handleCancelAction = () => {
        setIsModalOpen(false);
        navigate(-1);
    };

    // Validates and processes the request to launch account configuration alignment routes.
    const handleConfirmAction = () => {
        setIsModalOpen(false);
        navigate('/login');
    };

    if (authLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return canRender ? <Outlet /> : (
        <>
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
    );;
};

const Projects = () => {
    return (
        <FavoriteProvider>
            <CommentProvider>
                <ProjectsGuard />
            </CommentProvider>
        </FavoriteProvider>
    );
};

export default Projects;