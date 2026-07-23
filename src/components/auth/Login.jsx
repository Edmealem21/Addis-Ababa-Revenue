import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import addisLogo from '../../assets/images/addis-logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
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
      
      if (formData.username === 'admin' && formData.password === 'admin123') {
        login({
          id: 1,
          name: 'Admin',
          role: 'ICT Administrator',
          department: 'Information Technology',
          email: 'aster.alemu@addisrevenue.gov.et'
        });
        navigate('/dashboard');
      } else {
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
        {/* Logo Section - Centered Above Form */}
        <div className="login-logo-outer">
          <div className="logo-circle">
            <img  src={addisLogo} alt="Addis Ababa Revenues Bureau Logo" />
          </div>
        </div>

        {/* Login Form */}
        <div className="login-card">
          <p className="login-subtitle">መተግበሪያውን መጠቀም ለመጀመር በመለያ ይግቡ</p>

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

            {/* Vertical Space between password and login button */}
            <div className="login-button-spacer"></div>

            <button type="submit" className="btn-login" >
              {/* <FaSignInAlt /> */} ይግቡ
              {/* {loading ? 'እባክዎ ይጠብቁ...' : 'ግባ'} */}
            </button>
            <hr class="custom-line" />
          </form>

          <div className="login-footer">
            <p>
              &copy; {currentYear} 
              <strong> የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ</strong>
            </p>
            {/* <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
              ለሙከራ: ተጠቃሚ: admin | የይለፍ ቃል: admin123
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;