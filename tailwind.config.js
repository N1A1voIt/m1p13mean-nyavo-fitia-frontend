/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB",
        sidebar: "#FFFFFF",
        card: "#F3F4F6",
        'text-primary': "#111827",
        'text-secondary': "#374151",
        'text-muted': "#6B7280",
        accent: "#10A37F",
        'accent-secondary': "#6366F1",
        border: "#D1D5DB",
      },
    },
  },
  plugins: [],
}
