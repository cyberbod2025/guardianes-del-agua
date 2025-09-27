/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './style.css',
    './{App,index}.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './hooks/**/*.{ts,tsx,js,jsx}',
    './constants.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
