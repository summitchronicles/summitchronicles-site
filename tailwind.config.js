/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alpineBlue: "var(--color-alpine-blue)", // PRD Alpine Blue
        summitGold: "var(--color-summit-gold)", // PRD Summit Gold
        charcoal: "var(--color-charcoal)",      // PRD Charcoal
        lightGray: "var(--color-light-gray)",   // PRD Light Gray
        snowWhite: "var(--color-snow-white)",   // PRD Snow White
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};