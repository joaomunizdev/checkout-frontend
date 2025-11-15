/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./checkout/src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#3B82F6",
        secondary: "#1D4ED8",
        accent: "#60A5FA",
      },
    },
  },
  plugins: [],
};
