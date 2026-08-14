import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaKey, FaEdit, FaUser, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import addisLogo from '../../assets/images/addis-logo.png';
import toast, { Toaster } from 'react-hot-toast';

const Header = ({ title, toggleSidebar }) => {
  // ============================================
  // CONTEXT & NAVIGATION
  // ============================================
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ============================================
  // DROPDOWN & POPUP STATES
  // ============================================
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileSub, setShowProfileSub] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);

  // ============================================
  // FORM STATES
  // ============================================
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [nameForm, setNameForm] = useState({ newName: user?.name || '' });
  const [loading, setLoading] = useState(false);

  // ============================================
  // REFS FOR CLICK OUTSIDE
  // ============================================
  const dropdownRef = useRef(null);
  const subRef = useRef(null);
  const passwordPopupRef = useRef(null);
  const namePopupRef = useRef(null);

  // ============================================
  // CLOSE ALL
  // ============================================
  const closeAll = () => {
    setShowProfileDropdown(false);
    setShowProfileSub(false);
    setShowPasswordPopup(false);
    setShowNamePopup(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setNameForm({ newName: '' });
  };

  // ============================================
  // CLICK OUTSIDE HANDLERS
  // ============================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
        setShowProfileSub(false);
      }
      if (subRef.current && !subRef.current.contains(event.target)) {
        setShowProfileSub(false);
      }
      if (passwordPopupRef.current && !passwordPopupRef.current.contains(event.target)) {
        setShowPasswordPopup(false);
      }
      if (namePopupRef.current && !namePopupRef.current.contains(event.target)) {
        setShowNamePopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================
  // TOGGLE PROFILE DROPDOWN
  // ============================================
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (showProfileSub) setShowProfileSub(false);
  };

  // ============================================
  // TOGGLE PROFILE SUB
  // ============================================
  const toggleProfileSub = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileSub(!showProfileSub);
  };

  // ============================================
  // OPEN PASSWORD POPUP
  // ============================================
  const openPasswordPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileSub(false);
    setShowPasswordPopup(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // ============================================
  // OPEN NAME POPUP
  // ============================================
  const openNamePopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileSub(false);
    setShowNamePopup(true);
    setNameForm({ newName: user?.name || '' });
  };

  // ============================================
  // HANDLE LOGOUT
  // ============================================
  const handleLogout = () => {
    logout();
    closeAll();
    navigate('/login');
  };

  // ============================================
  // HANDLE PASSWORD CHANGE
  // ============================================
  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword.trim()) {
      toast.error('እባክዎ የአሁኑን የይለፍ ቃል ያስገቡ!');
      return;
    }
    if (!passwordForm.newPassword.trim()) {
      toast.error('እባክዎ አዲስ የይለፍ ቃል ያስገቡ!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('አዲስ የይለፍ ቃል እና ማረጋገጫ አይመሳሰሉም!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል! ✅');
      setLoading(false);
      setShowPasswordPopup(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  // ============================================
  // HANDLE NAME CHANGE
  // ============================================
  const handleNameChange = (e) => {
    e.preventDefault();

    if (!nameForm.newName.trim()) {
      toast.error('እባክዎ ሙሉ ስም ያስገቡ!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('ሙሉ ስም በተሳካ ሁኔታ ተቀይሯል! ✅');
      setLoading(false);
      setShowNamePopup(false);
      setNameForm({ newName: '' });
    }, 1000);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <span className="page-title">{title}</span>
        </div>

        <div className="navbar-right">
          {/* Admin Profile – Click to toggle dropdown */}
          <div className="admin-profile" onClick={toggleProfileDropdown}>
            <div className="avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="admin-name">{user?.name || 'አስተዳዳሪ'}</span>
          </div>

          {/* ============================================
              PROFILE DROPDOWN – positioned below the profile
              ============================================ */}
          {showProfileDropdown && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-dropdown-content">
                {/* Logo */}
                <div className="profile-dropdown-logo">
                  <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
                </div>

                {/* Job Category */}
                <div className="profile-dropdown-job">
                  {user?.jobCategory || 'የተጨማሪ እሴት ታክስ ባለሙያ'}
                </div>

                {/* Full Name */}
                <div className="profile-dropdown-name">
                  {user?.name || 'አስተዳዳሪ'}
                </div>
              </div>

              {/* Actions */}
              <div className="profile-dropdown-actions">
                {/* User Profile Button – opens sub-menu */}
                <div className="profile-btn-wrapper" style={{ width: '50%' }}>
                  <button className="btn-profile-dropdown profile-btn" onClick={toggleProfileSub} style={{ width: '100%' }}>
                    የግል ማህደር
                  </button>

                  {/* Sub-menu */}
                  {showProfileSub && (
                    <div className="profile-sub-dropdown" ref={subRef}>
                      <button className="sub-dropdown-item" onClick={openPasswordPopup}>
                        <FaKey /> የይለፍ ቃል ቀይር
                      </button>
                      <div className="sub-divider"></div>
                      <button className="sub-dropdown-item" onClick={openNamePopup}>
                        <FaEdit /> ሙሉ ስም ቀይር
                      </button>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button className="btn-profile-dropdown logout-btn" onClick={handleLogout} style={{ width: '50%' }}>
                  ዘግተ ውጣ
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============================================
          CHANGE PASSWORD POPUP (centered modal)
          ============================================ */}
      {showPasswordPopup && (
        <div className="popup-overlay" onClick={() => setShowPasswordPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()} ref={passwordPopupRef}>
            <div className="popup-header">
              <div className="popup-title">
                <FaKey className="popup-icon" />
                <span>የይለፍ ቃል ቀይር</span>
              </div>
              <button className="popup-close" onClick={() => setShowPasswordPopup(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-body">
              <form onSubmit={handlePasswordChange}>
                <div className="form-group full-width">
                  <label>የአሁኑ የይለፍ ቃል <span className="required">*</span></label>
                  <input
                    type="password"
                    placeholder="የአሁኑን የይለፍ ቃል ያስገቡ"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group full-width">
                  <label>አዲስ የይለፍ ቃል <span className="required">*</span></label>
                  <input
                    type="password"
                    placeholder="አዲስ የይለፍ ቃል ያስገቡ"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>አዲስ የይለፍ ቃል አረጋግጥ <span className="required">*</span></label>
                  <input
                    type="password"
                    placeholder="አዲስ የይለፍ ቃል እንደገና ያስገቡ"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="popup-actions">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'በመቀየር ላይ...' : 'ያስቀምጡ'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordPopup(false)}>
                    ሰርዝ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          CHANGE FULL NAME POPUP (centered modal)
          ============================================ */}
      {showNamePopup && (
        <div className="popup-overlay" onClick={() => setShowNamePopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()} ref={namePopupRef}>
            <div className="popup-header">
              <div className="popup-title">
                <FaEdit className="popup-icon" />
                <span>ሙሉ ስም ቀይር</span>
              </div>
              <button className="popup-close" onClick={() => setShowNamePopup(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-body">
              <form onSubmit={handleNameChange}>
                <div className="form-group full-width">
                  <label>አዲስ ሙሉ ስም <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="አዲስ ሙሉ ስም ያስገቡ"
                    value={nameForm.newName}
                    onChange={(e) => setNameForm({ newName: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="popup-actions">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'በመቀየር ላይ...' : 'ያስቀምጡ'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowNamePopup(false)}>
                    ሰርዝ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toaster */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1a1a2e',
            padding: '16px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            icon: '✅',
            style: { borderLeft: '4px solid #27ae60' },
          },
          error: {
            icon: '❌',
            style: { borderLeft: '4px solid #e74c3c' },
          },
        }}
      />
    </>
  );
};

export default Header;