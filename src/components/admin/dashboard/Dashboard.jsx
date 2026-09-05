import React, { useContext } from 'react';
import { FaBuilding, FaUsers, FaUserCog, FaFileInvoice } from 'react-icons/fa';
import addisLogo from '../../../assets/images/addis-logo.png';
import { useLanguage } from '../../../context/LanguageContext';
import { AuthContext } from '../../../context/AuthContext';
import { useTaxCenters } from '../../../context/TaxCenterContext';

const Dashboard = () => {
  const { t, tData } = useLanguage();
  const { user } = useContext(AuthContext);
  const { taxCenters } = useTaxCenters();

  const stats = [
    {
      id: 'tax-centers',
      title: t('totalTaxCenters'),
      value: taxCenters?.length || 8,
      icon: <FaBuilding className="text-2xl text-blue-600 dark:text-blue-400" />,
      borderColor: 'border-blue-500/30',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
    },
    {
      id: 'employees',
      title: t('totalEmployees'),
      value: 24,
      icon: <FaUsers className="text-2xl text-amber-600 dark:text-amber-400" />,
      borderColor: 'border-amber-500/30',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    },
    {
      id: 'users',
      title: t('totalUsers'),
      value: 18,
      icon: <FaUserCog className="text-2xl text-emerald-600 dark:text-emerald-400" />,
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
    {
      id: 'tax-payers',
      title: t('totalTaxPayers'),
      value: '1,450',
      icon: <FaFileInvoice className="text-2xl text-purple-600 dark:text-purple-400" />,
      borderColor: 'border-purple-500/30',
      badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
    },
  ];

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Hero Section - Background matching Card color */}
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-block px-3 py-1 bg-navy-50 dark:bg-slate-700/60 text-navy-800 dark:text-gold-400 border border-gold-500/40 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            {t('adminDashboardTitle')}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-800 dark:text-gold-400 tracking-wide">
            {t('welcome')} {user?.name ? `, ${tData(user.name)}` : ''}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium max-w-xl">
            {t('dashboardOverview')}
          </p>
        </div>
{/* 
        <div className="shrink-0 z-10">
          <img
            src={addisLogo}
            alt="Addis Ababa Revenues Bureau"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gold-500 bg-white object-contain p-1 shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div> */}

        {/* Decorative subtle background accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 shadow-md border ${stat.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`p-3 rounded-xl ${stat.badgeBg} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                Live
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;