/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', '../../packages/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Poppins', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
    plugins: [],
    extend: {
      colors: {
        luka: {
          100: 'rgb(0, 84, 184)',
          200: 'rgb(0, 68, 147)',
        },
        coal: 'rgb(15, 13, 14)',
      },
      boxShadow: {
        halo: '0 0 30px #a855f7'
      },
      backgroundImage: {
        beams: "url('/assets/img/beams.png')"
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
