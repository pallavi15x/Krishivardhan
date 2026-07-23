/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#FBF9F5',
          100: '#F5F2EB',
          200: '#E6E1D5',
        },
        green: {
          800: '#265C41',
          900: '#1F4D36',
          950: '#0F291C',
        },
        amber: {
          400: '#F0C968',
          500: '#C6952E',
          600: '#A37920',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
