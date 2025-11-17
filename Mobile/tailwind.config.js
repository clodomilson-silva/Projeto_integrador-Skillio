/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#f59e0b',
        background: '#0a0a0a',
        card: '#1a1a1a',
        muted: '#262626',
        accent: '#22d3ee',
        destructive: '#ef4444',
        border: '#262626',
        input: '#262626',
        ring: '#3b82f6',
        warning: '#f59e0b',
        success: '#22c55e',
      },
      borderRadius: {
        lg: 12,
        md: 8,
        sm: 4,
      },
    },
  },
  plugins: [],
};
