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
        ink: {
          DEFAULT: '#1D1D1F',
          muted: '#6E6E73',
          dark: '#F5F5F7',
          'dark-muted': '#86868B',
        },
        hairline: {
          light: '#D2D2D7',
          dark: '#2A2A2C',
        },
        surface: {
          1: '#FFFFFF',
          '1-dark': '#000000',
          2: '#F5F5F7',
          '2-dark': '#101010',
          card: '#FFFFFF',
          'card-dark': '#121214',
        },
        action: {
          DEFAULT: '#0071E3',
          hover: '#0077ED',
          dark: '#2997FF',
          'dark-hover': '#40A9FF',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Display',
          'Inter',
          'Helvetica Neue',
          'sans-serif'
        ],
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
