import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiPhone, FiMail, FiUser, FiStar } from 'react-icons/fi';
import CategoryCard from '../../UI/CategoryCard/CategoryCard.jsx';
import './ProfileDetails.css';

const BACKEND_URL = 'http://localhost:5000';

const ProfileDetails = ({ profile, isOwnProfile }) => {
    const navigate = useNavigate();
    const isProfessional = profile.role === 'professional' || profile.role === 'admin';

    return (
        <aside className="profile-sidebar-card">
            <div className="profile-avatar-container">
                {profile.profile_image_url ? (
                    <img src={`${BACKEND_URL}${profile.profile_image_url}`} alt={profile.name} className="profile-avatar-img" />
                ) : (
                    <FiUser size={36} className="default-avatar-icon" />
                )}
            </div>

            <div className="profile-identity">
                <h1>{profile.name}</h1>
                <p className="tagline">
                    {isProfessional ? (profile.tagline || 'Verified Architect Studio') : 'Registered Platform Client'}
                </p>
                {/* Rating display if professional has reviews */}
                {isProfessional && profile.average_rating && Number(profile.average_rating) > 0 && (
                    <div className="profile-rating-badge">
                        <FiStar className="star-icon" /> {Number(profile.average_rating).toFixed(1)} / 5
                    </div>
                )}
            </div>

            <div className="profile-contact-info">
                <div className="info-row"><FiPhone /> <span>{profile.phone || 'No voice link registered'}</span></div>
                <div className="info-row"><FiMail /> <span>{profile.email}</span></div>

                {isProfessional && profile.bio && (
                    <div className="profile-bio-summary-box">
                        <strong>About Me</strong>
                        <p>{profile.bio}</p>
                    </div>
                )}

                {isProfessional && profile.category_name && (
                    <div className="profile-categories-section">
                        <strong>Expertise Fields</strong>
                        <div className="profile-categories-tags">
                            {profile.category_name.split(',').map((cat, idx) => (
                                <span key={idx} className="category-pill-tag">{cat.trim()}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isProfessional && profile.category_ids && profile.category_ids.length > 0 && (
                <div className="profile-categories-section">
                    <strong>Expertise Fields</strong>
                    <div className="profile-categories-tags">
                        {profile.category_ids.map((categoryId) => (
                            <CategoryCard
                                key={categoryId}
                                categoryId={categoryId}
                                variant="pill"
                            />
                        ))}
                    </div>
                </div>
            )}

            {isOwnProfile && (
                <button onClick={() => navigate(`edit`)} className="edit-profile-btn">
                    <FiEdit2 /> Update Account Profile
                </button>
            )}
        </aside>
    );
};

export default ProfileDetails;