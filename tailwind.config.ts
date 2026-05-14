import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171412",
        cream: "#f7f2ea",
        paper: "#fffdf8",
        palm: "#0f766e",
        flame: "#ea580c",
        berry: "#9f1239"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 20, 18, 0.1)",
        lift: "0 22px 60px rgba(23, 20, 18, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
