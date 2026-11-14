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
          DEFAULT: '#087F78',
          hover: '#066560',
          light: '#E6F4F3',
          dark: '#044C47',
          50: '#F0F9F8',
          100: '#D7F0EE',
          200: '#B0E2DE',
          500: '#087F78',
          600: '#066560',
          700: '#05514D',
          800: '#04423F'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          hover: '#F1F5F9',
          border: '#E2E8F0',
          dark: '#0F172A'
        },
        main: '#172B3A',
        secondary: '#64748B',
        healthy: {
          DEFAULT: '#16A34A',
          bg: '#DCFCE7',
          border: '#86EFAC'
        },
        warning: {
          DEFAULT: '#EAA329',
          bg: '#FEF3C7',
          border: '#FDE68A'
        },
        critical: {
          DEFAULT: '#DC2626',
          bg: '#FEE2E2',
          border: '#FCA5A5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 6px 0 rgba(23, 43, 58, 0.04), 0 1px 3px 0 rgba(23, 43, 58, 0.02)',
        'card-hover': '0 8px 16px -2px rgba(23, 43, 58, 0.08), 0 3px 6px -2px rgba(23, 43, 58, 0.04)',
      }
    },
  },
  plugins: [],
}
