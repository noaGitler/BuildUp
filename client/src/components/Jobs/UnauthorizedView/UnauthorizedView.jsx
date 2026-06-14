import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiLogIn } from 'react-icons/fi';
import './UnauthorizedView.css';

const UnauthorizedView = () => {
    return (
        <div className="unauthorized-page-container">
            <div className="unauthorized-card-panel">
                <div className="unauthorized-icon-badge">
                    <FiLock />
                </div>
                
                <h2 className="unauthorized-card-title">
                    Unlock Marketplace Opportunities
                </h2>
                
                <p className="unauthorized-card-text">
                    Want to expand your reach, discover premium structural designs, and capture exciting new collaborations? Join our creative community today.
                </p>
                
                <div className="unauthorized-action-buttons">
                    <Link to="/login" className="unauthorized-btn-primary">
                        <FiLogIn /> Log In
                    </Link>
                    
                    <Link to="/register" className="unauthorized-btn-secondary">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedView;