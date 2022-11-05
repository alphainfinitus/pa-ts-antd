/* eslint-disable */
/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, // to generate utilities as !important
  content: [
    // add the paths to all of your template files
    "./src/*.{jsx,tsx}",
    "./src/**/*.{jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // add new font family
        montserrat: ["Poppins", "Segoe UI"]
      },
      colors: {
        navBlue: "#90A0B7",
        sidebarBlue: "#334D6E",
        blue_primary: "#4D9999",
        blue_secondary: "#EBF0F5",
        green_primary: "#4DD18F",
        green_secondary: "#399969",
        grey_app_background: "#EAEEF0",
        grey_border: "#DDE4ED",
        grey_light: "#EBF0F5",
        grey_primary: "#777B80",
        grey_secondary: "#A6ACB3",
        icon_grey: "#C2CFE0",
        nav_black: "#1E1E28",
        pink_primary: "#E5007A",
        pink_primary_transparent: "rgba(229, 0, 122, 0.5)",
        pink_secondary: "#C40061",
        pink_light: "#EA729D",
        red_light: "#FFF1F0",
        red_primary: "#FF5A47",
        red_secondary: "#D94C3D",
        aye_green: "#2ED47A",
        nay_red: "#FF3C5F",
        comment_bg: "#F9FAFB",
      }
    }
  },
  plugins: []
};
