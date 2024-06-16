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
          primary: "#e600ff",
          "primary-content": "#130016",
          secondary: "#1d00ff",
          "secondary-content": "#c9dbff",
          accent: "#ff0000",
          "accent-content": "#160000",
          neutral: "#2f2224",
          "neutral-content": "#d1cece",
          "base-100": "#271c30",
          "base-200": "#201728",
          "base-300": "#1a1221",
          "base-content": "#cfccd2",
          info: "#0083d5",
          "info-content": "#000610",
          success: "#8bc600",
          "success-content": "#070e00",
          warning: "#f2c500",
          "warning-content": "#140e00",
          error: "#d6003e",
          "error-content": "#fed6d7",
        },
        "cybergeek-light": {
          primary: "#e600ff",
          "primary-content": "#130016",
          secondary: "#1d00ff",
          "secondary-content": "#c9dbff",
          accent: "#ff0000",
          "accent-content": "#160000",
          neutral: "#2f2224",
          "neutral-content": "#d1cece",
          "base-100": "#271c30",
          "base-200": "#201728",
          "base-300": "#1a1221",
          "base-content": "#cfccd2",
          info: "#0083d5",
          "info-content": "#000610",
          success: "#8bc600",
          "success-content": "#070e00",
          warning: "#f2c500",
          "warning-content": "#140e00",
          error: "#d6003e",
          "error-content": "#fed6d7",
        },
      },
    ],
  },
};
export default config;
