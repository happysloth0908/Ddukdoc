/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        backgroundswirl: "url('/src/assets/images/mainPage/background.svg')",
      },
      backgroundSize: {
        cover: 'cover',
        contain: 'contain',
      },
      colors: {
        bg: {
          default: '#FCFCFC',
          card: '#F2F2F2',
        },
        primary: {
          100: '#E8F1FF',
          200: '#99C3FF',
          300: '#71A4FF',
          400: '#418CC3',
        },
        secondary: {
          y1: '#FFF3C2',
          y2: '#D77B0F',
          g1: '#E7F6E6',
          g2: '#C3EBD4',
          g3: '#4A6A49',
        },
        ssafy: {
          default: '#6DCEF5',
        },
        status: {
          info: '#71A4FF',
          success: '#81D69E',
          caution: '#FFD980',
          warning: '#EB7962',
        },
        text: {
          default: '#27272B',
          description: '#797A81',
        },
        gray: {
          white: '#FFFFFF',
          100: '#F3F3F3',
          200: '#EEEEEE',
          300: '#E8E8E8',
          400: '#D4D4D4',
        },
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        s: ['13px', { lineHeight: '18px' }],
        md: ['14px', { lineHeight: '20px' }],
        l: ['15px', { lineHeight: '22px' }],
        xl: ['16px', { lineHeight: '24px' }],
        'info-small': ['20px', { lineHeight: '28px' }],
        'info-large': ['24px', { lineHeight: '32px' }],
        title: ['50px', { lineHeight: '60px' }],
      },
    },
  },
  plugins: [],
};
