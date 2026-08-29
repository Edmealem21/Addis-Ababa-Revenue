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
    <div className="login-container">
      {/* Top right language & theme toggles */}
      <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', gap: '10px', zIndex: 10 }}>
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="login-wrapper">
        <div className="login-logo-outer">
          <div className="logo-circle">
            <img src={addisLogo} alt="Addis Ababa Revenues Bureau Logo" />
          </div>
        </div>

        <div className="login-card">
          <p className="login-subtitle">{t('loginSubtitle')}</p>

          {error && (
            <div className="error-alert">
              <FaExclamationCircle />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  placeholder={t('usernamePlaceholder')}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-button-spacer"></div>

            <button type="submit" className="btn-login" disabled={loading}>
              <FaSignInAlt style={{ marginRight: '8px' }} />
              {loading ? t('loggingIn') : t('loginBtn')}
            </button>
          </form>

          <div className="login-footer">
            <p>
              &copy; {currentYear} 
              <strong> {t('footerText')}</strong>
            </p>
            {/* <p style={{ fontSize: '12px', color: '#888', marginTop: '6px', lineHeight: '1.6' }}>
              <strong>{t('demoAccounts')}</strong><br />
              👤 admin / admin123 (Admin)<br />
              👤 ictadmin / ictadmin123 (ICT Administrator)<br />
              👤 officer / officer123 (Officer)<br />
              👤 authority / authority123 (Authority)
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;