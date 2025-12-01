/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ penting: jangan ikut prefers-color-scheme (dark mode Chrome)
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
