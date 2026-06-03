import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Navbar containing the hamburger control trigger */}
      <Navbar onToggleSidebar={handleToggleSidebar} />

      {/* Sidebar displaying categories in a column stack */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Dynamic Content Window */}
      <main className="main-content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;