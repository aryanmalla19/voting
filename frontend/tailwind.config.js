/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"], // Updated to scan .js and .jsx files
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8b5cf6", // Violet-500
          hover: "#7c3aed", // Violet-600
          light: "#a78bfa", // Violet-400
        },
        secondary: "#6366f1", // Indigo-500
        accent: "#ec4899", // Pink-500
        neutral: {
          light: "#f3f4f6", // Gray-100
          DEFAULT: "#6b7280", // Gray-500
          dark: "#1f2937", // Gray-800
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
