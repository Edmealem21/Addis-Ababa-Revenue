import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  
  FaBuilding, 
  FaUsers, 
  FaUserCog, 
  FaUser,
  FaChevronDown,
  FaChevronRight,
  FaTachometerAlt,
} from 'react-icons/fa';
import addisLogo from '../../assets/images/addis-logo.png';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const [ictExpanded, setIctExpanded] = useState(true);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
        {/* <h3>የአዲስ አበባ ገቢዎች</h3> */}
        <span className="sub-text">የአሰሳ ምናሌ</span>
      </div>

      <nav className="sidebar-nav">
        {/* // src/components/common/Sidebar.jsx (excerpt)
        <NavLink to="/ictadmin" className="nav-item">
          <FaUserCog /> ICT አስተዳዳሪ
        </NavLink> */}
        {/* Dashboard */}
        <NavLink 
          to="/dashboard" 
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaTachometerAlt /></span>
          <span>ዳሽቦርድ</span>
        </NavLink>

        {/* Tax Center */}
        <NavLink 
          to="/taxcenter" 
          className={`nav-item ${isActive('/taxcenter') ? 'active' : ''}`}
        >
          <span className="nav-icon"><FaBuilding /></span>
          <span>ታክስ ማእከል</span>
        </NavLink>

        <div className="nav-divider"></div>

        {/* ICT Administrator */}
        <div 
          className="nav-item" 
          onClick={() => setIctExpanded(!ictExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <span className="nav-icon"><FaUserCog /></span>
          <span style={{ flex: 1 }}>የአይቲ አስተዳዳሪ</span>
          {!collapsed && (ictExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
        </div>

        {ictExpanded && !collapsed && (
          <>
            <NavLink 
              to="/ict/employee" 
              className={`nav-sub-item ${isActive('/ict/employee') ? 'active' : ''}`}
            >
              <FaUsers size={14} />
              <span>የሰራተኛ መረጃ</span>
            </NavLink>
            <NavLink 
              to="/ict/user" 
              className={`nav-sub-item ${isActive('/ict/user') ? 'active' : ''}`}
            >
              <FaUser size={14} />
              <span>የተጠቃሚ መረጃ</span>
            </NavLink>
          </>
        )}

        {collapsed && (
          <>
            <NavLink to="/ict/employee" className="nav-item">
              <span className="nav-icon"><FaUsers /></span>
            </NavLink>
            <NavLink to="/ict/user" className="nav-item">
              <span className="nav-icon"><FaUser /></span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;