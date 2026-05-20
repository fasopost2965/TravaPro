/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0038af",
        "primary-container": "#1B4FD8",
        "primary-fixed": "#dce1ff",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#001550",
        surface: "#ffffff",
        "surface-bg": "#f7f9fb",
        "on-surface": "#191c1e",
        "on-surface-variant": "#434655",
        "outline-variant": "#c4c5d7",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
}
