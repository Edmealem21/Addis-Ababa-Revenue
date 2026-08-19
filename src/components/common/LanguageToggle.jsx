import React from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      title={language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '20px',
        padding: '6px 14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '700',
        color: '#ffffff',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(5px)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
    >
      <FaGlobe style={{ fontSize: '15px' }} />
      <span>{language === 'am' ? '🇬🇧 EN' : '🇪🇹 AM'}</span>
    </button>
  );
};

export default LanguageToggle;
