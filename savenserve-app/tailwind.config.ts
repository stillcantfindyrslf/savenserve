import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        // foreground: "var(--foreground)",
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "light-secondary-color": "var(--light-secondary-color)",
        "color-text": "var(--text-color)",
        "light-white-color": "var(--light-white)",
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;