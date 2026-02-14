import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'cream-puff': '#F9F5F0',
        'warm-cocoa': '#5D4037',
        'dusty-rose': '#D4A59A',
        'sage-green': '#8FBC8F',
      },
    },
  },
  plugins: [],
};
export default config;
