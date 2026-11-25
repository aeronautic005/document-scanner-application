/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5f5',
          100: '#dce7e8',
          200: '#bcd2d4',
          300: '#8fb2b6',
          400: '#5d8b90',
          500: '#3c6e74',
          600: '#27555b',
          700: '#164348',
          800: '#0b383d',
          900: '#033236',
          950: '#022225',
        },
        surface: {
          50: '#ffffff',
          100: '#f6f6f6',
          200: '#ebebed',
          300: '#dcdce0',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1f1f23',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        brand: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(3, 50, 54, 0.06)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 14px rgba(0, 0, 0, 0.03)',
        'pill-nav': '0 10px 30px -5px rgba(3, 50, 54, 0.25)',
      },
    },
  },
  plugins: [],
};
