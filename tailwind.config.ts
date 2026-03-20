import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          elevated: "hsl(var(--surface-elevated) / <alpha-value>)"
        },
        accent: {
          from: "hsl(var(--accent-from) / <alpha-value>)",
          to: "hsl(var(--accent-to) / <alpha-value>)"
        },
        vote: {
          up: "hsl(var(--vote-up) / <alpha-value>)",
          down: "hsl(var(--vote-down) / <alpha-value>)"
        }
      },
      boxShadow: {
        glass: "0 12px 40px -16px rgba(17, 24, 39, 0.4)",
        soft: "0 18px 50px -24px rgba(15, 23, 42, 0.45)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite"
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
