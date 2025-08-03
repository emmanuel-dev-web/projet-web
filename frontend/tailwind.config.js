/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Analyse tous les fichiers JSX dans src
  ],
  theme: {
    extend: {}, // Pour personnaliser les styles plus tard
  },
  plugins: [], // Extensions optionnelles
};