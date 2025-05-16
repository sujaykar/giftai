/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-content)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-content)",
        },
        destructive: {
          DEFAULT: "var(--error)",
          foreground: "var(--primary-content)",
        },
        muted: {
          DEFAULT: "var(--base-300)",
          foreground: "var(--base-content)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-content)",
        },
        popover: {
          DEFAULT: "var(--base-100)",
          foreground: "var(--base-content)",
        },
        card: {
          DEFAULT: "var(--base-100)",
          foreground: "var(--base-content)",
        },
      },
      borderRadius: {
        lg: "var(--rounded-btn, 0.5rem)",
        md: "calc(var(--rounded-btn, 0.5rem) - 0.2rem)",
        sm: "calc(var(--rounded-btn, 0.5rem) - 0.3rem)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};