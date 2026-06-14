import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiXCircle } from 'react-icons/fi';

import { useCategories } from '../../../context/categoryContext';
import { useAuth } from '../../../context/authContext';
import { useJobs } from '../../../context/JobContext';

import CategoryCard from '../../UI/CategoryCard/CategoryCard';
import Modal from '../../UI/Modal/Modal';
import './JobForm.css';

const JobForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const { fetchJobById, handleCreateJob, handleUpdateJob, fetchJobs } = useJobs();

    const categoryContextData = useCategories() || {};
    const categories = categoryContextData.categories || [];

    const isCategoriesLoading = categories.length === 0;
    const isEditMode = !!id;

    // Controlled Form State Declarations
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Mutation trackers tracking interaction states flags
    const [submissionError, setSubmissionError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [dataFetching, setDataFetching] = useState(false);

    // Core Interaction Confirmation Modals Active States Layout Flags
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {

        if (!isEditMode) return;

        const loadJobData = async () => {
            try {
                setDataFetching(true);

                const jobData = await fetchJobById(id);

                if (jobData) {
                    const isOwner = Number(jobData.client_id) === Number(user?.id);
                    const isAdmin = user?.role === 'admin';

                    if (!isOwner && !isAdmin) {
                        navigate(-1, { replace: true });
                        return;
                    }

                    setTitle(jobData.title || '');
                    setDescription(jobData.description || '');
                    setBudget(jobData.budget || '');
                    setCategoryId(jobData.category_id || jobData.categoryId || '');
                } else {
                    navigate('/jobs');
                }
            } catch (err) {
                setSubmissionError("Failed to fetch job blueprint parameters.");
            } finally {
                setDataFetching(false);
            }
        };

        loadJobData();
    }, [id, isEditMode, fetchJobById, navigate, user]);

    if (dataFetching) {
        return <div className="details-status-msg">Loading current job specifications...</div>;
    }

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

        try {
            let response;
            if (isEditMode) { response = await handleUpdateJob(id, user.id, payload); }
            else { response = await handleCreateJob(payload); }

            if (response && (response.success || !response.error)) {
                await fetchJobs();
                navigate(-1);
            } else {
                setSubmissionError(response?.message || "Failed to commit changes to the server catalog.");
                setFormLoading(false);
            }
        } catch (error) {
            console.error("Failed to commit job form operation:", error);
            setSubmissionError(error.response?.data?.message || "An error occurred while transmitting data layers. Please try again.");
            setFormLoading(false);
        }
    };

    return (
        <div className={isEditMode ? 'job-form-view-container-edit' : 'job-form-view-container-create'}>
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
                                <p className="form-category-cards-selector-grid-p1">
                                    Loading categorized workspace assets...
                                </p>
                            ) : categories.length === 0 ? (
                                <p className="form-category-cards-selector-grid-p2">
                                    No workspace categories assigned to your profile.
                                </p>
                            ) : (
                                categories.map(cat => (
                                    <CategoryCard
                                        key={cat.id}
                                        categoryId={cat.id}
                                        isSelected={Number(categoryId) === Number(cat.id)}
                                        onClick={handleCategorySelect}
                                        variant="pill"
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

            {/* Job save and post confirmation modal */}
            <Modal
                isOpen={showSaveModal}
                title="Are you sure you want to save the changes?"
                confirmText="Yes, Publish"
                cancelText="Go Back"
                onConfirm={handleConfirmFinalSave}
                onCancel={() => setShowSaveModal(false)}
            />

            {/* Cancellation confirmation modal and exit form */}
            <Modal
                isOpen={showCancelModal}
                title="Are you sure you want to cancel the changes?"
                confirmText="Yes, Discard"
                cancelText="Keep Editing"
                onConfirm={() => navigate('/jobs')}
                onCancel={() => setShowCancelModal(false)}
                danger={true}
            />
        </div>
    );
};

export default JobForm;