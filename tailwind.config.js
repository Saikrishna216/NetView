/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-black': '#141414',
        'netflix-dark': '#000000',
        'netflix-gray': '#808080',
        'netflix-light-gray': '#e5e5e5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      height: {
        '128': '32rem',
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.9) 100%)",
      },
    },
  },
  plugins: [],
};