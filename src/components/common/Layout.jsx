import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      {/* Header - Full Width at Top */}
      <Header 
        title="የአዲስ አበባ ገቢዎብ አስተዳደር ስርዓት" 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* ✅ NEW: Wrapper for sidebar + content below header */}
      <div className="main-wrapper">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={`main-content ${sidebarCollapsed ? 'shifted' : ''}`}>
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;