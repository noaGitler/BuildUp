import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiX, FiMapPin, FiInfo, FiDollarSign, FiUser, FiMail, FiPhone, FiEdit3, FiTrash2 } from 'react-icons/fi';

import { useAuth } from '../../../context/authContext';
import { useJobs } from '../../../context/JobContext';
import Modal from '../../UI/Modal/Modal.jsx';
import CategoryCard from '../../UI/CategoryCard/CategoryCard.jsx'; 

import './JobDetails.css';

const SERVER_URL = 'http://localhost:5000';

const JobDetails = ({ onClose }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const { handleDeleteJob, fetchJobById } = useJobs();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadCurrentJobData = async () => {
            try {
                setLoading(true);
                const data = await fetchJobById(id);
                if (isMounted) {
                    setJob(data);
                }
            } catch (err) {
                console.error("Failed to fetch job asset details:", err);
                if (isMounted) {
                    navigate('/jobs');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            loadCurrentJobData();
        }

        return () => { isMounted = false; };
    }, [id, fetchJobById, navigate]);

    if (loading) {
        return <div className="details-status-msg">Loading parameters...</div>;
    }

    if (!job) {
        return null;
    }

    const { client_id, title, description, budget, category_name, client_name, client_image, client_email } = job;
    const finalAvatarImg = client_image ? `${SERVER_URL}${client_image}` : null;

    const isMyJob = user?.id && Number(client_id) === Number(user.id);
    const isAdmin = user?.role === 'admin';

    // Custom delete modal management functions
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        try {
            await handleDeleteJob(id);
            if (onClose) onClose();
            navigate('/jobs');
        } catch (err) {
            alert("Failed to delete this job registry row. Please try again.");
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="job-details-view-container">

            {/* Close button and category tag */}
            <div className="job-details-header-action-row">
                
                <CategoryCard categoryName={category_name} isSelected={true} variant="pill" />
                
                <button className="details-close-btn-circle" onClick={() => navigate(-1)} title="Close Preview">
                    <FiX size={16} />
                </button>
            </div>

            <h2 className="job-details-main-title">{title}</h2>

            {/* Floating customer card with contact information */}
            <div className="job-details-client-float-card" onClick={() => navigate(`/profile/${client_id}`)}>
                <div className="client-avatar-wrapper">
                    {finalAvatarImg ? (
                        <img src={finalAvatarImg} alt={client_name} className="client-float-avatar-img" />
                    ) : (
                        <FiUser size={18} className="default-avatar-icon" />
                    )}
                    <h4 className="client-float-name">{client_name}</h4>
                </div>
            </div>

            {/* Extended job description area */}
            <div className="job-details-description-grand-space">
                <h3 className="description-section-heading">About The Position</h3>
                <p className="description-main-paragraph">{description}</p>
            </div>

            {/* Budget box */}
            <div className="job-details-budget-anchor-box">
                <div className="budget-anchor-inner">
                    <div className="budget-anchor-icon-side">
                        <FiDollarSign size={18} />
                    </div>
                    <div className="budget-anchor-text-side">
                        <span className="budget-anchor-label">Estimated Budget</span>
                        <span className="budget-anchor-value">
                            {budget ? `₪${Number(budget).toLocaleString()}` : "Open Budget"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit and delete actions panel aligned tightly to the right */}
            {(isMyJob || isAdmin) && (
                <div className="details-management-actions-inline">
                    <button
                        type="button"
                        className="btn-details btn-details-inline-edit-icon"
                        onClick={() => navigate(`/jobs/edit/${id}`)}
                        title="Edit Specifications Details"
                    >
                        <FiEdit3 />
                    </button>

                    <button
                        type="button"
                        className="btn-details btn-details-inline-delete-icon"
                        onClick={handleDeleteClick}
                        title="Delete Architecture Design Permanent"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            )}

            {/* Reusable confirmation Modal component injected smoothly inside the virtual dom tree */}
            <Modal
                isOpen={isDeleteModalOpen}
                title="Are you sure you want to delete?"
                message="This action will permanently delete all text descriptions and budget parameters from the live market trading feed."
                confirmText="Yes, Delete Opportunity"
                cancelText="Keep Job Posting"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                danger={true}
            />

        </div>
    );
};

export default JobDetails;