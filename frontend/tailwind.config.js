/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          black: '#000000',
          dark: '#080808',
          surface: '#0d0d0d',
          card: '#121212',
          cardHover: '#181818',
          border: '#222222',
          borderLight: '#303030',
          blue: '#0052FF',
          blueHover: '#0047E0',
          blueMuted: 'rgba(0, 82, 255, 0.12)',
          muted: '#888888',
          subtext: '#a3a3a3',
          text: '#f4f4f5',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0052FF',
          600: '#0047E0',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0a1020',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#121212',
          900: '#0a0a0a',
          950: '#000000',
          card: '#121212',
          cardHover: '#181818',
          border: '#222222',
        }
      }
    },
  },
  plugins: [],
}
