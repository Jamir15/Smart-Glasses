module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        air: {
          good: '#10B981',
          moderate: '#F59E0B',
          bad: '#EF4444',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { 'text-shadow': '0 0 10px rgba(16, 185, 129, 0.5)' },
          '50%': { 'text-shadow': '0 0 20px rgba(16, 185, 129, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
