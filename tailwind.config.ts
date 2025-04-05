import type { Config } from "tailwindcss";
import Something from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        sans: ["Inter", "sans-serif"],
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        action: {
          light: "#0099cc",    // Slightly darker version for light mode
          dark: "#00b3e6",     // Brighter version for dark mode
        },
        graph: "#ff33ff",     // Graphs
        icon: "#00ccff",      // Icons
        state: {
          info: {
            light: "#0EA5E9",    // Ocean Blue for light mode
            dark: "#33C3F0",     // Sky Blue for dark mode
          },
          warning: {
            light: "#F97316",    // Bright Orange for light mode
            dark: "#FB923C",     // Lighter Orange for dark mode
          },
          danger: {
            light: "#DC2626",    // Deep Red for light mode
            dark: "#EF4444",     // Bright Red for dark mode
          },
          success: {
            light: "#059669",    // Deep Green for light mode
            dark: "#10B981",     // Bright Green for dark mode
          }
        },
        btn: {
          'purple-blue': 'linear-gradient(135deg, #9b87f5, #0EA5E9)',
          'cyan-blue': 'linear-gradient(135deg, #33C3F0, #0FA0CE)',
          'green-blue': 'linear-gradient(135deg, #10B981, #0EA5E9)',
          'purple-pink': 'linear-gradient(135deg, #9b87f5, #D946EF)',
          'pink-orange': 'linear-gradient(135deg, #D946EF, #F97316)',
          'teal-lime': 'linear-gradient(135deg, #14B8A6, #84CC16)',
          'red-yellow': 'linear-gradient(135deg, #ea384c, #FCD34D)',
          'default': '#3B82F6',
          'alternative': '#1F2937',
          'dark': '#111827',
          'light': '#F3F4F6',
          'green': '#059669',
          'red': '#DC2626',
          'yellow': '#D97706',
          'purple': '#7C3AED',
        },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [Something],
} satisfies Config;