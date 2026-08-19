import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome, FaBell, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import Header from '../common/Header';
import addisLogo from '../../assets/images/addis-logo.png';
import { useLanguage } from '../../context/LanguageContext';

const OfficerLayout = () => {
  const [notifiesExpanded, setNotifiesExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const currentYear = new Date().getFullYear();

  return (
    <div className="officer-container">
      <Header title={t('officer')} toggleSidebar={toggleSidebar} />

      <div className="officer-main">
        {/* Sidebar */}
        <div className={`officer-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="officer-sidebar-top">
            <div className="officer-brand">
              <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
              {!sidebarCollapsed && (
                <div className="officer-welcome-text">{t('navMenu')}</div>
              )}
            </div>
            <nav className="officer-nav">
              <NavLink to="dashboard" className={({ isActive }) => `officer-nav-item ${isActive ? 'active' : ''}`}>
                <FaHome /> {!sidebarCollapsed && t('dashboard')}
              </NavLink>

              <div
                className="officer-nav-item officer-nav-parent"
                onClick={() => setNotifiesExpanded(!notifiesExpanded)}
              >
                <FaBell /> {!sidebarCollapsed && t('taxNotifies')}
                {!sidebarCollapsed && (notifiesExpanded ? <FaChevronDown /> : <FaChevronRight />)}
              </div>
              {notifiesExpanded && !sidebarCollapsed && (
                <>
                  <NavLink
                    to="taxnotifies/unevaluated"
                    className={({ isActive }) => `officer-nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    {t('unevaluated')}
                  </NavLink>
                  <NavLink
                    to="taxnotifies/all"
                    className={({ isActive }) => `officer-nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    {t('allNotifies')}
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="officer-content">
          <div className="officer-page-content">
            <Outlet />
          </div>
        </div>
      </div>

      <div className="officer-global-footer">
        <p>&copy; {currentYear} {t('footerText')}</p>
      </div>
    </div>
  );
};

export default OfficerLayout;