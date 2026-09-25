/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(40px) scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fade-slide-up": "fade-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.6s ease-out forwards",
        progress: "progress linear forwards",
      },
    },
  },
  plugins: [],
};