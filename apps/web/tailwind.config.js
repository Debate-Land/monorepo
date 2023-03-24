module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Poppins', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
    plugins: [require('tailwindcss-animate')],
    extend: {
      colors: {
        luka: {
          100: 'rgb(0, 84, 184)',
          200: 'rgb(0, 68, 147)',
        },
      },
    },
  },
}
