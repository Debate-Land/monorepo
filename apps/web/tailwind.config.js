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
          300: 'rgb(37, 61, 119)',
        },
        coal: 'rgb(15, 13, 14)',
      },
      boxShadow: {
        halo: '0 0 30px #a855f7'
      },
      backgroundImage: {
        'beams-light': "url('/assets/img/beams-light.jpg')",
        'beams-dark': "url('/assets/img/beams-dark.jpg')",
        grid: "url('/assets/img/grid.svg')"
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
