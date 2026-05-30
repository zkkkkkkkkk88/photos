import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: '#F4C2C2',
        'sakura-light': '#FFF5F5',
        matcha: '#C4D7B2',
        'matcha-light': '#F0F7EC',
        ai: '#A3C4D4',
        'ai-light': '#EEF4F7',
        washi: '#FEF9F3',
        warm: '#E8DDD0',
        ink: '#8B7D6D',
        'ink-light': '#B0A090',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
