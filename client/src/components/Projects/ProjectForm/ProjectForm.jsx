import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiPlus, FiTrash2, FiXCircle } from 'react-icons/fi';

import { useCategories } from '../../../context/categoryContext';
import { useAuth } from '../../../context/authContext';

import CategoryCard from '../../UI/CategoryCard/CategoryCard';
import './ProjectForm.css';

const ProjectForm = ({ initialValues = null, onSubmitAction }) => {
    const navigate = useNavigate();
    const { categories = [] } = useCategories();
    const { user } = useAuth(); // Destructured user context object[cite: 1]

    const isEditMode = !!initialValues;
    const preparedMediaItems = initialValues?.mediaItems || [{ url: '', ext: 'png' }];

    // Controlled Form State Declarations
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [categoryId, setCategoryId] = useState(initialValues?.category_id || '');
    const [mediaItems, setMediaItems] = useState(preparedMediaItems);

    // Filter available categories based on the logged-in professional's associated categories[cite: 1]
    const allowedCategories = categories.filter(cat =>
        user?.categoryIds?.includes(cat.id)
    );

    // Mutation trackers tracking interaction states flags
    const [isCoverDirty, setIsCoverDirty] = useState(false);
    const [isSecondaryDirty, setIsSecondaryDirty] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Core Interaction Confirmation Modals Active States Layout Flags
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const analyzeMediaType = (ext) => {
        const cleanExt = ext.toLowerCase().trim();
        if (['png', 'jpeg', 'jpg', 'webp'].includes(cleanExt)) return 'image';
        if (['mp4', 'mov', 'webm'].includes(cleanExt)) return 'video';
        if (['mp3', 'wav'].includes(cleanExt)) return 'audio';
        return 'image';
    };

    const handleMediaFieldChange = (index, field, value) => {
        setMediaItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
        if (index === 0) setIsCoverDirty(true);
        else setIsSecondaryDirty(true);
    };

    // Toggles category selection state. Selecting a different card overrides the previous state[cite: 1]
    const handleCategorySelect = (id) => {
        setCategoryId(id);
    };

    const triggerSaveValidationCheck = (e) => {
        e.preventDefault();
        setSubmissionError(null);

        if (!title.trim() || !categoryId) {
            setSubmissionError("Core specifications configuration parameters cannot remain blank. Please pick a workspace category section.");
            return;
        }

        if (analyzeMediaType(mediaItems[0].ext) !== 'image') {
            setSubmissionError("UI Validation Exception: Index 0 file asset row must represent an image extension type.");
            return;
        }

        setShowSaveModal(true);
    };

    const handleConfirmFinalSave = async () => {
        setShowSaveModal(false);
        setFormLoading(true);

        const processedMediaArray = mediaItems
            .filter(m => m.url.trim() !== '')
            .map(m => {
                const targetType = analyzeMediaType(m.ext);
                let embeddedFolder = '/uploads/projects/images/';
                if (targetType === 'video') embeddedFolder = '/uploads/projects/videos/';
                if (targetType === 'audio') embeddedFolder = '/uploads/projects/audio/';

                return {
                    id: m.id || null,
                    media_type: targetType,
                    media_url: `${embeddedFolder}${m.url.trim()}.${m.ext.trim().toLowerCase()}`
                };
            });

        const errorFeedback = await onSubmitAction(
            { title, description, categoryId },
            processedMediaArray,
            { isCoverDirty, isSecondaryDirty }
        );

        if (errorFeedback) {
            setSubmissionError(errorFeedback);
            setFormLoading(false);
        }
    };

    return (
        <div className="project-form-view-container">
            <h1 className="form-main-heading-title">
                {isEditMode ? "Edit Specifications Details" : "Publish New Architecture Design"}
            </h1>

            <form onSubmit={triggerSaveValidationCheck} className="form-layout-blueprint-sheet">
                {submissionError && <div className="form-error-feedback-alert">{submissionError}</div>}

                <div className="form-input-fields-group">
                    <label className="form-field-wrapper-label">
                        <span>Project Core Title *</span>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </label>

                    <label className="form-field-wrapper-label">
                        <span>Architecture Specifications Overview</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                    </label>

                    {/* Replaced native select drop-down layout with the dynamic horizontal category cards grid selector layout[cite: 1, 3] */}
                    <div className="form-field-wrapper-label">
                        <span>Workspace Category Section *</span>
                        <div className="form-category-cards-selector-grid">
                            {allowedCategories.map(cat => (
                                <CategoryCard
                                    key={cat.id}
                                    categoryId={cat.id}
                                    isSelected={Number(categoryId) === Number(cat.id)}
                                    onClick={handleCategorySelect}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                <div className="form-media-assets-manager-panel">
                    <h3 className="media-panel-section-title">Compiled Project Media Stack</h3>
                    <div className="media-fields-vertical-stack">
                        {mediaItems.map((item, index) => {
                            const activeType = analyzeMediaType(item.ext);
                            return (
                                <div key={index} className={`media-input-row-card ${index === 0 ? 'primary-cover-slot' : ''}`}>
                                    <div className="row-badge-indicator">Slot {index + 1} {index === 0 && "(Primary Cover Image)"}</div>
                                    <div className="row-inputs-grid-layout">
                                        <label className="grid-input-cell">
                                            <span>File Name Only</span>
                                            <input type="text" value={item.url} onChange={(e) => handleMediaFieldChange(index, 'url', e.target.value)} placeholder="e.g., penthouse_view_1" required />
                                        </label>
                                        <label className="grid-input-cell flex-grow-three">
                                            <span>Extension</span>
                                            <input type="text" value={item.ext} onChange={(e) => handleMediaFieldChange(index, 'ext', e.target.value)} placeholder="png" required />
                                        </label>
                                        <div className="grid-input-cell analyzer-preview-badge">
                                            <span>Type</span>
                                            <div className={`type-badge-preview-tag ${activeType}`}>{activeType}</div>
                                        </div>
                                        {index > 0 && (
                                            <button type="button" className="btn-row-action-delete-trigger" onClick={() => { setMediaItems(prev => prev.filter((_, i) => i !== index)); setIsSecondaryDirty(true); }}>
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button type="button" className="btn-add-media-element-action" onClick={() => setMediaItems(prev => [...prev, { url: '', ext: 'png' }])}>
                        <FiPlus /> Append Specification File Asset
                    </button>
                </div>

                <div className="form-submission-footer-action-block">
                    <button type="button" className="btn-form-action-trigger cancel-gray-modifier" onClick={() => setShowCancelModal(true)} disabled={formLoading}>
                        <FiXCircle /> Cancel & Discard
                    </button>

                    <button type="submit" className="btn-form-action-trigger save-sage-modifier" disabled={formLoading}>
                        <FiSave /> {formLoading ? "Saving Changes..." : "Save Specifications"}
                    </button>
                </div>
            </form>

            {showSaveModal && (
                <div className="form-overlay-modal-backdrop">
                    <div className="form-dialog-confirmation-card">
                        <h3 className="modal-dialog-title">Confirm Database Update</h3>
                        <p className="modal-dialog-description">Are you absolutely sure you want to authorize and commit these project modifications data profiles to the server registry catalog scope?</p>
                        <div className="modal-dialog-actions-row">
                            <button type="button" className="btn-dialog-link modal-cancel-trigger" onClick={() => setShowSaveModal(false)}>Go Back</button>
                            <button type="button" className="btn-dialog-link modal-confirm-save-trigger" onClick={handleConfirmFinalSave}>Yes, Commit Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className="form-overlay-modal-backdrop">
                    <div className="form-dialog-confirmation-card">
                        <h3 className="modal-dialog-title-warning">Discard Unsaved Changes</h3>
                        <p className="modal-dialog-description">Warning: You are about to exit this active workspace layout sequence. Are you sure you want to discard all unsaved edits?</p>
                        <div className="modal-dialog-actions-row">
                            <button type="button" className="btn-dialog-link modal-cancel-trigger" onClick={() => setShowCancelModal(false)}>Keep Editing</button>
                            <button type="button" className="btn-dialog-link modal-confirm-discard-trigger" onClick={() => navigate(-1)}>Yes, Discard Work</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectForm;