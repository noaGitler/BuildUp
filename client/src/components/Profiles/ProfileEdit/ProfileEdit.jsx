import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheck, FiX, FiUser, FiPhone, FiMapPin, FiInfo, FiBriefcase, FiStar, FiImage } from 'react-icons/fi';

import { useProfiles } from '../../../context/ProfilesContext.jsx';
import CategoryList from '../../UI/CategoryList/CategoryList.jsx';
import Modal from '../../UI/Modal/Modal.jsx';
import './ProfileEdit.css';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { getProfileData, updateProfileData } = useProfiles();

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [currentRole, setCurrentRole] = useState('client');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        tagline: '',
        bio: '',
        profile_image_name: '',
        profile_image_ext: 'jpg'
    });

    // Retrieving user data
    useEffect(() => {
        const loadActiveProfileData = async () => {
            try {
                setLoading(true);
                const res = await getProfileData(id);

                if (res.success && res.data) {
                    const profileData = res.data;

                    const imagePath = profileData.profile_image_url || profileData.profile_image || '';

                    let extractedName = '';
                    let extractedExt = 'jpg';

                    if (imagePath) {
                        const imageNameFull = imagePath.split(/[\/\\]/).pop();
                        const lastDotIndex = imageNameFull.lastIndexOf('.');

                        if (lastDotIndex !== -1) {
                            extractedName = imageNameFull.substring(0, lastDotIndex);
                            extractedExt = imageNameFull.substring(lastDotIndex + 1);
                        } else {
                            extractedName = imageNameFull;
                        }
                    }

                    setFormData({
                        name: profileData.name || '',
                        phone: profileData.phone || '',
                        city: profileData.city || '',
                        tagline: profileData.tagline || '',
                        bio: profileData.bio || '',
                        profile_image_name: extractedName,
                        profile_image_ext: extractedExt
                    });

                    setCurrentRole(profileData.role || 'client');

                    if (profileData.category_ids && Array.isArray(profileData.category_ids)) {
                        setSelectedCategories(profileData.category_ids);
                    }
                } else {
                    setError('Failed to fetch profile data.');
                }
            } catch (err) {
                setError('A network error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadActiveProfileData();
    }, [id, getProfileData]);

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleUpgradeToProfessional = () => {
        setCurrentRole('professional');
    };

    // Opening the model to request save approval
    const triggerSaveValidationCheck = (e) => {
        e.preventDefault();
        setError('');
        setShowSaveModal(true);
    };

    // The save function
    const handleConfirmFinalSave = async () => {
        setShowSaveModal(false);
        setSaving(true);
        setError('');

        let finalRole = currentRole;

        if (finalRole === 'professional') {
            const hasProData = formData.bio.trim() !== '' ||
                formData.tagline.trim() !== '' ||
                selectedCategories.length > 0;

            if (!hasProData) {
                finalRole = 'client';
            }
        }

        const cleanExt = formData.profile_image_ext.replace('.', '').trim() || 'jpg';
        const finalImageString = formData.profile_image_name.trim()
            ? `${formData.profile_image_name.trim()}.${cleanExt}`
            : '';

        const payload = {
            name: formData.name,
            phone: formData.phone,
            role: finalRole,
            profile_image_url: finalImageString
        };

        if (finalRole === 'professional' || finalRole === 'admin') {
            payload.bio = formData.bio;
            payload.tagline = formData.tagline;
            payload.city = formData.city;
            payload.category_ids = selectedCategories;
        }

        const res = await updateProfileData(id, payload);

        if (res.success) {
            navigate(`/profile/${id}`, { 'replace': true });
        } else {
            setError(res.message || 'Failed to update profile.');
            setSaving(false);
        }
    };

    if (loading) return <div className="edit-loading-fallback">Loading profile data...</div>;

    const isProfessional = currentRole === 'professional' || currentRole === 'admin';

    return (
        <div className="profile-edit-grand-wrapper-view">
            <div className="edit-section-header">
                <h2>Account Modifications</h2>
                <p>Update your personal information and platform settings.</p>
            </div>

            {error && <div className="edit-error-alert">{error}</div>}

            <form onSubmit={triggerSaveValidationCheck} className="profiles-integrated-form-blueprint">

                {/* --- BASIC INFO --- */}
                <div className="form-group-section-title">General Information</div>

                <div className="form-input-group-row">
                    <label><FiUser className="label-icon" /> Full Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                    />
                </div>

                <div className="form-input-group-row">
                    <label><FiPhone className="label-icon" /> Phone Number *</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="05X-XXXXXXX"
                    />
                </div>

                <div className="form-input-group-row">
                    <label><FiImage className="label-icon" /> Profile Image Asset</label>
                    <div className="split-image-input-container">
                        <div className="split-input-main-name">
                            <span className="split-input-helper-text">File Name Only</span>
                            <input
                                type="text"
                                value={formData.profile_image_name}
                                onChange={(e) => setFormData({ ...formData, profile_image_name: e.target.value })}
                                placeholder="e.g., my_profile_pic"
                            />
                        </div>

                        <div className="split-input-extension">
                            <span className="split-input-helper-text">Extension</span>
                            <input
                                type="text"
                                value={formData.profile_image_ext}
                                onChange={(e) => setFormData({ ...formData, profile_image_ext: e.target.value })}
                                placeholder="jpg"
                            />
                        </div>
                    </div>
                </div>

                {/* --- UPGRADE CTA FOR CLIENTS --- */}
                {currentRole === 'client' && (
                    <div className="upgrade-to-pro-banner">
                        <div className="upgrade-content">
                            <h4><FiStar /> Are you an industry professional?</h4>
                            <p>Upgrade your account to showcase your portfolio, receive reviews, and get hired by clients.</p>
                        </div>
                        <button type="button" className="btn-upgrade-account" onClick={handleUpgradeToProfessional}>
                            Become a Professional
                        </button>
                    </div>
                )}

                {/* --- PROFESSIONAL FIELDS --- */}
                {isProfessional && (
                    <div className="professional-fields-container animate-fade-in">
                        <div className="form-group-section-title">Professional Identity</div>

                        <div className="input-row-flex">
                            <div className="form-input-group-row">
                                <label><FiBriefcase className="label-icon" /> Studio Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    placeholder="E.g. Modern Architecture"
                                    maxLength={100}
                                />
                            </div>
                            <div className="form-input-group-row">
                                <label><FiMapPin className="label-icon" /> City / Region</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Tel Aviv"
                                />
                            </div>
                        </div>

                        <div className="form-input-group-row">
                            <label><FiInfo className="label-icon" /> Biography & Background</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                placeholder="Tell clients about your experience and vision..."
                            />
                        </div>

                        {currentRole !== 'admin' && (
                            <div className="form-input-group-row categories-selection-area">
                                <label>Expertise Categories (Select all that apply)</label>
                                <div className="edit-categories-wrapper">
                                    <CategoryList
                                        selectedIds={selectedCategories}
                                        onCategorySelect={handleCategoryToggle}
                                        variant="pill"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* --- SUBMIT ACTIONS --- */}
                <div className="edit-form-actions-footer-bar">
                    <button type="button" onClick={() => setShowCancelModal(true)} className="btn-cancel-edit-form" disabled={saving}>
                        <FiX /> Cancel
                    </button>
                    <button type="submit" className="btn-save-profile-form" disabled={saving}>
                        <FiCheck /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Modal for confirmation of save */}
            <Modal
                isOpen={showSaveModal}
                title="Are you sure you want to save the changes?"
                confirmText="Yes, Commit Changes"
                cancelText="Go Back"
                onConfirm={handleConfirmFinalSave}
                onCancel={() => setShowSaveModal(false)}
            />

            {/* Modal for confirming discard/cancel */}
            <Modal
                isOpen={showCancelModal}
                title="Are you sure you want to cancel the changes?"
                confirmText="Yes, Discard Work"
                cancelText="Keep Editing"
                onConfirm={() => navigate(-1)}
                onCancel={() => setShowCancelModal(false)}
                danger={true}
            />

        </div>
    );
};

export default ProfileEdit;