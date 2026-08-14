import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import addisLogo from '../../assets/images/addis-logo.png';

// Fallback for revenue-logo.png (if missing, ignore)
let revenueLogo;
try {
  revenueLogo = require('../../assets/images/revenue-logo.png');
} catch (e) {
  revenueLogo = null;
}

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      // === Demo Credentials ===
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
      // === NEW: Authority Account ===
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
        setError('የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል አስገብተዋል!');
      }
    } catch (err) {
      setError('የመግቢያ ሂደት አልተሳካም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo Section */}
        <div className="login-logo-outer">
          <div className="logo-circle">
            <img src={addisLogo} alt="Addis Ababa Revenues Bureau Logo" />
          </div>
        </div>

        {/* Login Form */}
        <div className="login-card">
          {/* <h2 className="login-title">እንኳን በደህና መጡ</h2> */}
          <p className="login-subtitle">ወደ ገቢዎች አስተዳደር ስርዓት ለመግባት መረጃዎን ያስገቡ</p>

          {error && (
            <div className="error-alert">
              <FaExclamationCircle />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              {/* <label>የተጠቃሚ ስም</label> */}
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  placeholder="👤 ተጠቃሚ ስም ያስገቡ"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              {/* <label>የይለፍ ቃል</label> */}
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="🔒 የይለፍ ቃል ያስገቡ"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-button-spacer"></div>

            <button type="submit" className="btn-login" disabled={loading}>
              <FaSignInAlt />
              {loading ? 'እባክዎ ይጠብቁ...' : 'ግባ'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              &copy; {currentYear} 
              <strong> የአዲስ አበባ ከተማ አስተዳደር ገቢዎብ</strong>
            </p>
            <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px', lineHeight: '1.6' }}>
              <strong>Demo Accounts:</strong><br />
              👤 admin / admin123 (Admin)<br />
              👤 ictadmin / ictadmin123 (ICT Administrator)<br />
              👤 officer / officer123 (Officer)<br />
              👤 authority / authority123 (Authority)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;