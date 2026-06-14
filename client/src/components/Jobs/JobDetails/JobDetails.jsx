
// src/components/Jobs/JobDetails/JobDetails.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 🌟 ייבוא הניווט כדי למנוע קריסה בלינקים
import { FiX, FiMapPin, FiInfo, FiDollarSign, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import './JobDetails.css';

const SERVER_URL = 'http://localhost:5000';

const JobDetails = ({ job, onClose }) => {
    const navigate = useNavigate();

    if (!job) return null;

    const {
        id,
        client_id,
        title,
        description,
        budget,
        category_name,
        client_name,
        client_image,
        client_description,
        client_location,
        client_email, 
        client_phone  
    } = job;

    const finalAvatarImg = client_image ? `${SERVER_URL}${client_image}` : null;

    return (
        <div className="job-details-view-container">

            {/* קומה 1: הכתר - כפתור סגירה ותג קטגוריה */}
            <div className="job-details-header-action-row">
                <span className="details-category-badge">{category_name}</span>
                <button className="details-close-btn-circle" onClick={onClose} title="Close Preview">
                    <FiX size={16} />
                </button>
            </div>

            {/* כותרת המשרה הבולטת */}
            <h2 className="job-details-main-title">{title}</h2>

            {/* קומה 2: כרטיס הלקוח הצף המשודרג עם פרטי התקשרות */}
            <div className="job-details-client-float-card" onClick={() => navigate(`/profile/${client_id}`)}>
                <div className="client-avatar-wrapper">
                    {finalAvatarImg ? (
                        <img src={finalAvatarImg} alt={client_name} className="client-float-avatar-img" />
                    ) : (
                        <div className="client-float-avatar-fallback">{client_name?.charAt(0)}</div>
                    )}
                </div>
                <div className="client-float-info-box">
                    <h4 className="client-float-name">{client_name}</h4>

                    {client_location && (
                        <span className="client-float-meta-item">
                            <FiMapPin size={13} /> {client_location}
                        </span>
                    )}

                    {client_description && (
                        <p className="client-float-bio-text">
                            <FiInfo size={13} style={{ flexShrink: 0 }} /> {client_description}
                        </p>
                    )}

                    {/* בלוק פרטי התקשרות */}
                    <div className="client-contact-channels-row" onClick={(e) => e.stopPropagation()}>
                        {client_email && (
                            <a href={`mailto:${client_email}`} className="contact-link-badge" title="Send Email">
                                <FiMail size={12} /> {client_email}
                            </a>
                        )}
                        {client_phone && (
                            <a href={`tel:${client_phone}`} className="contact-link-badge" title="Call Client">
                                <FiPhone size={12} /> {client_phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* קומה 3: לב הרכיב - שטח תיאור המשרה המורחב */}
            <div className="job-details-description-grand-space">
                <h3 className="description-section-heading">About The Position</h3>
                <p className="description-main-paragraph">{description}</p>
            </div>

            {/* קופסת התקציב כעוגן בתחתית הפאנל */}
            <div className="job-details-budget-anchor-box">
                <div className="budget-anchor-inner">
                    <div className="budget-anchor-icon-side">
                        <FiDollarSign size={18} />
                    </div>
                    <div className="budget-anchor-text-side">
                        <span className="budget-anchor-label">Estimated Budget</span>
                        <span className="budget-anchor-value">
                            {budget ? `₪${Number(budget).toLocaleString()}` : "Open Budget / Unspecified"}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default JobDetails;