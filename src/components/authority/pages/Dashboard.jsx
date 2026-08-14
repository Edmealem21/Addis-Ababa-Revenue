import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import addisLogo from '../../../assets/images/addis-logo.png';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();

  return (
    <div className="page-content">
      <div className="dashboard-frame">
        <div className="logo-section">
          
          <img src={addisLogo} alt="Addis Ababa Revenues Bureau" className="logo-image-dashboard" />
          <div className="line-bottom"></div>
          <h1 className="welcome-text">እንኳን በደህና መጡ!</h1>
          <p className="welcome-sub">{user?.name || 'ተጠቃሚ'}</p>
          <div className="line-top"></div>
          <div className="line-divider"></div>
        </div>
        <div className="dashboard-footer">
          <p>&copy; {currentYear} የአዲስ አበባ ከተማ አስተዳደር ገቢዎብ</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;