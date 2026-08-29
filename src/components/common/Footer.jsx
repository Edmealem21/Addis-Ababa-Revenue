import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      &copy; {currentYear} 
      <strong> የአዲስ አበባ ከተማ አስተዳደር ገቢወቸ </strong>
    </footer>
  );
};

export default Footer;