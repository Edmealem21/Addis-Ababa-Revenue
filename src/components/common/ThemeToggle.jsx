import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button 
      className="w-9 h-9 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm rounded-full cursor-pointer flex items-center justify-center text-sm text-white transition-all duration-200 outline-none"
      onClick={toggleTheme}
      title={theme === 'light' ? t('switchToDark') : t('switchToLight')}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun className="text-amber-400" />}
    </button>
  );
};

export default ThemeToggle;