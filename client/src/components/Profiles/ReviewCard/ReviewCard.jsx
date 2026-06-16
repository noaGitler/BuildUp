import React, { useState } from 'react';
import { FiStar, FiUser, FiEdit3, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import './ReviewCard.css';

const ReviewCard = ({ review, user, onEditReview, onDeleteReview }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editReviewText, setEditReviewText] = useState(review.review_text);
    const [editRating, setEditRating] = useState(review.rating);
    const [editHoverRating, setEditHoverRating] = useState(0);
    const [editError, setEditError] = useState('');
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);

    // --- Helpers ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDisplayRole = () => {
        const rawRole = review.reviewer_role || review.role || 'client';
        return rawRole.toLowerCase() === 'professional' 
        ? 'Professional' 
        : (rawRole.toLowerCase() === 'admin' ? 'Admin' : 'Client');
    };

    const getPermissions = () => {
        if (!user) return { canEdit: false, canDelete: false };
        const isOwner = String(user.id) === String(review.user_id);
        const isAdmin = user.role === 'admin';
        return {
            canEdit: isOwner || isAdmin,
            canDelete: isOwner || isAdmin
        };
    };

    // --- Actions ---
    const startEditing = () => {
        setIsEditing(true);
        setEditReviewText(review.review_text);
        setEditRating(review.rating);
        setEditHoverRating(0);
        setEditError('');
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditError('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editReviewText.trim()) return;

        setIsEditSubmitting(true);
        setEditError('');

        const payload = { review_text: editReviewText.trim(), rating: Number(editRating) };
        const res = await onEditReview(review.id, payload);

        if (res && res.success) {
            setIsEditing(false);
        } else {
            setEditError(res?.message || 'Failed to update review.');
        }
        setIsEditSubmitting(false);
    };

    const renderInteractiveStars = () => (
        <div className="stars-interactive-group inline-edit-stars" onMouseLeave={() => setEditHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (editHoverRating || editRating);
                return (
                    <button key={star} type="button" className="star-icon-btn" onMouseEnter={() => setEditHoverRating(star)} onClick={() => setEditRating(star)}>
                        <FiStar className={`rating-star-icon ${isFilled ? 'filled' : 'empty'}`} />
                    </button>
                );
            })}
        </div>
    );

    const { canEdit, canDelete } = getPermissions();
    const displayRole = getDisplayRole();

    return (
        <div className={`individual-review-feed-card ${isEditing ? 'editing-mode' : ''}`}>
            <div className="review-card-header">
                <div className="reviewer-meta-group">
                    <div className="reviewer-avatar-placeholder"><FiUser /></div>
                    <div className="reviewer-identity">
                        <strong className="reviewer-name-txt">{review.reviewer_name || 'Anonymous User'}</strong>
                        <span className="review-timestamp-role">{displayRole} • {formatDate(review.created_at)}</span>
                    </div>
                </div>

                {!isEditing && (
                    <div className="review-stars-static-badge">
                        {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < review.rating ? "star-filled" : "star-empty"} />
                        ))}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="inline-edit-container">
                    {editError && <p className="review-error-msg">{editError}</p>}
                    <div className="inline-edit-rating-row">
                        <span className="rating-label">Update Rating:</span>
                        {renderInteractiveStars()}
                    </div>
                    <textarea
                        className="review-text-input edit-mode-input"
                        value={editReviewText}
                        onChange={(e) => setEditReviewText(e.target.value)}
                        rows={3} required
                    />
                    <div className="inline-edit-actions">
                        <button type="button" onClick={handleEditSubmit} className="btn-save-inline" disabled={isEditSubmitting}>
                            <FiCheck /> {isEditSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={cancelEditing} className="btn-cancel-inline" disabled={isEditSubmitting}>
                            <FiX /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <p className="review-card-body-text">{review.review_text}</p>

                    {(canEdit || canDelete) && (
                        <div className="review-card-footer">
                            {canEdit && (
                                <button type="button" onClick={startEditing} className="btn-review-circle-action edit-icon" title="Edit Review">
                                    <FiEdit3 />
                                </button>
                            )}
                            {canDelete && (
                                <button type="button" onClick={() => onDeleteReview(review.id)} className="btn-review-circle-action delete-icon" title="Delete Review">
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewCard;