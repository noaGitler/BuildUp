import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiHome, FiFolder, FiHeart, FiUsers, FiBriefcase, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext.jsx';
import Logo from '../../UI/logo.jsx';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="main-navbar">
      <div className="navbar-container">

        {/* Right Zone: Hamburger Menu + Logo */}
        <div className="navbar-right-zone">
          <button className="hamburger-btn" onClick={onToggleSidebar}>
            <FiMenu size={24} />
          </button>
          <div className="navbar-logo">
            <Link to="/"><Logo width={120} height={40} /></Link>
          </div>
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
          <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FiUsers size={18} /> <span>Users</span>
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

              <button onClick={logoutUser} className="btn-logout-isolated" title="Logout">
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
    </nav>
  );
};

export default Navbar;