import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  FaHome, FaUniversity, FaUsers, FaUser, FaFileInvoice, 
  FaChevronDown, FaChevronRight 
} from 'react-icons/fa';
import Header from '../common/Header';
import addisLogo from '../../assets/images/addis-logo.png';   // ← ADDED: logo import

const initialEmployees = [
  { id: 1, fullName: 'አስቴር አለሙ', idNumber: 'REV-001', jobCategory: 'ICT Administrator', taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', status: 'Active', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: 2, fullName: 'ተስፋዬ መኮንን', idNumber: 'REV-002', jobCategory: 'Officer', taxCenter: 'አዲስ አበባ ቦሌ', status: 'Active', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
];

const IctAdminLayout = () => {
  const [employeesExpanded, setEmployeesExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="ictadmin-container">
      {/* === HEADER – FULL WIDTH AT THE TOP === */}
      <Header 
        // title="ICT አስተዳዳሪ" 
        toggleSidebar={toggleSidebar} 
      />

      {/* === MAIN ROW – SIDEBAR + CONTENT === */}
      <div className="ictadmin-main">
        {/* Sidebar */}
        <div className={`ictadmin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="ictadmin-brand">
            <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
            {/* {!sidebarCollapsed && <h3>ICT አስተዳዳሪ</h3>} */}
            <div className="ictadmin-welcome-text">የአሰሳ ምናሌ</div>
            
          </div>
          <nav className="ictadmin-nav">
            <NavLink to="dashboard" className={({ isActive }) => `ictadmin-nav-item ${isActive ? 'active' : ''}`}>
              <FaHome /> {!sidebarCollapsed && 'ዳሽቦርድ'}
            </NavLink>
            <NavLink to="bankaccounts" className={({ isActive }) => `ictadmin-nav-item ${isActive ? 'active' : ''}`}>
              <FaUniversity /> {!sidebarCollapsed && 'የባንክ መለያዎች'}
            </NavLink>

            <div className="ictadmin-nav-item ictadmin-nav-parent" onClick={() => setEmployeesExpanded(!employeesExpanded)}>
              <FaUsers /> {!sidebarCollapsed && 'ሰራተኞች'}
              {!sidebarCollapsed && (employeesExpanded ? <FaChevronDown /> : <FaChevronRight />)}
            </div>
            {employeesExpanded && !sidebarCollapsed && (
              <>
                <NavLink to="employees/employee-data" className={({ isActive }) => `ictadmin-nav-subitem ${isActive ? 'active' : ''}`}>
                  <FaUser /> የሰራተኛ መረጃ
                </NavLink>
                <NavLink to="employees/user-data" className={({ isActive }) => `ictadmin-nav-subitem ${isActive ? 'active' : ''}`}>
                  <FaUser /> የተጠቃሚ መረጃ
                </NavLink>
              </>
            )}

            <NavLink to="taxpayers" className={({ isActive }) => `ictadmin-nav-item ${isActive ? 'active' : ''}`}>
              <FaFileInvoice /> {!sidebarCollapsed && 'ግብር ከፋዮች'}
            </NavLink>
          </nav>
        </div>

        {/* Content Area */}
        <div className="ictadmin-content">
          <div className="ictadmin-page-content">
            <Outlet context={{ employees, setEmployees }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IctAdminLayout;