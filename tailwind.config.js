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
        navy: {
          950: '#070D18',
          900: '#0B1528',
          850: '#0E1B33',
          800: '#142343',
          700: '#1C315E',
          600: '#26427D',
        },
        brand: {
          blue: '#1E62D0',
          electric: '#0066FF',
          sky: '#38BDF8',
          teal: '#0D9488',
          cyan: '#06B6D4',
          orange: '#FF7A00',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
