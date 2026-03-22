/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // FrameX Brand Palette — per Brand Bible v1.0 December 2024
        brand: {
          // Primary structural charcoal (was #0F0F0F → now #2C2C2C per brand bible)
          black:   '#2C2C2C',
          // Off-white for breathing space
          white:   '#F9F8F6',
          // Pure white for text on dark
          pure:    '#FFFFFF',
          // FrameX Orange — primary accent, use sparingly (CTA, X mark, accents)
          accent:  '#FF6B35',
          // Secondary concrete gray
          concrete: '#8C8C8C',
          // Steel gradient palette
          gray: {
            50:  '#F5F4F2',
            100: '#EBEBEB',
            200: '#D4D4D4',
            300: '#B8B8B8',
            400: '#8C8C8C',
            500: '#6B6B6B',
            600: '#4A4A4A',
            700: '#3A3A3A',
            800: '#2C2C2C',
            900: '#1A1A1A',
            950: '#111111',
          },
        },
      },
      fontFamily: {
        // Primary: Montserrat for headings (per brand bible)
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        // Secondary: Inter for body (clean, modern)
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-lg':  ['3rem',     { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
        'display-sm':  ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'label':       ['0.6875rem',{ lineHeight: '1',    letterSpacing: '0.12em' }],
      },
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '38':  '9.5rem',
        '128': '32rem',
      },
      maxWidth: {
        'container':  '1200px',
        'prose-wide': '75ch',
      },
      backgroundImage: {
        // Core brand gradients — charcoal based
        'gradient-hero':    'linear-gradient(160deg, #1A1A1A 0%, #2C2C2C 40%, #3A3A3A 70%, #4A4A4A 100%)',
        'gradient-section': 'linear-gradient(180deg, #2C2C2C 0%, #1A1A1A 100%)',
        'gradient-light':   'linear-gradient(180deg, #F5F4F2 0%, #EBEBEB 100%)',
        'gradient-mid':     'linear-gradient(160deg, #3A3A3A 0%, #2C2C2C 100%)',
        // Subtle texture overlay
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':   'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in':   'fadeIn 0.5s ease-out both',
        'fade-down': 'fadeDown 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'line-grow': 'lineGrow 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-up':  'slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lineGrow: {
          '0%':   { width: '0' },
          '100%': { width: '100%' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'smooth':  'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring':  'cubic-bezier(0.22, 1, 0.36, 1)',
        'elegant': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        'card-lg': '0 4px 24px rgba(0,0,0,0.08), 0 12px 48px rgba(0,0,0,0.06)',
        'inset-t': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};
