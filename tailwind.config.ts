import daisyui from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        matcot: {
          "0%, 100%": { transform: "translateY(25px)" },
          "50%": { transform: "translateY(-25px)" },
        },
      },
      animation: {
        matcot: "matcot 5s ease-in-out infinite",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light", "dark",
      {
        "cybergeek-dark": {
          primary: "#22c55e",
          "primary-content": "#f0fdf4",
          secondary: "#1d00ff",
          "secondary-content": "#c9dbff",
          accent: "#ff0000",
          "accent-content": "#160000",
          neutral: "#111827",
          "neutral-content": "#d1cece",
          "base-100": "#0a0a0a",
          "base-200": "#171717",
          "base-300": "#1a1221",
          "base-content": "#fafaf9",
          info: "#1d4ed8",
          "info-content": "#eff6ff",
          success: "#22c55e",
          "success-content": "#f0fdf4",
          warning: "#facc15",
          "warning-content": "#fffbeb",
          error: "#ef4444",
          "error-content": "#fef2f2",
        },
        "cybergeek-light": {
          primary: "#22c55e",
          "primary-content": "#f0fdf4",
          secondary: "#1d00ff",
          "secondary-content": "#c9dbff",
          accent: "#ff0000",
          "accent-content": "#160000",
          neutral: "#111827",
          "neutral-content": "#d1cece",
          "base-100": "#0a0a0a",
          "base-200": "#171717",
          "base-300": "#1a1221",
          "base-content": "#fafaf9",
          info: "#1d4ed8",
          "info-content": "#eff6ff",
          success: "#22c55e",
          "success-content": "#f0fdf4",
          warning: "#facc15",
          "warning-content": "#fffbeb",
          error: "#ef4444",
          "error-content": "#fef2f2",
        },
      },
    ],
  },
};
export default config;
