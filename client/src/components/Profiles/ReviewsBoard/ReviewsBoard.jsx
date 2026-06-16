import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiMessageSquare, FiSend } from 'react-icons/fi';
import ReviewCard from '../ReviewCard/ReviewCard.jsx';
import './ReviewsBoard.css';

const ReviewsBoard = ({ reviews, user, handleReviewSubmit, handleDeleteReview, handleEditReview }) => {
    const { id: professionalId } = useParams();
    
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canLeaveReview = user && String(user.id) !== String(professionalId);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        
        setIsSubmitting(true);
        setError('');
        
        const payload = { review_text: reviewText.trim(), rating: Number(rating), user_id: user.id };
        const res = await handleReviewSubmit(payload);
        
        if (res && res.success) {
            setReviewText('');
            setRating(5);
            setHoverRating(0);
        } else {
            setError(res?.message || 'Failed to submit review.');
        }
        setIsSubmitting(false);
    };

    const renderAddForm = () => {
        if (!canLeaveReview) return null;
        
        return (
            <form onSubmit={handleAddSubmit} className="add-review-integrated-form">
                <h3 className="form-title">Leave a Testimonial</h3>
                {error && <p className="review-error-msg">{error}</p>}
                
                <div className="rating-interactive-selector">
                    <span className="rating-label">Experience Rating:</span>
                    <div className="stars-interactive-group" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((starValue) => {
                            const isFilled = starValue <= (hoverRating || rating);
                            return (
                                <button key={starValue} type="button" className="star-icon-btn" onMouseEnter={() => setHoverRating(starValue)} onClick={() => setRating(starValue)}>
                                    <FiStar className={`rating-star-icon ${isFilled ? 'filled' : 'empty'}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <textarea 
                    className="review-text-input"
                    value={reviewText} 
                    onChange={(e) => setReviewText(e.target.value)} 
                    placeholder="Describe the creative process, communication, and final results..." 
                    rows={4} required 
                />
                <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
                    <FiSend /> {isSubmitting ? 'Publishing...' : 'Publish Review'}
                </button>
            </form>
        );
    };

    return (
        <div className="reviews-interactive-block">
            
            {renderAddForm()}

            <div className="reviews-feed-cards-list">
                {!reviews || reviews.length === 0 ? (
                    <div className="empty-reviews-notice-box">
                        <FiMessageSquare size={32} className="empty-icon" />
                        <p>No client reviews have been published for this workspace yet.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard 
                            key={review.id} 
                            review={review} 
                            user={user} 
                            onEditReview={handleEditReview} 
                            onDeleteReview={handleDeleteReview} 
                        />
                    ))
                )}
            </div>
            
        </div>
    );
};

export default ReviewsBoard;