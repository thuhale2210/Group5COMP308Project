/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#415a77", // Deep navy blue for backgrounds
        secondary: "#F5F7FA", // Light neutral background
        accent: "#00A3FF", // Neon blue for highlights
        cardBg: "rgba(255, 255, 255, 0.1)", // Transparent glassmorphism effect
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"], // Clean, modern typography
      },
      borderRadius: {
        large: "1.5rem", // Consistent rounded corners for a modern look
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.1)", // Soft shadow for neumorphism
      },
      backdropBlur: {
        md: "8px", // Glassmorphism blur effect
      },
    },
  },
  plugins: [],
};
