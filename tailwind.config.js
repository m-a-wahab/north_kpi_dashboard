/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005353',
        'primary-dark': '#003d3d',
        'primary-light': '#006b6b',
      },
    },
  },
  plugins: [],
}