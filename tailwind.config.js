/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#E9513B', dark: '#C93D29', soft: '#FDEDEA' },
        ink: { DEFAULT: '#222222', sub: '#777777', mute: '#A8A8A8' },
        line: '#EBEBEB',
        surface: '#F6F6F7',
        ok: { DEFAULT: '#1F8A5B', soft: '#E7F5EE' },
        bad: { DEFAULT: '#C6362B', soft: '#FCEBEA' },
        warn: { DEFAULT: '#B26A00', soft: '#FFF4E0' },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: { card: '16px' },
      maxWidth: { app: '480px' },
    },
  },
  plugins: [],
};
