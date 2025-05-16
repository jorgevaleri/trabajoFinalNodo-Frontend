/** @type {import('tailwindcss').Config} */
export default {
  // Dónde Tailwind debe buscar clases en tu código
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  // Activamos modo oscuro por clase .dark en <html>
  darkMode: 'class',

  theme: {
    extend: {
      // Fondos personalizados
      backgroundImage: {
        // Para usar: bg-netflix-login
        'netflix-login': "url('/src/assets/netflix-bg.jpg')",
      },

      // Ejemplo de extensión de paleta:
      // colors: {
      //   'brand-red':   '#E50914',
      //   'brand-black': '#141414',
      // },

      // Ejemplo de tipografías personalizadas:
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      // },
    },
  },

  plugins: [
    // Si quieres estilos para formularios:
    // require('@tailwindcss/forms'),
  ],
}
