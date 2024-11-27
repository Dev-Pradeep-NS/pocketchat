/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          'dark': '#111b21',
          'light': '#202c33',
          'accent': '#00a884',
          'message': '#005c4b',
        }
      }
    }
  },
  plugins: [],
}

