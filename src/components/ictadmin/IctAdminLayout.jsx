import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  FaHome, FaUniversity, FaUsers, FaUser, FaFileInvoice, 
  FaChevronDown, FaChevronRight 
} from 'react-icons/fa';
import Header from '../common/Header';
import addisLogo from '../../assets/images/addis-logo.png';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../common/Footer';

const initialEmployees = [
  { id: 1, fullName: 'አስቴር አለሙ', idNumber: 'REV-001', jobCategory: 'ICT Administrator', taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', status: 'Active', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: 2, fullName: 'ተስፋዬ መኮንን', idNumber: 'REV-002', jobCategory: 'Officer', taxCenter: 'አዲስ አበባ ቦሌ', status: 'Active', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
];

const IctAdminLayout = () => {
  const [employeesExpanded, setEmployeesExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const { t } = useLanguage();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="ictadmin-container">
      <Header 
        title={t('ictAdmin')} 
        toggleSidebar={toggleSidebar} 
      />

      <div className="ictadmin-main">
        {/* Sidebar */}
        <div className={`ictadmin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="ictadmin-brand">
            <img src={addisLogo} alt="Addis Ababa Revenues Bureau" />
            <div className="ictadmin-welcome-text">{t('navMenu')}</div>
          </div>
          <nav className="ictadmin-nav">
            <NavLink to="dashboard" className={({ isActive }) => `ictadmin-nav-item ${isActive ? 'active' : ''}`}>
              <FaHome /> {!sidebarCollapsed && t('dashboard')}
            </NavLink>
            <NavLink to="bankaccounts" className={({ isActive }) => `ictadmin-nav-item ${isActive ? 'active' : ''}`}>
              <FaUniversity /> {!sidebarCollapsed && t('bankAccounts')}
            </NavLink>

            <div className="ictadmin-nav-item ictadmin-nav-parent" onClick={() => setEmployeesExpanded(!employeesExpanded)}>
              <FaUsers /> {!sidebarCollapsed && t('employees')}
              {!sidebarCollapsed && (employeesExpanded ? <FaChevronDown /> : <FaChevronRight />)}
            </div>
            {employeesExpanded && !sidebarCollapsed && (
              <>
                <NavLink to="employees/employee-data" className={({ isActive }) => `ictadmin-nav-subitem ${isActive ? 'active' : ''}`}>
                  <FaUser /> {t('employeeData')}
                </NavLink>
                <NavLink to="employees/user-data" className={({ isActive }) => `ictadmin-nav-subitem ${isActive ? 'active' : ''}`}>
                  <FaUser /> {t('userData')}
                </NavLink>
              </>
            )}

            <NavLink to="taxpayers" className={({ isActive }) => `ictadmin-nav-item ${isActive ? 'active' : ''}`}>
              <FaFileInvoice /> {!sidebarCollapsed && t('taxPayers')}
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
      <Footer />
    </div>
  );
};

export default IctAdminLayout;