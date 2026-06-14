import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff3f2',
          100: '#ffe4e1',
          200: '#ffccc7',
          300: '#ffa89e',
          400: '#ff7766',
          500: '#ff4f38', // Brand Orange-Red
          600: '#ed2f18',
          700: '#c7200c',
          800: '#a51c0e',
          900: '#891b10',
          gradientStart: '#ff4f38',
          gradientEnd: '#ff3366'
        },
        accent: {
          yellow: '#f5b82e',
          mint: '#10b981',
          slateDark: '#0f0f11',
          cardDark: '#16161a',
          borderDark: '#232329'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 10s linear infinite',
      }
    },
  },
  plugins: [],
};

export default config;
