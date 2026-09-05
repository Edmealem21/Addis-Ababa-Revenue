import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaTachometerAlt } from 'react-icons/fa';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';
import { useLanguage } from '../../context/LanguageContext';

const AuthorityLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const authorityMenuItems = [
    { path: '/authority/dashboard', label: t('dashboard'), icon: <FaTachometerAlt /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
      <Header
        title={t('authority')}
        toggleSidebar={toggleSidebar}
        menuItems={authorityMenuItems}
        roleTitle={t('authority')}
      />

      <div className="flex flex-1 min-h-[calc(100vh-57px)] w-full overflow-hidden relative">
        <div className="hidden md:flex shrink-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            menuItems={authorityMenuItems}
            roleTitle={t('authority')}
          />
        </div>

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

export default AuthorityLayout;