/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#e8edf4',
          700: '#2a5a9a',
          800: '#1a3c6e',
          900: '#102a50',
        },
        gold: {
          400: '#f5d06a',
          500: '#e8a735',
          600: '#c48b1a',
        },
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.6s ease-out',
        slideDown: 'slideDown 0.2s ease',
      },
    },
  },
  plugins: [],
}