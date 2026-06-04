import React, { useState, useEffect } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../../../../context/authContext.jsx';
import Modal from '../../../ui/Modal/Modal';
import Logo from '../../../UI/Logo.jsx'

import './RegisterForm.css';

const RegisterForm = ({ onStepComplete }) => {

    const { registerStep1,
        error: globalError,
        checkDraftEmail,
        confirmRestore,
        cancelRestore,
        tempRegistration
    } = useAuth();

    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [savedEmail, setSavedEmail] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        verifyPassword: ''
    });

    useEffect(() => {
        // Check local storage directly on mount
        const draftEmail = checkDraftEmail();
        if (draftEmail && !tempRegistration) {
            setSavedEmail(draftEmail);
            setIsRestoreModalOpen(true);
        }
    }, []);

    const handleConfirmRestore = () => {
        confirmRestore(savedEmail);
        setIsRestoreModalOpen(false);
        onStepComplete();
    };

    const handleCancelRestore = () => {
        cancelRestore();
        setIsRestoreModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.email || !formData.password || !formData.verifyPassword) {
            setLocalError('Please fill in all credentials fields.');
            return;
        }

        if (formData.password !== formData.verifyPassword) {
            setLocalError('Passwords do not match.');
            return;
        }
        const result = await registerStep1(formData.email, formData.password);

        if (result.success) {
            onStepComplete();

        } else {
            setLocalError(result.message || 'Email verification process failed.');
        }
    };

    const activeError = localError || globalError;

    return (
        <div className="register-fields-wrapper">

            <Modal
                isOpen={isRestoreModalOpen}
                title="Resume Registration"
                message={`We found an incomplete registration session. Would you like to continue?`}
                confirmText="Continue"
                cancelText="Start Over"
                onConfirm={() => handleConfirmRestore()}
                onCancel={() => handleCancelRestore()}
            />

            <div className="register-card-wide">
                <h2 className="register-fields-title">Create New Account at <Logo onClick={() => navigate('/')} width="120" height="50"></Logo></h2>
                <p className="register-fields-subtitle">Step 1 of 2: Account credentials</p>

                {activeError && <div className="register-error-left">{activeError}</div>}

                <form onSubmit={handleNextStep} className="register-form-left">
                    <div className="register-input-group-left">
                        <label className="register-input-label">Email Address</label>
                        <div className="register-input-wrapper">
                            <FiMail className="register-input-icon-left" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="register-auth-input-left"
                                required
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="register-input-group-left">
                        <label className="register-input-label">Password</label>
                        <div className="register-input-wrapper">
                            <FiLock className="register-input-icon-left" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="register-auth-input-left"
                                required
                                placeholder="Minimum 6 characters"
                            />
                        </div>
                    </div>

                    <div className="register-input-group-left">
                        <label className="register-input-label">Verify Password</label>
                        <div className="register-input-wrapper">
                            <FiLock className="register-input-icon-left" />
                            <input
                                type="password"
                                name="verifyPassword"
                                value={formData.verifyPassword}
                                onChange={handleChange}
                                className="register-auth-input-left"
                                required
                                placeholder="Confirm password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-button-full">Next Step</button>
                </form>

                {/* הוספת שורת הפוטר הקהילתית עם הקישור החסר */}
                {/* <p className="register-fields-footer">
                    Already have an account? <Link to="/login" className="register-fields-link">Log in here</Link>
                </p> */}
                <p className="register-fields-footer">
                    Already have an account? <Link to="/login" className="register-fields-link">Log in here</Link>
                </p>

                <p className="register-fields-footer" style={{ marginTop: '12px' }}>
                    <Link to="/" className="register-fields-link" style={{ color: '#60665D', fontWeight: '500', fontSize: '13px', textDecoration: 'underline' }}>
                        Continue without connecting
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default RegisterForm;