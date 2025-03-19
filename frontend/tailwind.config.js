/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gradient: {
          primary: "#3b82f6", // Blue
          secondary: "#8b5cf6", // Purple
          tertiary: "#ec4899", // Pink
        },
      },
      gradientColorStops: {
        "gradient-primary": "#3b82f6",
        "gradient-secondary": "#8b5cf6",
        "gradient-tertiary": "#ec4899",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
