import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#D4003C",
          secondary: "#012169",
          accent: "#FFB81C",
          flagBlue: "#012169",
          flagRed: "#C8102E",
          flagWhite: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F5F5",
          dark: "#0B0C0C",
        },
        muted: {
          foreground: "#5B6477",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "1.25rem",
      },
      boxShadow: {
        card: "0 16px 50px rgba(1, 33, 105, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
