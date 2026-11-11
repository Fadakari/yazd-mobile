/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    container: {
      center: true,
      padding: "0.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1236px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Peyda", "var(--font-peyda)", "dana", "iranyekan", "sans-serif"],
        peyda: ["Peyda", "var(--font-peyda)", "sans-serif"],
        dana: ["dana", "var(--font-dana)", "sans-serif"],
        iranyekan: ["iranyekan", "var(--font-iranyekan)", "sans-serif"],
      },
      keyframes: {
        "logo-spin": {
          "0%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(180deg)" },
          "40%": { transform: "rotate(250deg)" },
          "60%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "logo-spin": "logo-spin 5s ease-in-out infinite",
      },
    },
  },
};
