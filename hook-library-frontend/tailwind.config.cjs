/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0f',
        'dark-secondary': '#1a0a2e',
        'dark-tertiary': '#2a1a3e',
        'neon-pink': '#ff4b8b',
        'neon-purple': '#8b5cf6',
      },
    },
  },
  plugins: [],
};
