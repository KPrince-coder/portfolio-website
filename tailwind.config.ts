import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'space': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          glow: "hsl(var(--card-glow))",
        },
      },
      backgroundImage: {
        'gradient-neural': 'var(--gradient-neural)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-accent': 'var(--gradient-accent)',
        'data-flow': 'var(--gradient-data-flow)',
      },
      boxShadow: {
        'neural': 'var(--shadow-neural)',
        'card-neural': 'var(--shadow-card)',
        'glow-primary': 'var(--glow-primary)',
        'glow-secondary': 'var(--glow-secondary)',
        'glow-accent': 'var(--glow-accent)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            "box-shadow": "var(--glow-secondary)",
            "transform": "scale(1)"
          },
          "50%": { 
            "box-shadow": "var(--glow-secondary), 0 0 40px hsl(var(--secondary-glow))",
            "transform": "scale(1.02)"
          }
        },
        "data-flow": {
          "0%": { "transform": "translateX(-100%)", "opacity": "0" },
          "20%": { "opacity": "1" },
          "80%": { "opacity": "1" },
          "100%": { "transform": "translateX(100vw)", "opacity": "0" }
        },
        "float": {
          "0%, 100%": { "transform": "translateY(0px)" },
          "50%": { "transform": "translateY(-10px)" }
        },
        "neural-connect": {
          "0%": { "stroke-dashoffset": "100", "opacity": "0.3" },
          "50%": { "opacity": "1" },
          "100%": { "stroke-dashoffset": "0", "opacity": "0.7" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "data-flow": "data-flow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "neural-connect": "neural-connect 2s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
