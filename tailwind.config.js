// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pinkPrimary: '#EEC0DD',
        bluePrimary: '#123962',
      },
      fontFamily: {
        sans: ['Merriweather', 'sans-serif'],
        metrophobic: ['Metrophobic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
