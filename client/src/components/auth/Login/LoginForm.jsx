import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

import { useAuth } from '../../../context/authContext.jsx';
import Modal from '../../UI/Modal/Modal.jsx';
import Logo from '../../UI/Logo.jsx'

import './LoginForm.css';

const LoginForm = () => {
    const { loginUser, error: globalError, clearErrors } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        try {
            const result = await loginUser(email, password);
            if (result.success) {
                sessionStorage.setItem('welcomeConfig',
                    JSON.stringify({
                        shouldShow: true,
                        title: "Look who's back!",
                        message: "Great to have you with us again. Let's build something beautiful today."
                    }));
                navigate('/');
            } else {
                setLocalError(result.message || 'Invalid email or password.');
            }
        } catch (err) {
            setLocalError('Server connection error. Please try again.');
        }
    };

    const activeError = localError || globalError;

    return (
        <div className="login-fields-wrapper">

            <div className="login-card-standard">
                <h2 className="login-fields-title">Welcome to <Logo width="120" height="50"></Logo></h2>
                <p className="login-fields-subtitle">Log in to discover inspiration and home design professionals</p>

                <form onSubmit={handleSubmit} className="login-form-left">

                    {/* Email Input Field */}
                    <div className="login-input-group-left">
                        <label className="login-input-label">Email Address</label>
                        <div className="login-input-wrapper">
                            <FiMail className="login-input-icon-left" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-auth-input-left"
                                required
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Input Field */}
                    <div className="login-input-group-left">
                        <label className="login-input-label">Password</label>
                        <div className="login-input-wrapper">
                            <FiLock className="login-input-icon-left" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-auth-input-left"
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {activeError && <div className="login-error-left">{activeError}</div>}

                    <button type="submit" className="login-button-full">Log In</button>
                </form>

                {/* <p className="login-fields-footer">
                    Don't have an account? <Link to="/register" className="login-fields-link">Sign up for free</Link>
                </p> */}

                <p className="login-fields-footer">
                    Don't have an account? <Link to="/register" onClick={() => clearErrors()} className="login-fields-link">Sign up for free</Link>
                </p>

                <p className="login-fields-footer" style={{ marginTop: '12px' }}>
                    <Link to="/" className="login-fields-link-out">
                        Continue without connecting
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default LoginForm;