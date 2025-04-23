/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ["Montserrat-Regular","sans-serif"],
        "Montserrat-semibold": ["Montserrat-SemiBold","sans-serif"],
        "Montserrat-thin": ["Montserrat-Thin","sans-serif"],
      },
      colors:{
        "primary": "#F05050",
        "secondary": "#FE8080",
        "backgroundL": "#FFFAF0",
        "backgroundD": "#282725",
        "boutonsL":"#FFFDF9",
        "boutonsD":"#353432"
      }
    },
  },
  plugins: [],
}
