import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaHome, FaBell, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import Header from '../common/Header';
import addisLogo from '../../assets/images/addis-logo.png';

const OfficerLayout = () => {
  const [notifiesExpanded, setNotifiesExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const currentYear = new Date().getFullYear();

  return (
    <div className="officer-container">
      {/* HEADER – FULL WIDTH AT THE TOP */}
      <Header title="Officer" toggleSidebar={toggleSidebar} />

      {/* MAIN ROW – SIDEBAR + CONTENT */}
      <div className="officer-main">
        {/* Sidebar */}
        <div className={`officer-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="officer-sidebar-top">
            <div className="officer-brand">
              <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
              {/* {!sidebarCollapsed && <h3>Officer</h3>} */}
              {!sidebarCollapsed && (
                <div className="officer-welcome-text">ያአሰሳ ምናሌ</div>
              )}
            </div>
            <nav className="officer-nav">
              <NavLink to="dashboard" className={({ isActive }) => `officer-nav-item ${isActive ? 'active' : ''}`}>
                <FaHome /> {!sidebarCollapsed && 'ዳሽቦርድ'}
              </NavLink>

              <div
                className="officer-nav-item officer-nav-parent"
                onClick={() => setNotifiesExpanded(!notifiesExpanded)}
              >
                <FaBell /> {!sidebarCollapsed && 'የታክስ ማሳወቂያዎች'}
                {!sidebarCollapsed && (notifiesExpanded ? <FaChevronDown /> : <FaChevronRight />)}
              </div>
              {notifiesExpanded && !sidebarCollapsed && (
                <>
                  <NavLink
                    to="taxnotifies/unevaluated"
                    className={({ isActive }) => `officer-nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    ያልተገመገመ
                  </NavLink>
                  <NavLink
                    to="taxnotifies/all"
                    className={({ isActive }) => `officer-nav-subitem ${isActive ? 'active' : ''}`}
                  >
                    ሁሉም ማሳወቂያዎች
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Sidebar Footer (inside sidebar) */}
          {/* <div className="officer-sidebar-footer">
            <p>&copy; {currentYear}</p>
            <p>የአዲስ አበባ ገቢዎብ</p>
          </div> */}
        </div>

        {/* Content Area */}
        <div className="officer-content">
          <div className="officer-page-content">
            <Outlet />
          </div>
        </div>
      </div>

      {/* === GLOBAL FOOTER – Full width, below sidebar and content === */}
      <div className="officer-global-footer">
        <p>&copy; {currentYear} የአዲስ አበባ ከተማ አስተዳደር ገቢዎብ</p>
      </div>
    </div>
  );
};

export default OfficerLayout;