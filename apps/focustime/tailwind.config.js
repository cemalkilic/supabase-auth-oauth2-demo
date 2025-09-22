/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: {
          50: '#fef1ff',
          100: '#fce4ff',
          200: '#f9c8ff',
          300: '#f59dff',
          400: '#ee60ff',
          500: '#e132ff',
          600: '#c916e8',
          700: '#a611c3',
          800: '#870f9d',
          900: '#6f1081',
          950: '#4a015a',
        },
        secondary: {
          50: '#fff8eb',
          100: '#ffecc6',
          200: '#ffd888',
          300: '#ffbe4a',
          400: '#ffa520',
          500: '#f98607',
          600: '#dd6302',
          700: '#b74606',
          800: '#94350c',
          900: '#7a2d0d',
          950: '#461502',
        },
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}