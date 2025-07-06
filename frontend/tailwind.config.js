/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-600': '#2A4B8D',
        'primary-500': '#2A4B8D',
        'primary-400': '#3B5BA9',
        'accent-500': '#FBC13A',
        'accent-400': '#FFD86B',
        'secondary-500': '#FF7CA3',
        'secondary-400': '#FFB3C6',
        'success-500': '#4EE1A0',
        'success-400': '#7FFFD4',
        'karaoke-bg': '#fff',
        'karaoke-surface': '#fff',
        'karaoke-card': '#fff',
        'karaoke-border': '#E5E7EB',
        'karaoke-text': '#222228',
        'karaoke-muted': '#A0AEC0',
        'heading': '#2A4B8D',
        'highlight': '#FBC13A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'lyrics-highlight': 'lyricsHighlight 0.3s ease-in-out',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        lyricsHighlight: {
          '0%': { 
            backgroundColor: 'transparent',
            color: 'rgb(226 232 240)'
          },
          '50%': { 
            backgroundColor: 'rgb(239 68 68)',
            color: 'white'
          },
          '100%': { 
            backgroundColor: 'transparent',
            color: 'rgb(226 232 240)'
          },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'karaoke-bg': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        'karaoke-card': 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'karaoke': '0 4px 24px 0 rgba(42, 75, 141, 0.10)',
        'karaoke-lg': '0 8px 32px 0 rgba(42, 75, 141, 0.15)',
        'karaoke-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 