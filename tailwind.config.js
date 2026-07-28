/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111318',
          soft: '#1A1D24',
          surface: '#20232B',
          line: '#33363F',
        },
        paper: {
          DEFAULT: '#F7F7F8',
          soft: '#FFFFFF',
          surface: '#FFFFFF',
          line: '#E2E2E5',
        },
        // Single accent color used everywhere (was two separate gold/teal
        // accents before). Kept the token names so components didn't all
        // need editing — they now just resolve to the same plain blue.
        gold: {
          DEFAULT: '#2563EB',
          soft: '#3B82F6',
          deep: '#1D4ED8',
        },
        teal: {
          DEFAULT: '#2563EB',
          deep: '#1D4ED8',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest2: '.05em',
      },
    },
  },
  plugins: [],
}
