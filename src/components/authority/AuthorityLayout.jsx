// src/components/authority/AuthorityLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Header from '../common/Header';
import addisLogo from '../../assets/images/addis-logo.png';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../common/Footer';

const AuthorityLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="authority-container">
      {/* Sidebar - Bottom margin 0 */}
      <div className={`authority-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="authority-brand">
          <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
          {!sidebarCollapsed && <h3>{t('authority')}</h3>}
        </div>
        <nav className="authority-nav">
          <NavLink to="dashboard" className={({ isActive }) => `authority-nav-item ${isActive ? 'active' : ''}`}>
            <FaHome /> {!sidebarCollapsed && t('dashboard')}
          </NavLink>
        </nav>
      </div>

      {/* Content Area */}
      <div className="authority-content-wrapper">
        <div className="authority-content">
          <Header title={t('authority')} toggleSidebar={toggleSidebar} />
          <div className="authority-page-content">
            <Outlet />
          </div>
        </div>
        {/* ✅ Footer - Full width, outside content */}
        <Footer />
      </div>
    </div>
  );
};

export default AuthorityLayout;