/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buypal: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0066FF',
          600: '#0052D4',
          700: '#003eb3',
          purple: '#6B57FF',
          dark: '#0F172A',
          muted: '#64748B',
          border: '#E8EDF5',
          card: '#FFFFFF',
          bg: '#F6F8FC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
        'float': '0 12px 30px -4px rgba(0, 102, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
