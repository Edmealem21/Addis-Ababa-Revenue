import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-800 py-3.5 px-6 border-t border-slate-200 dark:border-slate-700 text-center text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-auto transition-colors">
      &copy; {currentYear}{' '}
      <strong className="text-navy-800 dark:text-gold-400 font-bold">
        {t('cityRevenueBureauFooter')}
      </strong>
    </footer>
  );
};

export default Footer;