import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        seed: {
          50: "#f1fdf7",
          100: "#dcfcea",
          200: "#b4f6d2",
          300: "#7ee9b2",
          400: "#41d88d",
          500: "#1fb86d",
          600: "#159558",
          700: "#127548",
          800: "#105c3c",
          900: "#0f4c33"
        }
      }
    }
  },
  plugins: []
};

export default config;
