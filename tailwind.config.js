/* eslint-disable */
/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // to generate utilities as !important
  content: [ // add the paths to all of your template files
    './src/*.{jsx,tsx}',
    './src/**/*.{jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: { // add new font family
        montserrat: ['Roboto', 'Segoe UI']
      },
      colors: {
        navLinkBlue: '#90A0B7'
      }
    },
  },
  plugins: [],
}
