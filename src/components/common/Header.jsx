import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ title, toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleDashboard = () => {
    setDropdownOpen(false);
    navigate('/dashboard');
  };

  // Toggle dropdown - DOES NOT NAVIGATE
  const toggleDropdown = (e) => {
    e.preventDefault();      // ← Prevents navigation
    e.stopPropagation();     // ← Prevents event bubbling
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <span className="page-title">{title}</span>
      </div>

      <div className="navbar-right">
        {/* Admin Profile - Click to toggle dropdown */}
        <div 
          className="admin-profile" 
          onClick={toggleDropdown}  // ← Toggles dropdown, doesn't navigate
        >
          <div className="avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <span className="admin-name">{user?.name || 'አስተዳዳሪ'}</span>
          {/* <FaChevronDown className="dropdown-icon" /> */}
        </div>

        {/* Dropdown Menu - Positioned below admin profile */}
        <div 
          className={`admin-dropdown ${dropdownOpen ? 'show' : ''}`} 
          ref={dropdownRef}
        >
          <button className="dropdown-item" onClick={handleDashboard}>
            <FaTachometerAlt /> ዳሽቦርድ
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleLogout}>
            <FaSignOutAlt /> ውጣ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;