import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import addisLogo from '../../../assets/images/addis-logo.png';

const IctDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-content">
      <div className="dashboard-frame">
        <div className="logo-section">
          <div className="line-top"></div>
          <img src={addisLogo} alt="Logo" className="logo-image-dashboard" />
          <div className="line-bottom"></div>
          <h1 className="welcome-text">እንኳን በደህና መጡ!</h1>
          <p className="welcome-sub">{user?.name || 'ተጠቃሚ'}</p>
          <div className="line-divider"></div>
        </div>
      </div>
    </div>
  );
};

export default IctDashboard;