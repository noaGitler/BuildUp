// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { FiStar, FiMessageSquare, FiTrash2, FiSend, FiUser } from 'react-icons/fi';
// import './ReviewsBoard.css';

// const ReviewsBoard = ({ reviews, user, handleReviewSubmit, handleDeleteReview, handleEditReview }) => {
//     const { id: professionalId } = useParams();

//     const [reviewText, setReviewText] = useState('');
//     const [rating, setRating] = useState(5);
//     const [hoverRating, setHoverRating] = useState(0);
//     const [error, setError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const onSubmit = async (e) => {
//         e.preventDefault();
//         if (!reviewText.trim()) return;
        
//         setIsSubmitting(true);
//         setError('');
        
//         const payload = {
//             review_text: reviewText.trim(),
//             rating: Number(rating),
//             user_id: user.id
//         };

//         const res = await handleReviewSubmit(payload);
//         if (res && res.success) {
//             setReviewText('');
//             setRating(5);
//             setHoverRating(0);
//         } else {
//             setError(res?.message || 'Failed to submit review.');
//         }
//         setIsSubmitting(false);
//     };

//     // Format date string gracefully
//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString('en-US', options);
//     };

//     const canLeaveReview = user && String(user.id) !== String(professionalId);

//     return (
//         <div className="reviews-interactive-block">
            
//             {/* Review Creation Form */}
//             {canLeaveReview && (
//                 <form onSubmit={onSubmit} className="add-review-integrated-form">
//                     <h3 className="form-title">Leave a Testimonial</h3>
//                     {error && <p className="review-error-msg">{error}</p>}
                    
//                     <div className="rating-interactive-selector">
//                         <span className="rating-label">Experience Rating:</span>
//                         <div 
//                             className="stars-interactive-group"
//                             onMouseLeave={() => setHoverRating(0)}
//                         >
//                             {[1, 2, 3, 4, 5].map((starValue) => {
//                                 const isFilled = starValue <= (hoverRating || rating);
//                                 return (
//                                     <button
//                                         key={starValue}
//                                         type="button"
//                                         className="star-icon-btn"
//                                         onMouseEnter={() => setHoverRating(starValue)}
//                                         onClick={() => setRating(starValue)}
//                                     >
//                                         <FiStar 
//                                             className={`rating-star-icon ${isFilled ? 'filled' : 'empty'}`} 
//                                         />
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>
                    
//                     <textarea 
//                         className="review-text-input"
//                         value={reviewText} 
//                         onChange={(e) => setReviewText(e.target.value)} 
//                         placeholder="Describe the creative process, communication, and final results..." 
//                         rows={4}
//                         required 
//                     />
                    
//                     <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
//                         <FiSend /> {isSubmitting ? 'Publishing...' : 'Publish Review'}
//                     </button>
//                 </form>
//             )}

//             {/* Reviews Feed List */}
//             <div className="reviews-feed-cards-list">
//                 {!reviews || reviews.length === 0 ? (
//                     <div className="empty-reviews-notice-box">
//                         <FiMessageSquare size={32} className="empty-icon" />
//                         <p>No client reviews have been published for this workspace yet.</p>
//                     </div>
//                 ) : (
//                     reviews.map((review) => {
//                         const rawRole = review.reviewer_role || review.role || 'client';
//                         const displayRole = rawRole.toLowerCase() === 'professional' ? 'Professional' : 'Client';
                        
//                         return (
//                             <div key={review.id} className="individual-review-feed-card">
//                                 <div className="review-card-header">
//                                     <div className="reviewer-meta-group">
//                                         <div className="reviewer-avatar-placeholder">
//                                             <FiUser />
//                                         </div>
//                                         <div className="reviewer-identity">
//                                             <strong className="reviewer-name-txt">
//                                                 {review.reviewer_name || 'Anonymous User'}
//                                             </strong>
//                                             <span className="review-timestamp-role">
//                                                 {displayRole} • {formatDate(review.created_at)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="review-stars-static-badge">
//                                         {[...Array(5)].map((_, i) => (
//                                             <FiStar 
//                                                 key={i} 
//                                                 className={i < review.rating ? "star-filled" : "star-empty"} 
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
                                
//                                 <p className="review-card-body-text">{review.review_text}</p>
                                
//                                 {/* Admin / Owner Delete Action */}
//                                 {user && (user.role === 'admin' || String(user.id) === String(review.user_id)) && (
//                                     <div className="review-card-footer">
//                                         <button 
//                                             type="button" 
//                                             onClick={() => handleDeleteReview(review.id)} 
//                                             className="btn-delete-review-action"
//                                         >
//                                             <FiTrash2 />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ReviewsBoard;












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
                    // 🌟 הלולאה הכי יפה וקצרה בעולם
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