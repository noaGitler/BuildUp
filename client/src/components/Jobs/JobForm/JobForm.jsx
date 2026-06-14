
// src/components/Jobs/JobForm/JobForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiXCircle } from 'react-icons/fi';

import { useCategories } from '../../../context/categoryContext';
import { useAuth } from '../../../context/authContext';

import CategoryCard from '../../UI/CategoryCard/CategoryCard';
import Modal from '../../UI/Modal/Modal';
import './JobForm.css';

const JobForm = ({ initialValues = null, onSubmitAction }) => {
    const navigate = useNavigate();

    const categoryContextData = useCategories() || {};
    const categories = categoryContextData.categories || [];
    const { user } = useAuth();

    // בדיקה בטוחה אם למשתמש יש קטגוריות משויכות באובייקט
    const hasAssignedCategories = user?.categoryIds && user.categoryIds.length > 0;

    // סינון קטגוריות בהתאם לסוג המשתמש (איש מקצוע או לקוח)
    const allowedCategories = hasAssignedCategories
        ? categories.filter(cat => user.categoryIds.includes(cat.id))
        : categories;

    const isCategoriesLoading = categories.length === 0;
    const isEditMode = !!initialValues;

    // Controlled Form State Declarations
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [budget, setBudget] = useState(initialValues?.budget || '');
    const [categoryId, setCategoryId] = useState(initialValues?.category_id || '');

    // Mutation trackers tracking interaction states flags
    const [submissionError, setSubmissionError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Core Interaction Confirmation Modals Active States Layout Flags
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCategorySelect = (id) => {
        setCategoryId(id);
    };

    const triggerSaveValidationCheck = (e) => {
        e.preventDefault();
        setSubmissionError(null);

        if (!title.trim() || !description.trim() || !categoryId) {
            setSubmissionError("Core specifications configuration parameters cannot remain blank. Please pick a job category section.");
            return;
        }
        setShowSaveModal(true);
    };

    const handleConfirmFinalSave = async () => {
        setShowSaveModal(false);
        setFormLoading(true);

        const payload = {
            title: title || '',
            description: description || '',
            budget: (budget !== '' && budget !== undefined) ? Number(budget) : null,
            category_id: Number(categoryId),
            client_id: user?.id,
        };

        const errorFeedback = await onSubmitAction(payload);
        if (errorFeedback) {
            setSubmissionError(errorFeedback);
            setFormLoading(false);
        }
    };


    return (
        <div className="job-form-view-container">
            <h2 className="form-main-heading-title">
                {isEditMode ? "Edit Job Specifications" : "Publish New Job Opportunity"}
            </h2>

            <form onSubmit={triggerSaveValidationCheck} className="form-layout-blueprint-sheet">
                {submissionError && <div className="form-error-feedback-alert">{submissionError}</div>}

                <div className="form-input-fields-group">
                    <label className="form-field-wrapper-label">
                        <span>Position Title *</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Luxury Penthouse Space Optimization"
                            required
                        />
                    </label>

                    <label className="form-field-wrapper-label">
                        <span>Job Description Overview *</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            placeholder="Describe the structural requirements, timeline, and goals..."
                            required
                        />
                    </label>

                    <label className="form-field-wrapper-label">
                        <span>Estimated Budget (₪)</span>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Leave empty for open budget"
                            min="0"
                        />
                    </label>

                    <div className="form-field-wrapper-label">
                        <span>Workspace Category Section *</span>
                        <div className="form-category-cards-selector-grid">
                            {isCategoriesLoading ? (
                                <p style={{ color: '#60665D', fontSize: '13px', fontStyle: 'italic', margin: '10px 0' }}>
                                    Loading categorized workspace assets...
                                </p>
                            ) : allowedCategories.length === 0 ? (
                                <p style={{ color: '#D93838', fontSize: '13px', fontWeight: '500', margin: '10px 0' }}>
                                    No workspace categories assigned to your profile.
                                </p>
                            ) : (
                                allowedCategories.map(cat => (
                                    <CategoryCard
                                        key={cat.id}
                                        categoryId={cat.id}
                                        isSelected={Number(categoryId) === Number(cat.id)}
                                        onClick={handleCategorySelect}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-submission-footer-action-block">
                    <button
                        type="button"
                        className="btn-form-action-trigger cancel-gray-modifier"
                        onClick={() => setShowCancelModal(true)}
                        disabled={formLoading}
                    >
                        <FiXCircle /> Cancel & Discard
                    </button>

                    <button
                        type="submit"
                        className="btn-form-action-trigger save-sage-modifier"
                        disabled={formLoading}
                    >
                        <FiSave /> {formLoading ? "Saving Changes..." : isEditMode ? "Save Changes" : "Publish Job"}
                    </button>
                </div>
            </form>

            {/* מודאל אישור שמירה ופרסום המשרה */}
            {showSaveModal && (
                <Modal
                    isOpen={showSaveModal}
                    title="Confirm Database Registry"
                    message="Are you absolutely sure you want to authorize and publish this job opportunity to the live marketplace feed?"
                    confirmText="Yes, Publish"
                    cancelText="Go Back"
                    onConfirm={handleConfirmFinalSave}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}

            {/* מודאל אישור ביטול ויציאה מהטופס */}
            {showCancelModal && (
                <Modal
                    isOpen={showCancelModal}
                    title="Discard Unsaved Changes"
                    message="Warning: You are about to exit this active creation layout. Are you sure you want to discard all inputs?"
                    confirmText="Yes, Discard"
                    cancelText="Keep Editing"
                    onConfirm={() => navigate('/jobs')}
                    onCancel={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
};

export default JobForm;