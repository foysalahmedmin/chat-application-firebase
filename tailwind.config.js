/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#74d7e9',
        secondary: '#b99fff'
      }
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#74d7e9",
          "secondary": "#b99fff",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
        },
      },
      "dark",
      "light",
    ],
  },
  plugins: [
    require('daisyui'),
  ]
}

