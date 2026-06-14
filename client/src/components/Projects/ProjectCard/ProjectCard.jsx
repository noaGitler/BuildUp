import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiExternalLink, FiUser } from 'react-icons/fi';
import CategoryCard from '../../UI/CategoryCard/CategoryCard';
import './ProjectCard.css';

const SERVER_URL = 'http://localhost:5000';

const ProjectCard = ({ id, title, cover_image_url, professional_id, professional_name, professional_image, professional_tagline, category_id }) => {
    const navigate = useNavigate();

    // Compiling the image asset paths dynamically with strict safe fallbacks
    const finalCoverImg = cover_image_url ? `${SERVER_URL}${cover_image_url}` : '/assets/placeholder-cover.png';
    const finalAvatarImg = professional_image ? `${SERVER_URL}${professional_image}` : null;

    return (
        <div className="project-feed-card">
            {/* Visual Media Header Section Area */}
            <div className="card-media-box">
                <img
                    src={finalCoverImg}
                    alt={title}
                    className="card-cover-asset-img"
                    loading="lazy"
                />
                <div className="card-media-hover-mask" onClick={() => navigate(`/projects/${id}`)}>
                    <span className="mask-action-trigger-badge">
                        <FiExternalLink /> View Details
                    </span>
                </div>
            </div>

            {/* Content Details and Professional Identity Context Area */}
            <div className="card-body-wrapper">

                {category_id && (
                    <div style={{ marginBottom: '10px' }}>
                        <CategoryCard categoryId={category_id} variant="pill" />
                    </div>
                )}

                <h3 className="card-display-title">{title}</h3>

                <div className="card-creator-profile-footer">
                    {/* Render thumbnail profile image avatar or fallback default icon */}
                    {finalAvatarImg ? (
                        <img
                            src={finalAvatarImg}
                            alt={professional_name}
                            className="creator-profile-avatar-img"
                        />
                    ) : (
                        <div className="creator-avatar-icon-fallback-box">
                            <FiUser />
                        </div>
                    )}

                    <div className="creator-metadata-text-group">
                        <h4 className="creator-display-profile-name">{professional_name}</h4>
                        <p className="creator-display-profile-tagline">
                            {professional_tagline || "Verified Professional"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};




export default ProjectCard;