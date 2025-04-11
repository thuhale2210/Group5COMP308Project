/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /bg-(blue|purple|rose|yellow|white)-(500|600)\/(20|30)/,
    },
    {
      pattern: /text-(zinc|yellow|rose|white|purple|blue|emerald|cyan)-(300|400|500)/,
    },
    {
      pattern: /from-(indigo|blue)-(400|500|600)/,
    },
    {
      pattern: /to-(purple|fuchsia)-(400|500|600)/,
    },
    {
      pattern: /(rounded|border|shadow|backdrop-blur)-[a-z0-9]+/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: "#415a77",
        secondary: "#F5F7FA",
        accent: "#00A3FF",
        cardBg: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      borderRadius: {
        large: "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        md: "8px",
      },
    },
  },
  plugins: [],
};