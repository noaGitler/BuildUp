import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUser, FiClock } from 'react-icons/fi';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import { useJobs } from '../../../context/JobContext';
import CategoryCard from '../../UI/CategoryCard/CategoryCard.jsx';
import './JobCard.css';

const SERVER_URL = 'http://localhost:5000';

const JobCard = ({ id, client_id, category_id, title, budget, category_name, client_name, client_image, created_at, isActive, onRefresh }, ShowManagement) => {
    const navigate = useNavigate();
    const { id: currentUrlId } = useParams();

    const finalAvatarImg = client_image ? `${SERVER_URL}${client_image}` : null;

    const handleCardClick = (e) => {
        e.stopPropagation();
        navigate(`/jobs/${id}`);
    };

    return (
        <div className={`job-feed-card ${isActive ? 'active-job-card-selected' : ''}`} onClick={handleCardClick} >
            <div className="card-body-wrapper">

                <div className="card-category-badge-row">
                    <CategoryCard categoryName={category_name} variant="pill" />

                    <span className="card-time-posted">
                        <FiClock size={12} /> {formatRelativeTime(created_at)}
                    </span>
                </div>

                <h3 className="card-display-title">{title}</h3>

                <div className="card-creator-profile-footer">
                    <div className="creator-profile-identity" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/professionals/${client_id}`);
                    }}>
                        {finalAvatarImg ? (
                            <img src={finalAvatarImg} alt={client_name} className="creator-profile-avatar-img" />
                        ) : (
                            <div className="creator-avatar-icon-fallback-box"><FiUser /></div>
                        )}
                        <span className="creator-display-profile-name">By {client_name}</span>
                    </div>

                    <div className="card-budget-display-tag">
                        <span className="budget-label">Estimated Budget:</span>
                        <span className="budget-amount">{budget ? `₪${budget}` : "Open Budget"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobCardActions = ({ onEdit, onDelete }) => {
    return (
        <div className="job-card-actions-wrapper">
            <button
                type="button"
                className="btn-card-action edit-blue-modifier"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
                title="Edit Job"
            >
                <FiEdit2 />
            </button>
            <button
                type="button"
                className="btn-card-action delete-red-modifier"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                title="Delete Job"
            >
                <FiTrash2 />
            </button>
        </div>
    );
};

const formatRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const elapsed = now - past;

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    if (elapsed < msPerMinute) {
        return 'Just now';
    } else if (elapsed < msPerHour) {
        return `${Math.round(elapsed / msPerMinute)}m ago`;
    } else if (elapsed < msPerDay) {
        return `${Math.round(elapsed / msPerHour)}h ago`;
    } else {
        return `${Math.round(elapsed / msPerDay)}d ago`;
    }
};

export default JobCard;