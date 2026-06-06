import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiImage, FiMapPin, FiAlignLeft, FiType } from 'react-icons/fi';

import { useAuth } from '../../../../context/authContext.jsx';
import CategoryList from '../../../UI/CategoryList/CategoryList.jsx';

import './ProfileFields.css';

const ProfileFields = () => {
    const { tempRegistration, registerStep2, error: globalError } = useAuth();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    // Form inputs baseline configuration for Onboarding step 2
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        profileImage: '',
        tagLine: '',
        bio: '',
        city: ''
    });

    useEffect(() => {
        if (!tempRegistration) {
            navigate('/register');
        }
    }, [tempRegistration, navigate]);

    // Mutual exclusion toggle engine logic
    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryIds(prevIds => {
            if (prevIds.includes(categoryId)) {
                return prevIds.filter(id => id !== categoryId);
            } else {
                return [...prevIds, categoryId];
            }
        });
    };

    const handleSelectNone = () => {
        setSelectedCategoryIds([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.name.trim()) {
            setLocalError('Full name or business name is required.');
            return;
        }

        // Determine roles dynamically based on category selection array length
        const isProfessional = selectedCategoryIds.length > 0;

        const completePayload = {
            email: tempRegistration?.email,
            password: tempRegistration?.password,
            name: formData.name,
            role: isProfessional ? 'professional' : 'client',
            phone: formData.phone || null,
            profile_image_url: formData.profileImage || null,
            tag_line: isProfessional ? formData.tagLine : null,
            bio: isProfessional ? formData.bio : null,
            city: isProfessional ? formData.city : null,
            categoryIds: isProfessional ? selectedCategoryIds : []
        };

        const result = await registerStep2(completePayload);
        if (result.success) {
            sessionStorage.setItem('welcomeConfig',
                JSON.stringify({
                    shouldShow: true,
                    title: "You're officially in!",
                    message: "Welcome to BuildUp. Your space is ready, your profile is live, let's start creating."
                }));
            navigate('/');
        } else {
            setLocalError(result.message || 'Profile configuration failed.');
        }
    };

    const activeError = localError || globalError;
    const isNoneSelected = selectedCategoryIds.length === 0;

    return (
        <div className="profile-fields-wrapper">

            <div className="profile-card-wide">
                <h2 className="profile-fields-title">Complete Your Profile</h2>
                <p className="profile-fields-subtitle">Step 2 of 2: Setup your public identity</p>

                {activeError && <div className="auth-error-left">{activeError}</div>}

                <form onSubmit={handleSubmit} className="auth-form-left">

                    {/* Full Name Input */}
                    <div className="input-group-left">
                        <label className="input-label">Full Name / Business Name</label>
                        <div className="input-wrapper">
                            <FiUser className="input-icon-left" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="auth-input-left"
                                required
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="input-group-left">
                        <label className="input-label">Phone Number</label>
                        <div className="input-wrapper">
                            <FiPhone className="input-icon-left" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="auth-input-left"
                                placeholder="0500000000"
                            />
                        </div>
                    </div>

                    {/* Profile Image URL Input */}
                    <div className="input-group-left">
                        <label className="input-label">Profile Image URL</label>
                        <div className="input-wrapper">
                            <FiImage className="input-icon-left" />
                            <input
                                type="url"
                                name="profileImage"
                                value={formData.profileImage}
                                onChange={handleChange}
                                className="auth-input-left"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    {/* Specialty Categories Selection Section */}
                    <div className="input-group-left categories-onboarding-section">
                        <p className="categories-onboarding-subtitle">Choose fields that match your focus, or select None if you are a regular user</p>

                        <div className="categories-onboarding-wrapper" >

                            {/* Handcrafted standalone None option card */}
                            <div
                                className={`category-card-wrapper ${isNoneSelected ? 'category-selected-active' : ''}`}
                                onClick={handleSelectNone}
                                style={{ marginTop: '16px' }}
                            >
                                <div
                                    className="category-circle-avatar"
                                    style={{
                                        color: isNoneSelected ? '#FFFFFF' : '#60665D',
                                        borderColor: isNoneSelected ? '#557A61' : 'transparent',
                                        backgroundColor: isNoneSelected ? '#557A61' : '#F7F7F4'
                                    }}
                                >
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                    </svg>
                                </div>
                                <span
                                    className="category-display-label"
                                    style={{
                                        color: isNoneSelected ? '#557A61' : '#60665D',
                                        fontWeight: isNoneSelected ? '700' : '500'
                                    }}
                                >
                                    None
                                </span>
                            </div>

                            {/* Standard dynamic loop category list component */}
                            <CategoryList
                                selectedIds={selectedCategoryIds}
                                onCategorySelect={handleCategoryChange}
                            />
                        </div>
                    </div>

                    {/* CONDITIONAL RENDERING: Displayed only if at least one professional category is selected */}
                    {!isNoneSelected && (
                        <div className="professional-extra-fields-fade" style={{ animation: 'fadeInComponent 0.3s ease-in-out', width: '100%' }}>

                            {/* Business Tagline Input */}
                            <div className="input-group-left">
                                <label className="input-label">Business Tagline</label>
                                <div className="input-wrapper">
                                    <FiType className="input-icon-left" />
                                    <input
                                        type="text"
                                        name="tagLine"
                                        value={formData.tagLine}
                                        onChange={handleChange}
                                        className="auth-input-left"
                                        placeholder="Expert interior designer specializing in modern rustic concepts"
                                    />
                                </div>
                            </div>

                            {/* City Location Input */}
                            <div className="input-group-left">
                                <label className="input-label">City / Location</label>
                                <div className="input-wrapper">
                                    <FiMapPin className="input-icon-left" />
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="auth-input-left"
                                        placeholder="Tel Aviv, Israel"
                                    />
                                </div>
                            </div>

                            {/* Business Biography Input */}
                            <div className="input-group-left">
                                <label className="input-label">Biography / About Me</label>
                                <div className="input-wrapper">
                                    <FiAlignLeft className="input-icon-left" style={{ alignSelf: 'flex-start', marginTop: '12px' }} />
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="auth-input-left"
                                        style={{ paddingTop: '12px', resize: 'vertical', fontFamily: 'inherit' }}
                                        placeholder="Tell potential clients about your design philosophy, past experience, and style..."
                                        rows="4"
                                    />
                                </div>
                            </div>

                        </div>
                    )}

                    <button type="submit" className="auth-button-full">Complete Registration</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileFields;