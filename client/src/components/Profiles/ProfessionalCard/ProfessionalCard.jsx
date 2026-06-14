import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiStar, FiHome, FiLayers, FiCompass, FiCpu, FiGrid } from 'react-icons/fi';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from "react-icons/fa6";

import { useCategories } from '../../../context/categoryContext';
import { useAuth } from '../../../context/authContext';

import './ProfessionalCard.css';

const BACKEND_URL = 'http://localhost:5000';

const ProfessionalCard = ({ professional }) => {
    const navigate = useNavigate();
    const { categories } = useCategories();
    const { user } = useAuth();

    const hasAssignedCategories = user?.categoryIds && user.categoryIds.length > 0;

    const allowedCategories = hasAssignedCategories
        ? categories.filter(cat => user.categoryIds.includes(cat.id))
        : categories;

    // Render multiple category icons from the comma separated string list
    const renderCategoryIcons = () => {
        if (!professional.category_name) return null;
        const catNames = professional.category_name.split(',');

        return (
            <div className="professional-card-icons-bar">
                {catNames.map((catString, idx) => {
                    const cleanName = catString.trim();
                    
                    const category = categories.find(c => c.name.toLowerCase() === cleanName.toLowerCase());

                    if (!category) return null;

                    let IconComponent = FiLayers;
                    if (category.icon_url) {
                        if (category.icon_url.startsWith('Md') && MdIcons[category.icon_url]) {
                            IconComponent = MdIcons[category.icon_url];
                        } else if (category.icon_url.startsWith('Fa') && FaIcons[category.icon_url]) {
                            IconComponent = FaIcons[category.icon_url];
                        }
                    }

                    const catColor = category.color_hex || '#557A61';

                    return (
                        <span 
                            key={idx} 
                            className="category-icon-badge-item"
                            title={category.name}
                            style={{ 
                                color: catColor, 
                                backgroundColor: `${catColor}1A`
                            }}
                        >
                            <IconComponent />
                        </span>
                    );
                })}
            </div>
        );
    };

    // Construct full safe backend image path URL for rendering matching web view standards
    const getAvatarUrl = () => {
        if (!professional.profile_image_url) {
            return `${BACKEND_URL}/uploads/profiles/anonymous.png`;
        }
        const cleanUrl = professional.profile_image_url.replace(/\\/g, '/');
        if (cleanUrl.startsWith('http')) {
            return cleanUrl;
        }
        if (cleanUrl.includes('uploads/')) {
            return `${BACKEND_URL}/${cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl}`;
        }
        return `${BACKEND_URL}/uploads/profiles/${cleanUrl}`;
    };

    return (
        <div className="professional-grid-card" onClick={() => navigate(`/profile/${professional.id}`)}>
            <div className="card-image-wrapper">
                <img
                    src={getAvatarUrl()}
                    alt=""
                    className="professional-card-avatar"
                />
            </div>
            <div className="professional-card-content">
                {/* Title and icons are decoupled and stacked cleanly in vertical layout */}
                <div className="professional-card-identity-block">
                    <h3 className="professional-card-title">{professional.name}</h3>
                    {renderCategoryIcons()}
                </div>

                <p className="professional-card-tagline">{professional.tagline || 'Creative Visionary'}</p>

                <div className="professional-card-meta">
                    <span className="meta-item"><FiMapPin /> {professional.city || 'Israel'}</span>
                    {professional.average_rating && Number(professional.average_rating) > 0 && (
                        <span className="meta-item rating">
                            <FiStar /> {Number(professional.average_rating).toFixed(1)}
                        </span>
                    )}
                </div>

                <Link to={`/profile/${professional.id}`} className="btn-view-profile-link">
                    Explore Portfolio
                </Link>
            </div>
        </div>
    );
};

export default ProfessionalCard;






// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMapPin, FiStar, FiLayers } from 'react-icons/fi';
// import * as MdIcons from 'react-icons/md';
// import * as FaIcons from "react-icons/fa6";

// import { useCategories } from '../../../context/categoryContext.jsx';
// import './ProfessionalCard.css';

// const BACKEND_URL = 'http://localhost:5000';

// const ProfessionalCard = ({ professional }) => {
//     const navigate = useNavigate();
//     const { categories } = useCategories();

//     const renderCategoryIcons = () => {
//         if (!professional.category_name) return null;

//         const catNames = professional.category_name.split(',');

//         return (
//             <div className="professional-card-icons-bar">
//                 {catNames.map((catString, idx) => {
//                     const catName = catString.trim();
                    
//                     const category = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());

//                     if (!category) return null;

//                     let IconComponent = FiLayers;
//                     if (category.icon_url && category.icon_url.startsWith('Md')) {
//                         IconComponent = MdIcons[category.icon_url];
//                     } else if (category.icon_url && category.icon_url.startsWith('Fa')) {
//                         IconComponent = FaIcons[category.icon_url];
//                     }

//                     const catColor = category.color_hex || '#557A61';

//                     return (
//                         <span 
//                             key={idx} 
//                             className="category-icon-badge-item"
//                             title={category.name}
//                             style={{ 
//                                 color: catColor, 
//                                 backgroundColor: `${catColor}1A`
//                             }}
//                         >
//                             <IconComponent />
//                         </span>
//                     );
//                 })}
//             </div>
//         );
//     };

//     const getAvatarUrl = () => {
//         if (!professional.profile_image_url) {
//             return `${BACKEND_URL}/uploads/profiles/anonymous.png`;
//         }
//         const cleanUrl = professional.profile_image_url.replace(/\\/g, '/');
//         if (cleanUrl.startsWith('http')) return cleanUrl;
//         if (cleanUrl.includes('uploads/')) {
//             return `${BACKEND_URL}/${cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl}`;
//         }
//         return `${BACKEND_URL}/uploads/profiles/${cleanUrl}`;
//     };

//     return (
//         <div className="professional-grid-card" onClick={() => navigate(`/profile/${professional.id}`)}>
//             <div className="card-image-wrapper">
//                 <img
//                     src={getAvatarUrl()}
//                     alt={professional.name}
//                     className="professional-card-avatar"
//                 />
//             </div>
//             <div className="professional-card-content">
//                 <div className="professional-card-identity-block">
//                     <h3 className="professional-card-title">{professional.name}</h3>
//                     {renderCategoryIcons()}
//                 </div>

//                 <p className="professional-card-tagline">{professional.tagline || 'Creative Visionary'}</p>

//                 <div className="professional-card-meta">
//                     <span className="meta-item"><FiMapPin /> {professional.city || 'Israel'}</span>
//                     {professional.average_rating && Number(professional.average_rating) > 0 && (
//                         <span className="meta-item rating">
//                             <FiStar /> {Number(professional.average_rating).toFixed(1)}
//                         </span>
//                     )}
//                 </div>

//                 <div className="btn-view-profile-link">
//                     Explore Portfolio
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfessionalCard;