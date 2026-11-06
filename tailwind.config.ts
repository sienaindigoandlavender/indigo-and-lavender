import type { Config } from "tailwindcss";

/**
 * SLOW WORLD DESIGN SYSTEM - Tailwind Configuration
 * 
 * Shared by: Riad di Siena, Slow Morocco, Slow Namibia,
 *            Slow Türkiye, Slow Tunisia, Slow Mauritius
 * 
 * Last updated: December 24, 2025
 */

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ═══════════════════════════════════════════════════════════
         COLORS
         All colors use CSS variables for consistency
         ═══════════════════════════════════════════════════════════ */
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        sand: "hsl(var(--sand) / <alpha-value>)",
        // The house (Oct 2026): lime plaster by day, candlelight by night.
        limewash: "#F8F4EE",
        tadelakt: "#EADFD1",
        bejmat: "#9A5236",
        door: "#E8D493",
        straw: "#F1E2AE", // pale door yellow: a light band between lime and plaster
        night: "#1D1814",
        candle: "#EDCB8C",
        ink: "#2a2520",
        "footer-background": "hsl(var(--footer-background) / <alpha-value>)",
        "footer-foreground": "hsl(var(--footer-foreground) / <alpha-value>)",
      },

      /* ═══════════════════════════════════════════════════════════
         TYPOGRAPHY
         ═══════════════════════════════════════════════════════════ */
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },

      /* ═══════════════════════════════════════════════════════════
         SPACING
         ═══════════════════════════════════════════════════════════ */
      spacing: {
        section: "clamp(80px, 12vh, 120px)",
        "section-sm": "clamp(48px, 8vh, 80px)",
      },

      /* ═══════════════════════════════════════════════════════════
         MAX WIDTHS
         ═══════════════════════════════════════════════════════════ */
      maxWidth: {
        content: "680px",
        wide: "1200px",
      },

      /* ═══════════════════════════════════════════════════════════
         BORDER RADIUS
         ═══════════════════════════════════════════════════════════ */
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
    },
  },
  plugins: [],
};

export default config;
