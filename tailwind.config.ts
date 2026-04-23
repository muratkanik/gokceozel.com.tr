import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--dark)",
        foreground: "var(--paper)",
        gold: {
          DEFAULT: "var(--gold)",
          soft: "var(--gold-soft)",
        },
        ink: "var(--ink)",
        paper: "var(--paper)",
        stone: "var(--stone)",
        muted: "var(--muted)",
        dark: "var(--dark)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
