// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        heading2: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#34394f',
        surface: '#1E293B',
        primary: '#D9FF00',
        secondary: '#A7C0E2',
        accent: '#B07CBB',
        textPrimary: '#F8FAFC',
        danger: '#FB7185',
      },
    },
  },
  plugins: [],
}
