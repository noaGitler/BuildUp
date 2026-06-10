import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuMessageSquareOff, LuMessageSquareMore } from "react-icons/lu";
import { FiVolume2, FiMessageSquare, FiArrowLeft, FiUser, FiChevronLeft, FiChevronRight, FiEdit3, FiTrash2, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

import projectService from '../../../services/projectService';
import { useAuth } from '../../../context/authContext.jsx';
import { useProjects } from '../../../context/ProjectContext';
import { useFavorites } from '../../../context/FavoriteContext';

import CommentList from '../Comments/CommentList/CommentList.jsx';
import Modal from '../../UI/Modal/Modal.jsx';
import './ProjectDetails.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { deleteProject } = useProjects();

    // Inject favorite action controllers and matching primary identity state metrics
    const { isProjectFavorited, addFavorite, removeFavorite } = useFavorites();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const SERVER_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchCompleteDetails = async () => {
            try {
                setLoading(true);
                const result = await projectService.getProjectById(id);
                if (result.success) {
                    setProject(result.data);
                } else {
                    setError(result.message || "Project not found.");
                }
            } catch (err) {
                setError("Failed to compile project architecture overview.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompleteDetails();
    }, [id]);

    if (loading) return <div className="details-status-msg">Fetching complete project architecture map...</div>;
    if (error) return <div className="details-status-msg error">{error}</div>;
    if (!project) return null;

    const { title, description, professional_id, professional_name, professional_image, professional_tagline, mediaFiles = [] } = project;

    const activeMedia = mediaFiles[currentMediaIndex];
    const showLeftArrow = currentMediaIndex > 0;
    const showRightArrow = currentMediaIndex < mediaFiles.length - 1;

    const handleNextMedia = () => {
        if (showRightArrow) setCurrentMediaIndex(prev => prev + 1);
    };

    const handlePrevMedia = () => {
        if (showLeftArrow) setCurrentMediaIndex(prev => prev - 1);
    };

    // Strict validation authorization rule mapping
    const canEdit = user && (
        Number(user.id) === Number(project.professional_id) || user.role === 'admin'
    );

    // Handling deletion operations
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        const result = await deleteProject(id);
        if (result.success) {
            navigate(-1);
        } else {
            setDeleteError("Could not delete this architecture asset.");
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    // Handles the asynchronous favorite click event chain locally and updates backend tables.
    const handleFavoriteToggle = async () => {
        if (isTogglingFavorite || !user) return;

        try {
            setIsTogglingFavorite(true);
            const projectIdNumber = Number(id);

            if (isProjectFavorited(projectIdNumber)) {
                await removeFavorite(projectIdNumber);
            } else {
                await addFavorite(projectIdNumber);
            }
        } catch (err) {
            console.error("Failed to alter favorite registration link status:", err);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const finalAvatarImg = professional_image ? `${SERVER_URL}${professional_image}` : null;
    const favorited = isProjectFavorited(Number(id));

    return (
        <div className="project-details-view-container">
            {/* Top Bar with Clean Back Trigger */}
            <div className="details-navigation-header">
                <button className="back-navigation-link-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back to Feed
                </button>
            </div>

            <div className="details-layout-main-grid">

                {/* Hero Showcase Display Panel */}
                <div className="details-hero-display-panel">
                    {mediaFiles.length > 0 && activeMedia ? (
                        <div className="carousel-view-slider-wrapper">
                            {activeMedia.media_type === 'image' && (
                                <img src={`${SERVER_URL}${activeMedia.media_url}`} alt={title} className="hero-display-fluid-img" />
                            )}

                            {activeMedia.media_type === 'video' && (
                                <video src={`${SERVER_URL}${activeMedia.media_url}`} controls className="hero-display-fluid-video" />
                            )}

                            {activeMedia.media_type === 'audio' && (
                                <div className="hero-display-audio-fallback-container">
                                    <FiVolume2 className="fallback-audio-giant-icon" />
                                    <audio controls src={`${SERVER_URL}${activeMedia.media_url}`} className="html5-audio-element-track" />
                                </div>
                            )}

                            {showLeftArrow && (
                                <button type="button" className="carousel-control-arrow-btn arrow-left-pos" onClick={handlePrevMedia}>
                                    <FiChevronLeft />
                                </button>
                            )}

                            {showRightArrow && (
                                <button type="button" className="carousel-control-arrow-btn arrow-right-pos" onClick={handleNextMedia}>
                                    <FiChevronRight />
                                </button>
                            )}

                            <div className="carousel-pagination-index-badge">
                                {currentMediaIndex + 1} / {mediaFiles.length}
                            </div>
                        </div>
                    ) : (
                        <div className="hero-display-placeholder" />
                    )}
                </div>

                {/* Text Metadata Panel */}
                <div className="details-text-metadata-panel">
                    <div className="details-header-title-row">


                        <div className="details-actions-wrapper-right">
                            {/* Condition rule: The interactive heart toggle icon only renders if user profile session exists */}
                            {user && (
                                <button
                                    type="button"
                                    className={`btn-details-favorite-toggle ${favorited ? 'active-filled' : ''}`}
                                    onClick={handleFavoriteToggle}
                                    disabled={isTogglingFavorite}
                                    style={{ color: favorited ? '#557A61' : '#60665D', }}
                                    title={favorited ? "Remove from Favorites" : "Save to Favorites"}
                                >
                                    {favorited ? <FaHeart /> : <FiHeart />}
                                </button>
                            )}

                            {canEdit && (
                                <div className="details-management-actions-inline">
                                    <button
                                        type="button"
                                        className="btn-details btn-details-inline-edit-icon"
                                        onClick={() => navigate(`/projects/${id}/edit`)}
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
                        </div>
                    </div>

                    <h1 className="details-main-heading-title">{title}</h1>

                    <p className="details-description-body-paragraph">{description}</p>

                    <p className="project-date">
                        {new Date(project.created_at).toLocaleString([], {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>

                    {/* New Section: Professional Identity Business Profile Context Display Block */}
                    <div className="details-professional-author-card" onClick={() => navigate(`/professionals/${professional_id}`)}>
                        <h4 className="professional-section-mini-label">Designed By</h4>
                        <div className="professional-card-identity-wrapper">
                            {finalAvatarImg ? (
                                <img src={finalAvatarImg} alt={professional_name} className="details-pro-avatar-img" />
                            ) : (
                                <div className="details-pro-avatar-icon-fallback">
                                    <FiUser />
                                </div>
                            )}
                            <div className="details-pro-text-metadata">
                                <h3 className="details-pro-display-name">{professional_name || "Anonymous Professional"}</h3>
                                <p className="details-pro-display-tagline">{professional_tagline || "Verified Professional"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Interactive Actions Buttons Block */}
                    <div className="details-cta-actions-button-block">
                        <button
                            type="button"
                            className="btn-details-cta secondary-comment-trigger"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <LuMessageSquareMore /> View Comments
                        </button>

                    </div>
                    {showComments && <CommentList projectId={id} />}
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                title="Confirm Permanent Deletion"
                message="Are you absolutely sure you want to authorize and commit the removal of this project asset? This will permanently wipe all text descriptions and media slots from the persistent server layers catalog."
                confirmText="Yes, Delete Asset"
                cancelText="Keep Project Design"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default ProjectDetails;