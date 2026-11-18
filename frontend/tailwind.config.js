/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royals: {
          pink: '#EA1A85',
          'pink-dark': '#C2136D',
          'pink-light': '#FF4DA6',
          blue: '#254AA5',
          navy: '#001D4A',
          midnight: '#001233',
          dark: '#000C1F',
          gold: '#FFD700',
          'gold-dark': '#D4AF37',
          card: '#001B44',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'royals-glow': '0 0 50px rgba(234, 26, 133, 0.45)',
        'gold-glow': '0 0 45px rgba(255, 215, 0, 0.40)',
        'blue-glow': '0 0 45px rgba(37, 74, 165, 0.40)',
      }
    },
  },
  plugins: [],
}
