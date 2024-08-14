// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Merriweather', 'sans-serif'],
        metrophobic: ['Metrophobic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
