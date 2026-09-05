import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm text-white rounded-full px-3.5 py-1.5 cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-all duration-200 outline-none"
      onClick={toggleLanguage}
      title={language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
    >
      <FaGlobe className="text-sm" />
      <span>{language === 'am' ? '🇬🇧 EN' : '🇪🇹 AM'}</span>
    </button>
  );
};

export default LanguageToggle;
