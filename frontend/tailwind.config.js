/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563eb',
          indigo: '#4f46e5',
          purple: '#7c3aed',
        },
        neutral: {
          black: '#0f0f0f',
          dark: '#1a1a1a',
          gray: '#2a2a2a',
          lightGray: '#404040',
          silver: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}