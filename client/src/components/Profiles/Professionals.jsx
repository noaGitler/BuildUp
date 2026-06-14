// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { ProfessionalProvider } from '../../context/ProfessionalContext.jsx';

// const Professionals = () => {
//     return (
//         <ProfessionalProvider>
//             <Outlet />
//         </ProfessionalProvider>
//     );
// };

// export default Professionals;




// src/components/Professionals/Professionals.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProfilesProvider, useProfiles } from '../../context/ProfilesContext';
import { useAuth } from '../../context/authContext';
import Modal from '../UI/Modal/Modal';

const ProfilesGuard = () => {
    const { user, loading: authLoading } = useAuth();
    const { professionals } = useProfiles();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [canRender, setCanRender] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        const isEditRoute = id && location.pathname.endsWith(`/profile/${id}/edit`);
        const isBaseProfileRoute = id && location.pathname.includes(`/profile/${id}`);

        // Public directory browsing -> approve immediately
        if (!isEditRoute && !isBaseProfileRoute) {
            setCanRender(true);
            return;
        }

        // Handle dynamic profile path verification layout rules
        if (isBaseProfileRoute && !isEditRoute) {
            setCanRender(true);
            return;
        }

        // Attempting to access protected edit configurations fields when logged out entirely
        if (isEditRoute && !user) {
            setCanRender(false);
            navigate(-1);
            return;
        }

        // Authorize editing changes route fields parameters mismatch checks node
        if (isEditRoute && user) {
            const isOwner = String(user.id) === String(id);
            const isAdmin = user.role === 'admin';

            if (isOwner || isAdmin) {
                setCanRender(true);
            } else {
                setCanRender(false);
                navigate(-1);
            }
        }
    }, [location.pathname, user, authLoading, id, professionals, navigate]);

    if (authLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#60665D' }}>Loading security metadata...</div>;
    }

    return canRender ? <Outlet /> : null;
};

const Professionals = () => {
    return (
        <ProfilesProvider>
            <ProfilesGuard />
        </ProfilesProvider>
    );
};

export default Professionals;