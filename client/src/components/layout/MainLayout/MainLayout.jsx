import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar/Navbar.jsx';
import Modal from '../../UI/Modal/Modal.jsx';
import './MainLayout.css';

const MainLayout = () => {

  // New states for managing temporary welcome overlays
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [welcomeConfig, setWelcomeConfig] = useState({ title: '', message: '' });

  // Monitor session storage flags to trigger autonomous popups on initialization
  useEffect(() => {
    const welcomeConfig = JSON.parse(sessionStorage.getItem('welcomeConfig'));

    if (welcomeConfig && welcomeConfig.shouldShow) {
      setWelcomeConfig(welcomeConfig);
      setIsWelcomeModalOpen(true);
      sessionStorage.removeItem('welcomeConfig');

      setTimeout(() => setIsWelcomeModalOpen(false), 3500);
    }
  }, []);


  return (
    <div className="app-layout">
      {/* Navbar containing the hamburger control trigger */}
      <Navbar />

      <Modal
        isOpen={isWelcomeModalOpen}
        title={welcomeConfig.title}
        message={welcomeConfig.message}
      />

      {/* Dynamic Content Window */}
      <main className="main-content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;