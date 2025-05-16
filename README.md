📄 MiCine – Frontend

📌 Descripción
    MiCine Frontend es una aplicación React + Vite que consume la API del backend para ofrecer interfaz de usuario con autenticación, selección de perfil, lista de películas y CRUD avanzado para administradores.

🎯 Objetivo
    Demostrar en React:
        🖥️ Interfaz responsiva con Tailwind CSS
        🔀 Routing con React Router
        🧩 State global usando Context API (Auth, Profile, Theme)
        📡 Peticiones HTTP con Axios
        ✔️ Validación de formularios con react‑hook‑form + Yup
        🚀 Feedback con react‑toastify y SweetAlert2

🚀 Funcionalidades
    Rutas Principales
        /login
        /register
        /profiles (selección o creación de perfil)
        /movies (listado público)
        /watchlist
        /movies/crud (CRUD películas – admin)
        /users y /users/me (CRUD usuarios – admin / cuenta propia)

    Operaciones CRUD
        Crear / editar / eliminar perfiles
        Crear / editar / eliminar usuarios (admin)
        Crear / editar / eliminar películas (admin)

    Filtros y buscador
        Buscar por título
        Filtrar por género y edad mínima

    UI Enhancements
        Toasts de éxito/error
        Confirmación modal al eliminar
        Animaciones en botones
        Modal de detalle de perfil

🛠 Tecnologías
    React 18, Vite
    React Router DOM
    axios
    react‑hook‑form, Yup, @hookform/resolvers
    Tailwind CSS
    react‑toastify, sweetalert2
    @heroicons/react

📂 Estructura
    frontend/
    ├─ src/
    │  ├─ components/      # Navbar, modals…
    │  ├─ context/         # AuthContext, ProfileContext, ThemeContext
    │  ├─ pages/           # Login, Register, Movies, Users, AdminMovies…
    │  ├─ App.jsx
    │  ├─ main.jsx
    │  └─ index.css        # Tailwind directives
    ├─ tailwind.config.js
    ├─ postcss.config.js
    └─ package.json

⚙️ Instalación & Ejecución
    npm install

.env:
    VITE_API_BASE_URL=http://localhost:4000/api

Levantar Vite:
    npm run dev

Abrir: http://localhost:5173

🔗 Deploy & Repositorio
    github: https://github.com/jorgevaleri/trabajoFinalNodo-Frontend
    Netlify: https://tubular-biscochitos-5fffd7.netlify.app/login

✅ Criterios cumplidos
    ✔ UI moderna responsive
    ✔ Routing protegido
    ✔ Formularios validados
    ✔ CRUD completo
    ✔ Filtros y buscador
    ✔ Feedback con Toasts y modales