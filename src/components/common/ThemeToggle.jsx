import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === 'light' ? t('switchToDark') : t('switchToLight')}
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#ffffff',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(5px)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun style={{ color: '#fbbf24' }} />}
    </button>
  );
};

export default ThemeToggle;