import React, { useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaBuilding, 
  FaUsers, 
  FaUserCog, 
  FaUser, 
  FaChevronDown, 
  FaChevronRight, 
  FaTachometerAlt 
} from 'react-icons/fa';
import addisLogo from '../../assets/images/addis-logo.png';
import { useLanguage } from '../../context/LanguageContext';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ collapsed, menuItems, roleTitle }) => {
  const location = useLocation();
  const { t, tData } = useLanguage();
  const { user } = useContext(AuthContext);
  const [expandedMenus, setExpandedMenus] = useState({ ict: true, employees: true, notifies: true });

  const toggleSubmenu = (key) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActivePath = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const defaultMenuItems = [
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

  const items = menuItems || defaultMenuItems;

  return (
    <aside
      className={`bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 transition-all duration-300 ease-in-out shadow-lg border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 min-h-[calc(100vh-57px)] h-full sticky top-[57px] z-40 ${
        collapsed ? 'w-[70px]' : 'w-[260px]'
      }`}
    >
      {/* Brand / Logo Section */}
      <div
        className={`p-4 border-b border-slate-200 dark:border-slate-700 text-center bg-white dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 ${
          collapsed ? 'py-3 px-2' : ''
        }`}
      >
        <img
          src={addisLogo}
          alt="Addis Ababa Revenues Bureau"
          className={`rounded-full border-2 border-gold-500 bg-white object-contain transition-all duration-300 ${
            collapsed ? 'w-10 h-10' : 'w-14 h-14 mb-2'
          }`}
        />
        {!collapsed && (
          <span className="font-semibold text-xs text-slate-600 dark:text-slate-300 border-2 border-slate-800 dark:border-slate-400 rounded-full px-3 py-1 inline-block mt-1 truncate max-w-full">
            {roleTitle || t('navMenu')}
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="py-3 flex-1 overflow-y-auto bg-white dark:bg-slate-800 space-y-1">
        {items.map((item, index) => {
          if (item.children && item.children.length > 0) {
            const isSubExpanded = expandedMenus[item.key || index] !== false;
            const hasActiveChild = item.children.some((child) => isActivePath(child.path));

            return (
              <div key={item.key || index} className="w-full">
                {/* Parent Dropdown Button */}
                <div
                  className={`flex items-center gap-3.5 py-3 px-5 text-sm font-semibold transition-colors border-l-4 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-navy-800 dark:hover:text-gold-400 cursor-pointer ${
                    hasActiveChild ? 'text-navy-800 dark:text-gold-400 font-bold' : ''
                  } ${collapsed ? 'justify-center px-2' : ''}`}
                  onClick={() => toggleSubmenu(item.key || index)}
                >
                  <span className="text-lg text-slate-500 dark:text-slate-400 min-w-[24px] flex items-center justify-center">
                    {item.icon}
                  </span>
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed &&
                    (isSubExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />)}
                </div>

                {/* Submenu links when expanded */}
                {isSubExpanded && !collapsed && (
                  <div className="bg-slate-50/50 dark:bg-slate-800/50 py-1">
                    {item.children.map((child, childIdx) => {
                      const active = isActivePath(child.path);
                      return (
                        <NavLink
                          key={child.path || childIdx}
                          to={child.path}
                          className={`flex items-center gap-3.5 py-2.5 pl-14 pr-5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                            active
                              ? 'bg-navy-50 dark:bg-slate-700/60 text-navy-800 dark:text-gold-400 font-bold border-l-2 border-gold-500'
                              : 'text-slate-500 dark:text-slate-400 hover:text-navy-800 dark:hover:text-gold-400'
                          }`}
                        >
                          <span className="text-sm">{child.icon}</span>
                          <span className="truncate">{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}

                {/* Collapsed view icons for submenu */}
                {collapsed && (
                  <div className="space-y-1 py-1">
                    {item.children.map((child, childIdx) => {
                      const active = isActivePath(child.path);
                      return (
                        <NavLink
                          key={child.path || childIdx}
                          to={child.path}
                          title={child.label}
                          className={`flex items-center justify-center py-3 px-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            active ? 'text-navy-800 dark:text-gold-400 bg-navy-50 dark:bg-slate-700/60 border-l-4 border-gold-500' : ''
                          }`}
                        >
                          <span className="text-base">{child.icon}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Single Link
          const active = isActivePath(item.path);
          return (
            <NavLink
              key={item.path || index}
              to={item.path}
              className={`flex items-center gap-3.5 py-3 px-5 text-sm font-semibold transition-colors border-l-4 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                active
                  ? 'border-gold-500 bg-navy-50 dark:bg-slate-700/60 text-navy-800 dark:text-gold-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-navy-800 dark:hover:text-gold-400'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="text-lg text-slate-500 dark:text-slate-400 min-w-[24px] flex items-center justify-center">
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="mt-auto p-3.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-navy-800 dark:bg-gold-500 text-white dark:text-navy-950 font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {user?.name ? tData(user.name) : t('admin')}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                {user?.role ? tData(user.role) : (user?.jobCategory ? tData(user.jobCategory) : t('vatExpert'))}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;