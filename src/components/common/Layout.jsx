import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBuilding, FaUserCog, FaUsers, FaUser } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../../context/LanguageContext';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const adminMenuItems = [
    { path: '/dashboard', label: t('dashboard'), icon: <FaTachometerAlt /> },
    { path: '/taxcenter', label: t('taxCenter'), icon: <FaBuilding /> },
    {
      key: 'ict',
      label: t('ictAdmin'),
      icon: <FaUserCog />,
      children: [
        { path: '/ict/employee', label: t('employeeData'), icon: <FaUsers /> },
        { path: '/ict/user', label: t('userData'), icon: <FaUser /> },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      {/* Header - Full Width at Top */}
      <Header
        toggleSidebar={toggleSidebar}
        menuItems={adminMenuItems}
        roleTitle={t('admin')}
      />

      {/* Wrapper for sidebar + content below header */}
      <div className="flex flex-1 min-h-[calc(100vh-57px)] w-full overflow-hidden relative">
        {/* Desktop Sidebar: hidden on mobile (< md), shown on desktop (md:flex) */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            menuItems={adminMenuItems}
            roleTitle={t('admin')}
          />
        </div>

        {/* Content Area: takes 100% full width on mobile */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col min-h-[calc(100vh-57px)] overflow-x-hidden w-full">
          <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;