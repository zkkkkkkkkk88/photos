import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-light': '#E8D48B',
        'gold-dark': '#B8960F',
        ink: '#FFFFFF',
        'ink-light': 'rgba(255, 255, 255, 0.65)',
        'ink-muted': 'rgba(255, 255, 255, 0.35)',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212, 175, 55, 0.2)',
        'gold-lg': '0 0 60px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
