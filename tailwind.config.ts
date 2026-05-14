import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171412",
        cream: "#fffaf2",
        palm: "#0f766e",
        flame: "#ea580c"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 20, 18, 0.1)"
      }
    }
  },
  plugins: []
};

export default config;
