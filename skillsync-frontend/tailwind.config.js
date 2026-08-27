/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#ec4899', dark: '#be185d', light: '#f9a8d4' },
        secondary: { DEFAULT: '#f43f5e' },
      },
      fontFamily: { sans: ['Inter', 'Roboto', 'sans-serif'] },
    },
  },
  plugins: [],
};
