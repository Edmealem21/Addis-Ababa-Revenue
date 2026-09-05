import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUniversity, 
  FaUsers, 
  FaUser, 
  FaUserCog, 
  FaFileInvoice 
} from 'react-icons/fa';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';
import { useLanguage } from '../../context/LanguageContext';

const initialEmployees = [
  { id: 1, fullName: 'አስቴር አለሙ', idNumber: 'REV-001', jobCategory: 'ICT Administrator', taxCenter: 'አዲስ አበባ ቅዱስ ጊዮርጊስ', status: 'Active', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: 2, fullName: 'ተስፋዬ መኮንን', idNumber: 'REV-002', jobCategory: 'Officer', taxCenter: 'አዲስ አበባ ቦሌ', status: 'Active', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
];

const IctAdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const { t } = useLanguage();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const ictAdminMenuItems = [
    { path: '/ictadmin/dashboard', label: t('dashboard'), icon: <FaTachometerAlt /> },
    { path: '/ictadmin/bankaccounts', label: t('bankAccounts'), icon: <FaUniversity /> },
    {
      key: 'employees',
      label: t('employees'),
      icon: <FaUsers />,
      children: [
        { path: '/ictadmin/employees/employee-data', label: t('employeeData'), icon: <FaUser /> },
        { path: '/ictadmin/employees/user-data', label: t('userData'), icon: <FaUserCog /> },
      ],
    },
    { path: '/ictadmin/taxpayers', label: t('taxPayers'), icon: <FaFileInvoice /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      <Header
        title={t('ictAdmin')}
        toggleSidebar={toggleSidebar}
        menuItems={ictAdminMenuItems}
        roleTitle={t('ictAdmin')}
      />

      <div className="flex flex-1 min-h-[calc(100vh-57px)] w-full overflow-hidden relative">
        <div className="hidden md:flex shrink-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            menuItems={ictAdminMenuItems}
            roleTitle={t('ictAdmin')}
          />
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col min-h-[calc(100vh-57px)] overflow-x-hidden w-full">
          <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto">
            <Outlet context={{ employees, setEmployees }} />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default IctAdminLayout;