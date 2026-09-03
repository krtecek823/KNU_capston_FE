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
          DEFAULT: "#00386b",
          container: "#1a4f8a",
          fixed: "#d4e3ff",
        },
        brand: {
          cta: "#F5A623",
        },
        surface: {
          DEFAULT: "#f9f9ff",
          container: "#ededf3",
          low: "#f3f3f9",
          high: "#e8e8ed",
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
