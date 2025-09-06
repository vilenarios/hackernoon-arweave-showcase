/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hn-green': '#00ff00',
        'hn-dark': '#0f1419',
        'hn-gray': '#1a1f2e',
      },
      fontFamily: {
        'mono': ['IBM Plex Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}