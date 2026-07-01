import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens — mirrored as CSS variables in globals.css (oklch).
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-3": "var(--paper-3)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        charcoal: "var(--charcoal)",
        muted: "var(--muted)",
        "on-dark": "var(--on-dark)",
        "on-dark-muted": "var(--on-dark-muted)",
        maroon: "var(--maroon)",
        "maroon-2": "var(--maroon-2)",
        "maroon-3": "var(--maroon-3)",
        "maroon-ink": "var(--maroon-ink)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        site: "1320px",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22,1,0.36,1)",
        "brand-2": "cubic-bezier(0.65,0.05,0,1)",
      },
    },
  },
  plugins: [],
};

export default config;
