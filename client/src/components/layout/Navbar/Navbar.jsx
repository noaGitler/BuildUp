import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiHome, FiFolder, FiHeart, FiUsers, FiBriefcase, FiLogOut, FiUser } from 'react-icons/fi';

import { useAuth } from '../../../context/authContext.jsx';
import Logo from '../../UI/Logo.jsx';
import Modal from '../../UI/Modal/Modal.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const handleConfirmLogout = () => {
    logoutUser();
    setIsLogoutModalOpen(false);
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        
        {/* Right Zone: Logo */}
          <div className="navbar-logo">
            <Link to="/"><Logo width={120} height={40} /></Link>
          </div>


        {/* Center Zone: Core Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FiHome size={18} /> <span>Home</span>
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FiFolder size={18} /> <span>Projects</span>
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FiBriefcase size={18} /> <span>Jobs</span>
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FiHeart size={18} /> <span>Favorites</span>
          </NavLink>
          <NavLink to="/professionals" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FiUsers size={18} /> <span>Professionals</span>
          </NavLink>
        </div>

        {/* Left Zone: User Authentication / Profile Area */}
        <div className="navbar-actions">
          {user ? (
            <div className="logged-in-wrapper">

              <Link to={`/profile/${user.id}`} className="user-profile-card" title="Go to Profile">
                {user.profile_image_url ? (
                  <img src={user.profile_image_url} alt={user.name} className="navbar-avatar" />
                ) : (
                  <FiUser size={18} className="default-avatar-icon" />
                )}
                <span className="navbar-username">{user.name}</span>
              </Link>
              
              <button 
                type="button" 
                onClick={() => setIsLogoutModalOpen(true)} 
                className="btn-logout-isolated" 
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>

            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Modal overlay block layer for termination security */}
      <Modal
        isOpen={isLogoutModalOpen}
        title="Logging Out"
        message="Are you sure you want to log out of your BuildUp account?"
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      {/* Interactive autonomous welcome celebration toast block context */}
      {/* <Modal
        isOpen={isWelcomeModalOpen}
        title={welcomeConfig.title}
        message={welcomeConfig.message}
      /> */}
    </nav>
  );
};

export default Navbar;