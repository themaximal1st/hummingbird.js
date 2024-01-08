/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js}",
    "./views/**/*.{html,ejs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    import("@tailwindcss/forms"),
    import("@tailwindcss/typography"),
  ],
}

