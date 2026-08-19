import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaKey, FaEdit, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import addisLogo from '../../assets/images/addis-logo.png';
import toast, { Toaster } from 'react-hot-toast';

const Header = ({ title, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileSub, setShowProfileSub] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [nameForm, setNameForm] = useState({ newName: user?.name || '' });
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const subRef = useRef(null);
  const passwordPopupRef = useRef(null);
  const namePopupRef = useRef(null);

  const closeAll = () => {
    setShowProfileDropdown(false);
    setShowProfileSub(false);
    setShowPasswordPopup(false);
    setShowNamePopup(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setNameForm({ newName: '' });
  };

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

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (showProfileSub) setShowProfileSub(false);
  };

  const toggleProfileSub = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileSub(!showProfileSub);
  };

  const openPasswordPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileSub(false);
    setShowPasswordPopup(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const openNamePopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileSub(false);
    setShowNamePopup(true);
    setNameForm({ newName: user?.name || '' });
  };

  const handleLogout = () => {
    logout();
    closeAll();
    navigate('/login');
  };

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

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <span className="page-title">{title || t('appTitle')}</span>
        </div>

        <div className="navbar-right">
          {/* Theme & Language Toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Admin Profile */}
          <div className="admin-profile" onClick={toggleProfileDropdown}>
            <div className="avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="admin-name">{user?.name || t('admin')}</span>
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-dropdown-content">
                <div className="profile-dropdown-logo">
                  <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
                </div>
                <div className="profile-dropdown-job">
                  {user?.jobCategory || t('vatExpert')}
                </div>
                <div className="profile-dropdown-name">
                  {user?.name || t('admin')}
                </div>
              </div>

              <div className="profile-dropdown-actions">
                <div className="profile-btn-wrapper" style={{ width: '50%' }}>
                  <button className="btn-profile-dropdown profile-btn" onClick={toggleProfileSub} style={{ width: '100%' }}>
                    {t('personalProfile')}
                  </button>

                  {showProfileSub && (
                    <div className="profile-sub-dropdown" ref={subRef}>
                      <button className="sub-dropdown-item" onClick={openPasswordPopup}>
                        <FaKey /> {t('changePassword')}
                      </button>
                      <div className="sub-divider"></div>
                      <button className="sub-dropdown-item" onClick={openNamePopup}>
                        <FaEdit /> {t('changeName')}
                      </button>
                    </div>
                  )}
                </div>

                <button className="btn-profile-dropdown logout-btn" onClick={handleLogout} style={{ width: '50%' }}>
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Change Password Popup */}
      {showPasswordPopup && (
        <div className="popup-overlay" onClick={() => setShowPasswordPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()} ref={passwordPopupRef}>
            <div className="popup-header">
              <div className="popup-title">
                <FaKey className="popup-icon" />
                <span>{t('changePassword')}</span>
              </div>
              <button className="popup-close" onClick={() => setShowPasswordPopup(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-body">
              <form onSubmit={handlePasswordChange}>
                <div className="form-group full-width">
                  <label>{t('currentPassword')} <span className="required">*</span></label>
                  <input
                    type="password"
                    placeholder={t('currentPassword')}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t('newPassword')} <span className="required">*</span></label>
                  <input
                    type="password"
                    placeholder={t('newPassword')}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>{t('confirmPassword')} <span className="required">*</span></label>
                  <input
                    type="password"
                    placeholder={t('confirmPassword')}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="popup-actions">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordPopup(false)}>
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Name Popup */}
      {showNamePopup && (
        <div className="popup-overlay" onClick={() => setShowNamePopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()} ref={namePopupRef}>
            <div className="popup-header">
              <div className="popup-title">
                <FaEdit className="popup-icon" />
                <span>{t('changeName')}</span>
              </div>
              <button className="popup-close" onClick={() => setShowNamePopup(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="popup-body">
              <form onSubmit={handleNameChange}>
                <div className="form-group full-width">
                  <label>{t('newFullName')} <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder={t('newFullName')}
                    value={nameForm.newName}
                    onChange={(e) => setNameForm({ newName: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="popup-actions">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowNamePopup(false)}>
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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