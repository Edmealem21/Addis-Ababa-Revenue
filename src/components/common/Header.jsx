import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { 
  FaBars, 
  FaKey, 
  FaEdit, 
  FaTimes, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaChevronRight 
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import addisLogo from '../../assets/images/addis-logo.png';
import toast, { Toaster } from 'react-hot-toast';

const Header = ({ title, toggleSidebar, menuItems, roleTitle }) => {
  const { user, logout } = useContext(AuthContext);
  const { t, tData } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileSub, setShowProfileSub] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState({ ict: true, employees: true, notifies: true });

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

  const isActivePath = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (key) => {
    setExpandedSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAll = () => {
    setShowProfileDropdown(false);
    setShowProfileSub(false);
    setShowPasswordPopup(false);
    setShowNamePopup(false);
    setMobileMenuOpen(false);
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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowProfileSub(false);
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
    setShowPasswordPopup(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const openNamePopup = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowProfileSub(false);
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
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

  const handleHamburgerClick = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      if (toggleSidebar) toggleSidebar();
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-navy-800 via-navy-700 to-gold-500 dark:from-slate-900 dark:via-navy-900 dark:to-slate-800 text-white px-3 sm:px-6 py-2.5 flex justify-between items-center z-[100] sticky top-0 w-full shadow-md border-b border-navy-900/30">
        {/* Left Side: Single Hamburger Button + Title */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            className="bg-white/15 hover:bg-white/25 text-white p-2 rounded-lg transition-colors border-none cursor-pointer flex items-center justify-center text-lg focus:outline-none shrink-0"
            onClick={handleHamburgerClick}
            aria-label="Toggle Menu"
          >
            <FaBars />
          </button>
          <span className="hidden sm:inline text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-sm truncate max-w-[200px] sm:max-w-md">
            {title || t('appTitle')}
          </span>
          <span className="inline sm:hidden text-xs font-bold text-white drop-shadow-sm truncate">
            {roleTitle || title || t('appTitle')}
          </span>
        </div>

        {/* Right Side: Desktop Controls (Language, Theme, User Profile) */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-5 relative">
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer py-1.5 px-2 sm:px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/10 transition-colors shrink-0"
            onClick={toggleProfileDropdown}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-navy-800 font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="font-semibold text-xs sm:text-sm text-white drop-shadow-sm truncate max-w-[120px]">
              {user?.name ? tData(user.name) : t('admin')}
            </span>
          </div>

          {/* Profile Dropdown (Desktop) */}
          {showProfileDropdown && (
            <div
              className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-2xl min-w-[240px] p-4 border border-slate-200 dark:border-slate-700 z-[9999] animate-slideDown"
              ref={dropdownRef}
            >
              <div className="flex flex-col items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                <div className="w-16 h-16 object-contain rounded-full border-2 border-gold-500 mb-2 p-1 bg-white flex items-center justify-center">
                  <img
                    src={addisLogo}
                    alt="Addis Ababa Revenues Bureau"
                    className="max-w-full rounded-full max-h-full object-contain"
                  />
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                  {user?.jobCategory || t('vatExpert')}
                </div>
                <div className="text-base font-bold text-navy-800 dark:text-white">
                  {user?.name || t('admin')}
                </div>
              </div>

              <div className="flex gap-2 relative w-full">
                <div className="w-1/2 relative">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-400 dark:bg-navy-700 dark:hover:bg-navy-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors text-center border-none cursor-pointer"
                    onClick={toggleProfileSub}
                  >
                    {t('personalProfile')}
                  </button>

                  {showProfileSub && (
                    <div
                      className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-blue-600 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-[10000]"
                      ref={subRef}
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors border-none bg-transparent cursor-pointer"
                        onClick={openPasswordPopup}
                      >
                        <FaKey className="text-navy-800 dark:text-gold-400" /> {t('changePassword')}
                      </button>
                      <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                      <button
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors border-none bg-transparent cursor-pointer"
                        onClick={openNamePopup}
                      >
                        <FaEdit className="text-navy-800 dark:text-gold-400" /> {t('changeName')}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className="w-1/2 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors text-center border-none cursor-pointer"
                  onClick={handleLogout}
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE MENU DRAWER (Triggers on Mobile Hamburger Click) */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[998] transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide Drawer */}
          <div className="fixed inset-y-0 left-0 w-[290px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 z-[999] shadow-2xl border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-slideRight">
            {/* Mobile Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/90">
              <div className="flex items-center gap-3">
                <img
                  src={addisLogo}
                  alt="Addis Ababa Revenues Bureau"
                  className="w-10 h-10 rounded-full border-2 border-gold-500 bg-white object-contain"
                />
                <span className="font-bold text-xs text-navy-800 dark:text-gold-400 uppercase tracking-wide">
                  {roleTitle || t('navMenu')}
                </span>
              </div>
              <button
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg text-lg bg-transparent border-none cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Quick Header Actions Section (Language & Theme Toggles) */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-700/40 flex items-center justify-around">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {t('language')}:
                </span>
                <LanguageToggle />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Role Navigation Items */}
            <nav className="flex-1 p-3 overflow-y-auto space-y-1">
              {menuItems &&
                menuItems.map((item, index) => {
                  if (item.children && item.children.length > 0) {
                    const isSubExpanded = expandedSubmenus[item.key || index] !== false;
                    const hasActiveChild = item.children.some((child) => isActivePath(child.path));

                    return (
                      <div key={item.key || index} className="w-full">
                        <div
                          className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                            hasActiveChild
                              ? 'bg-navy-50 dark:bg-slate-700/60 text-navy-800 dark:text-gold-400 font-bold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          onClick={() => toggleSubmenu(item.key || index)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg text-slate-500 dark:text-slate-400">
                              {item.icon}
                            </span>
                            <span className="truncate">{item.label}</span>
                          </div>
                          {isSubExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </div>

                        {isSubExpanded && (
                          <div className="pl-6 pt-1 space-y-1">
                            {item.children.map((child, childIdx) => {
                              const active = isActivePath(child.path);
                              return (
                                <NavLink
                                  key={child.path || childIdx}
                                  to={child.path}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
                                    active
                                      ? 'bg-gold-500/20 text-navy-900 dark:text-gold-400 font-bold border-l-2 border-gold-500'
                                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  <span className="text-sm">{child.icon}</span>
                                  <span className="truncate">{child.label}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const active = isActivePath(item.path);
                  return (
                    <NavLink
                      key={item.path || index}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                        active
                          ? 'bg-gold-500 text-navy-950 font-bold shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
            </nav>

            {/* Mobile User Profile Section & Actions at Bottom */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-800 dark:bg-gold-500 text-white dark:text-navy-950 font-bold flex items-center justify-center text-base shrink-0 shadow-md">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                    {user?.name ? tData(user.name) : t('admin')}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    {user?.role ? tData(user.role) : (user?.jobCategory ? tData(user.jobCategory) : t('vatExpert'))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border-none cursor-pointer"
                  onClick={openPasswordPopup}
                >
                  <FaKey size={11} />
                  <span>{t('changePassword')}</span>
                </button>
                <button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors border-none cursor-pointer"
                  onClick={openNamePopup}
                >
                  <FaEdit size={11} />
                  <span>{t('changeName')}</span>
                </button>
              </div>

              <button
                className="w-full bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors border-none cursor-pointer"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Popup */}
      {showPasswordPopup && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
          onClick={() => setShowPasswordPopup(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            ref={passwordPopupRef}
          >
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-5 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base">
                <FaKey className="text-gold-400" />
                <span>{t('changePassword')}</span>
              </div>
              <button
                className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg"
                onClick={() => setShowPasswordPopup(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('currentPassword')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                    placeholder={t('currentPassword')}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('newPassword')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                    placeholder={t('newPassword')}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('confirmPassword')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                    placeholder={t('confirmPassword')}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-400 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer border-none"
                    disabled={loading}
                  >
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 hover:bg-red-400 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none"
                    onClick={() => setShowPasswordPopup(false)}
                  >
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
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
          onClick={() => setShowNamePopup(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            ref={namePopupRef}
          >
            <div className="bg-blue-600 dark:bg-blue-400 text-white px-5 py-4 flex items-center justify-between border-b border-navy-700">
              <div className="flex items-center gap-3 font-bold text-base">
                <FaEdit className="text-gold-400" />
                <span>{t('changeName')}</span>
              </div>
              <button
                className="text-slate-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-lg"
                onClick={() => setShowNamePopup(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 text-slate-800 dark:text-slate-100">
              <form onSubmit={handleNameChange}>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('newFullName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 transition-colors"
                    placeholder={t('newFullName')}
                    value={nameForm.newName}
                    onChange={(e) => setNameForm({ newName: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-400 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer border-none"
                    disabled={loading}
                  >
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 hover:bg-red-400 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none"
                    onClick={() => setShowNamePopup(false)}
                  >
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