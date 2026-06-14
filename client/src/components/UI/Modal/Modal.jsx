import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", danger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-card">
                <h3 className="custom-modal-title">{title}</h3>
                {message && (<p className="custom-modal-message">{message}</p>)}

                {(onConfirm || onCancel) && (
                    <div className="custom-modal-actions">

                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className={`custom-modal-btn  ${danger ? 'modal-btn-danger' : 'modal-btn-confirm'}`}
                            >
                                {confirmText}
                            </button>
                        )}

                        {onCancel && (
                            <button onClick={onCancel} className="custom-modal-btn modal-btn-cancel">
                                {cancelText}
                            </button>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;