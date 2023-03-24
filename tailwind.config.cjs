/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};

module.exports = config;
