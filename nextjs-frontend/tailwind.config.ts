import type { Config } from "tailwindcss"


const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
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
      colors: {
        lightPrimary: "#F4F7FE",
        blueSecondary: "#4318FF",
        brandLinear: "#868CFF",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
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
        light: {
          green: {
            100: {
              accent: "#ccff90"
            },
            200: {
              accent: "#b2ff59"
            },
            400: {
              accent: "#76ff03"
            },
            700: {
              accent: "#64dd17"
            }
          },
        },
        green: {
          100: {
            DEFAULT: "#c8e6c9",
            accent: "#b9f6ca"
          },
          200: {
            DEFAULT: "#a5d6a7",
            accent: "#69f0ae"
          },
          300: "#81c784",
          400: {
            DEFAULT: "#66bb6a",
            accent: "#00e676"
          },
          500: "#4caf50",
          600: "#43a047",
          700: {
            DEFAULT: "#388e3c",
            accent: "#00c853"
          },
          800: "#2e7d32"
        },
        red: {
          100: {
            DEFAULT: "#ffcdd2",
            accent: "#ff8a80"
          },
          200: {
            DEFAULT: "#ef9a9a",
            accent: "#ff5252"
          },
          300: "#e57373",
          400: {
            DEFAULT: "#ef5350",
            accent: "#ff1744"
          },
          500: "#f44336",
          600: "#e53935",
          700: {
            DEFAULT: "#d32f2f",
            accent: "#d50000"
          },
          800: "#c62828"
        },
        brand: {
          50: "#E9E3FF",
          100: "#C0B8FE",
          200: "#A195FD",
          300: "#8171FC",
          400: "#7551FF",
          500: "#422AFB",
          600: "#3311DB",
          700: "#2111A5",
          800: "#190793",
          900: "#11047A",
        },
        navy: {
          50: "#d0dcfb",
          100: "#aac0fe",
          200: "#a3b9f8",
          300: "#728fea",
          400: "#3652ba",
          500: "#1b3bbb",
          600: "#24388a",
          700: "#1B254B",
          800: "#111c44",
          900: "#0b1437",
        },
        gray: {
          50: "#f8f9fa",
          100: "#edf2f7",
          200: "#e9ecef",
          300: "#cbd5e0",
          400: "#a0aec0",
          500: "#adb5bd",
          600: "#a3aed0",
          700: "#707eae",
          800: "#252f40",
          900: "#1b2559",
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2152ff",
          700: "#1d4ed8",
          800: "#344e86",
          900: "#00007d",
        },
        shadow: {
          500: "rgba(112, 144, 176, 0.08)",
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
        "pulse": {
          from: { boxShadow: "#2662fa 0 0 0 0" },
          "50%": { opacity: "1" },
          "75%": { boxShadow: "rgba(38, 98, 250, 0.1) 0 0 0 10px" }
        },
        "opacity-load": {
          "50%": {opacity: ".5"}
        },
        "spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulsing": "pulse 1500ms infinite",
        "spinner": "spin 1.5s linear infinite",
        "skeleton-load": "opacity-load 2s cubic-bezier(.4,0,.6,1) infinite"
      },
      backgroundImage: {
        "authBg": `url('/images/authBg.png')`
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config