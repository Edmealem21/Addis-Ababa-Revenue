import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import addisLogo from '../../../assets/images/addis-logo.png';
import { useLanguage } from '../../../context/LanguageContext';

const IctDashboard = () => {
  const { user } = useContext(AuthContext);
  const { t, tData } = useLanguage();

  return (
    <div className="page-content">
      <div className="dashboard-frame">
        <div className="logo-section">
          
          <img src={addisLogo} alt="Logo" className="logo-image-dashboard" />
          <div className="line-bottom"></div>
          <h1 className="welcome-text">{t('welcome')}</h1>
          <p className="welcome-sub">{user?.name ? tData(user.name) : t('admin')}</p>
          <div className="line-top"></div>
          <div className="line-divider"></div>
        </div>
      </div>
    
    </div>
  );
};

export default IctDashboard;