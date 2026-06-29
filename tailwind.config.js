/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Financial Dashboard colors
        profit: '#22C55E',
        loss: '#EF4444',
        trust: '#003366',
        primary: '#0F172A',
        background: '#F3F4F6',
        navy: {
          50: '#E6EEF5',
          100: '#B3CDE0',
          200: '#80ABCB',
          300: '#4D89B6',
          400: '#1A67A1',
          500: '#003366',
          600: '#002952',
          700: '#001F3D',
          800: '#001429',
          900: '#000A14',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'extrabold': '800',
        'bold': '700',
        'semibold': '600',
      },
    },
  },
  plugins: [],
}
