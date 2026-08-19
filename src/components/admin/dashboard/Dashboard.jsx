import React from 'react';
import addisLogo from '../../../assets/images/addis-logo.png';
import { useLanguage } from '../../../context/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  return (
    <div className="page-content">
      <div className="dashboard-frame">
        <div className="logo-section">
          {/* Line above logo */}
          
          
          {/* Logo Image - Maximized to fill frame */}
          <img src={addisLogo} alt="Addis Ababa Revenues Bureau" className="logo-image-dashboard" />
          
          {/* Line below logo */}
          <hr className="line-top" />
          {/* <div className="line-top"></div> */}
          <h1 className="welcome-text">{t('welcome')}</h1>
          <hr className="line-bottom" />
          {/* <div className="line-bottom"></div> */}
          
          {/* Welcome Text */}
          
          {/* <p className="welcome-sub">የአዲስ አበባ ከተማ አስተዳደር ገቢዎብ</p> */}
          
          {/* Bottom Line */}
          {/* <div className="line-divider"></div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;