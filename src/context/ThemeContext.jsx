// src/context/ThemeContext.jsx
// // import { createContext, useState, useEffect } from 'react';

// // export const ThemeContext = createContext();

// // export function ThemeProvider({ children }) {
// //   const [theme, setTheme] = useState('light');

// //   // Al montar, cargamos preferencia o sistema
// //   useEffect(() => {
// //     const stored = localStorage.getItem('theme');
// //     if (stored === 'light' || stored === 'dark') {
// //       setTheme(stored);
// //     } else {
// //       // fallback a preferencia del sistema
// //       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// //       setTheme(prefersDark ? 'dark' : 'light');
// //     }
// //   }, []);

// //   // Cada vez que cambia theme, actualizamos localStorage y la clase en <html>
// //   useEffect(() => {
// //     const root = document.documentElement;
// //     if (theme === 'dark') {
// //       root.classList.add('dark');
// //     } else {
// //       root.classList.remove('dark');
// //     }
// //     localStorage.setItem('theme', theme);
// //   }, [theme]);

// //   const toggleTheme = () => {
// //     setTheme(curr => (curr === 'light' ? 'dark' : 'light'));
// //   };

// //   return (
// //     <ThemeContext.Provider value={{ theme, toggleTheme }}>
// //       {children}
// //     </ThemeContext.Provider>
// //   );
// // }

// import { createContext, useState, useEffect } from 'react'

// export const ThemeContext = createContext()

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState('light')

//   // Al montar, leemos preferencia de localStorage o media query
//   useEffect(() => {
//     const stored = localStorage.getItem('theme')
//     if (stored) {
//       setTheme(stored)
//     } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setTheme('dark')
//     }
//   }, [])

//   // Cada vez que cambia theme, actualizamos <html> y localStorage
//   useEffect(() => {
//     const root = document.documentElement
//     if (theme === 'dark') {
//       root.classList.add('dark')
//     } else {
//       root.classList.remove('dark')
//     }
//     localStorage.setItem('theme', theme)
//   }, [theme])

//   const toggleTheme = () =>
//     setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }


import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  // Al montar, lee localStorage o la preferencia del sistema
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  // Cada vez que cambie theme, actualiza <html> y localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
    console.log('Theme set to', theme)  // para depuración
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

//VER / MODIFICAR / O BORRAR