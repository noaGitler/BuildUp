import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageSquare, FiPackage, FiUser } from 'react-icons/fi';

import { useAuth } from '../../../context/authContext.jsx';
import { useProfiles } from '../../../context/ProfilesContext.jsx';

import ProfileDetails from '../ProfileDetails/ProfileDetails.jsx';
import ReviewsBoard from '../ReviewsBoard/ReviewsBoard.jsx';
import ProjectBoard from '../ProjectBoard/ProjectBoard.jsx';
import './ProfilePage.css';

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getProfileData, getReviewsData, submitReviewData, editReviewData, deleteReviewData } = useProfiles();

    const [activeProfile, setActiveProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('reviews');

    const isOwnProfile = user && String(user.id) === String(id);

    const fetchProfileContext = useCallback(async () => {
        try {
            setLoading(true);
            const profileRes = await getProfileData(id);
            if (profileRes.success) {
                setActiveProfile(profileRes.data);
                // Load reviews only if it's a professional profile
                if (profileRes.data.role === 'professional' || profileRes.data.role === 'admin') {
                    const reviewsRes = await getReviewsData(id);
                    setReviews(reviewsRes.success ? reviewsRes.data : []);
                }
            } else {
                setError(profileRes.message || "Failed to load profile data.");
            }
        } catch (err) {
            setError("Exception caught while parsing profile data.");
        } finally {
            setLoading(false);
        }
    }, [id, getProfileData, getReviewsData]);

    useEffect(() => {
        if (id) {
            fetchProfileContext();
        }
    }, [id, fetchProfileContext]);

    if (loading) return <div className="profile-loader-msg">Synchronizing profile layout context...</div>;
    if (error) return <div className="profile-error-msg">{error}</div>;
    if (!activeProfile) return <div className="profile-error-msg">Profile records remain uninitialized.</div>;

    const isProfessional = activeProfile.role === 'professional' || activeProfile.role === 'admin';

    const handleReviewSubmitWrapper = async (reviewData) => {
        const result = await submitReviewData(id, reviewData);
        if (result.success) await fetchProfileContext();
        return result;
    };

    const handleReviewEditWrapper = async (reviewId, payload) => {
        const result = await editReviewData(reviewId, payload);
        if (result.success) await fetchProfileContext();
        return result;
    };

    const handleReviewDeleteWrapper = async (reviewId) => {
        const result = await deleteReviewData(reviewId);
        if (result.success) await fetchProfileContext();
        return result;
    };

    return (
        <div className="profile-page-master-container">
            <div className="sidebar-column-layout">
                <button onClick={() => navigate(-1)} className="back-feed-pill">
                    <FiArrowLeft /> Go Back
                </button>
                <ProfileDetails profile={activeProfile} isOwnProfile={isOwnProfile} />
            </div>

            <main className="profile-content-area">
                {isProfessional && (
                    <div className="content-toggle-nav">
                        <button
                            className={activeTab === 'reviews' ? 'active' : ''}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <FiMessageSquare /> Manifesto & Reviews
                        </button>
                        <button
                            className={activeTab === 'projects' ? 'active' : ''}
                            onClick={() => setActiveTab('projects')}
                        >
                            <FiPackage /> Portfolio Catalog
                        </button>
                    </div>
                )}

                { isProfessional ? activeTab === 'projects' ? (
                    <ProjectBoard professional={activeProfile} user={user} />
                ) : (
                    <div className="reviews-tab-layout-container">
                        <ReviewsBoard
                            reviews={reviews}
                            user={user}
                            handleReviewSubmit={handleReviewSubmitWrapper}
                            handleDeleteReview={handleReviewDeleteWrapper}
                            handleEditReview={handleReviewEditWrapper}
                        />
                    </div>
                ) : null}
            </main>
        </div>
    );
};

export default ProfilePage;