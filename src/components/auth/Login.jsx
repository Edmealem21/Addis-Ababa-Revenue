import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';
import ThemeToggle from '../common/ThemeToggle';
import addisLogo from '../../assets/images/addis-logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (formData.username === 'admin' && formData.password === 'admin123') {
        login({
          id: 1,
          name: 'አስቴር አለሙ',
          role: 'Admin',
          department: 'Information Technology',
          email: 'aster.alemu@addisrevenue.gov.et'
        });
        navigate('/dashboard');
      } 
      else if (formData.username === 'ictadmin' && formData.password === 'ictadmin123') {
        login({
          id: 2,
          name: 'ICT Admin User',
          role: 'ICT Administrator',
          jobCategory: 'ICT Administrator',
          taxCenter: 'አዲስ አበባ ቦሌ'
        });
        navigate('/ictadmin/dashboard');
      }
      else if (formData.username === 'officer' && formData.password === 'officer123') {
        login({
          id: 3,
          name: 'Officer User',
          role: 'Officer',
          jobCategory: 'Tax Officer',
          taxCenter: 'አዲስ አበባ ቦሌ'
        });
        navigate('/officer/dashboard');
      }
      else if (formData.username === 'authority' && formData.password === 'authority123') {
        login({
          id: 4,
          name: 'Authority User',
          role: 'Authority',
          jobCategory: 'Authority',
          taxCenter: 'አዲስ አበባ ቦሌ'
        });
        navigate('/authority/dashboard');
      }
      else {
        setError(t('loginError'));
      }
    } catch (err) {
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative bg-gradient-to-r from-navy-800 via-navy-700 to-gold-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Top right language & theme toggles */}
      <div className="absolute top-5 right-6 flex items-center gap-2.5 z-10">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center w-full max-w-[440px] animate-slideUp z-10">
        <div className="flex justify-center items-center w-full mb-6">
          <div className="w-44 h-44 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center p-1 border-4 border-gold-500 shadow-2xl transition-transform duration-300 hover:scale-105">
            <img src={addisLogo} alt="Addis Ababa Revenues Bureau Logo" className="max-w-full max-h-full object-contain rounded-full" />
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-md shadow-2xl w-full p-8 relative border border-slate-100 dark:border-slate-700 max-w-[400px] text-slate-800 dark:text-slate-100">
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">{t('loginSubtitle')}</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-xs font-semibold flex items-center gap-2 border-l-4 border-red-600">
              <FaExclamationCircle className="shrink-0 text-sm" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                name="username"
                className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium transition-all duration-200 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-navy-800/10 placeholder-slate-400 dark:placeholder-slate-400"
                placeholder={t('usernamePlaceholder')}
                value={formData.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium transition-all duration-200 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-navy-800 dark:focus:border-gold-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-navy-800/10 placeholder-slate-400 dark:placeholder-slate-400"
                placeholder={t('passwordPlaceholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="w-full py-3 px-2 text-white bg-blue-600 hover:bg-blue-400 rounded-xl text-sm font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border-none cursor-pointer mt-2" disabled={loading}>
              <FaSignInAlt />
              <span>{loading ? t('loggingIn') : t('loginBtn')}</span>
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
            <p>
              &copy; {currentYear} 
              <strong className="text-navy-800 dark:text-gold-400 font-semibold"> {t('footerText')}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;