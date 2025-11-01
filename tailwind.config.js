
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,services,data}/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brandGreen: {
          50: '#f0fdf4',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#198648',
          700: '#146b3a',
          800: '#166534',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
