import React from 'react';
import addisLogo from '../../assets/images/addis-logo.png';

const Dashboard = () => {
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
          <h1 className="welcome-text">እንኳን ደህና መጡ</h1>
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