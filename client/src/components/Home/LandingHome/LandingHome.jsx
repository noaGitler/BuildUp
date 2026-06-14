import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiLayers, FiMessageSquare, FiUserPlus, FiLogIn} from 'react-icons/fi';

import './LandingHome.css';

const LandingHome = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">

            {/* HERO */}
            <section className="hero-section">

                <span className="hero-badge">  Professional Community Platform </span>
                <h1>  Build. Connect. Grow. </h1>
                <p> Showcase your projects, discover new opportunities, and build trusted professional relationships. </p>

                <div className="hero-buttons">
                    <button className="btn-primary" onClick={() => navigate('/register')} > <FiUserPlus /> Get Started </button>
                    <button className="btn-secondary" onClick={() => navigate('/login')} > <FiLogIn /> Log In </button>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="benefits-section">

                <div className="section-header">
                    <h2> Why Join BuildUp? </h2>
                    <p> Everything you need to showcase your work, reach new clients, and grow your business. </p>
                </div>

                <div className="benefits-grid">

                    <div className="benefit-card">
                        <div className="icon-box"> <FiBriefcase /></div>
                        <h3> Discover Opportunities </h3>
                        <p> Browse available jobs, connect with clients, and find projects that match your expertise. </p>
                    </div>

                    <div className="benefit-card">
                        <div className="icon-box"><FiLayers /> </div>
                        <h3> Showcase Your Projects </h3>
                        <p>Create a professional portfolio and present your best work to potential customers.</p>
                    </div>

                    <div className="benefit-card">
                        <div className="icon-box"> <FiMessageSquare /> </div>
                        <h3>Build Trust </h3>
                        <p> Receive reviews, share feedback, and strengthen your professional reputation.</p>
                    </div>
                </div>

            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2>Ready to Grow Your Business?</h2>
                <p>Join professionals who use BuildUp to showcase projects, connect with clients, and discover new opportunities.</p>
                <button className="btn-primary" onClick={() => navigate('/register')} > Create Free Account </button>
            </section>
        </div>
    );
};

export default LandingHome;