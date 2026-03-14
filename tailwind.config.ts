import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: 'body',
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
        },
        secondary: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
      },
    },
  },
  corePlugins: {
    // Remove Tailwind CSS's preflight style so it can use the MUI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [],
};
export default config;
