// src/components/Navbar.jsx
// IMPORTA EL COMPONENTE LINK PARA NAVEGACIÓN ENTRE RUTAS
import { Link } from 'react-router-dom'
// IMPORTA EL HOOK useContext DE REACT PARA USAR CONTEXTOS
import { useContext } from 'react'
// IMPORTA EL CONTEXTO DE AUTENTICACIÓN
import { AuthContext }  from '../context/AuthContext'
// IMPORTA EL CONTEXTO DE PERFIL DE USUARIO
import { ProfileContext } from '../context/ProfileContext'

// DEFINICIÓN DEL COMPONENTE NAVBAR
export default function Navbar() {
  // OBTIENE EL USUARIO Y LA FUNCIÓN LOGOUT DESDE AuthContext
  const { user, logout } = useContext(AuthContext)
  // OBTIENE EL PERFIL ACTIVO Y LA FUNCIÓN PARA LIMPIARLO DESDE ProfileContext
  const { profile, clearProfile } = useContext(ProfileContext)

  // RENDERIZA EL CONTENIDO DE LA BARRA DE NAVEGACIÓN
  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* LOGO O NOMBRE DEL SITIO */}
      <h2 className="text-2xl font-bold">🎬 MiCine</h2>
    
      {/* SECCIÓN DE ENLACES CENTRALES */}
      <div className="flex items-center space-x-4">
        {/* SI EL USUARIO ESTÁ AUTENTICADO PERO NO HA SELECCIONADO UN PERFIL */}
        {user && !profile && (
          <Link
            to="/profiles"
            className="px-3 py-2 rounded transform transition hover:scale-105 hover:bg-blue-50 active:scale-95"
          >
            Perfiles
          </Link>
        )}
        {/* SI EL USUARIO Y EL PERFIL ESTÁN DEFINIDOS */}
        {user && profile && (
          <>
          {/* ENLACE A LA LISTA DE PELÍCULAS */}
            <Link
              to="/movies"
              className="px-3 py-2 rounded transform transition hover:scale-105 hover:bg-blue-50 active:scale-95"
            >
              Películas
            </Link>
            
            {/* ENLACE AL PERFIL DEL USUARIO */}
            <Link
              to="/profiles"
              className="px-3 py-2 rounded transform transition hover:scale-105 hover:bg-blue-50 active:scale-95"
            >
              Perfil
            </Link>
            
            {/* SI EL USUARIO ES ADMINISTRADOR, MUESTRA ENLACE A GESTIÓN DE USUARIOS */}
            {user.role === 'admin' ? (
              <Link
                to="/users"
                className="px-3 py-2 rounded transform transition hover:scale-105 hover:bg-blue-50 active:scale-95"
              >
                Usuarios
              </Link>
            ) : (
              // SI NO ES ADMIN, MUESTRA ENLACE A SU PROPIA CUENTA
              <Link
                to="/users/me"
                className="px-3 py-2 rounded transform transition hover:scale-105 hover:bg-blue-50 active:scale-95"
              >
                Mi Cuenta
              </Link>
            )}
          </>
        )}
      </div>

      {/* SECCIÓN DERECHA: MUESTRA EL PERFIL Y BOTÓN DE CERRAR SESIÓN */}
      {user && (
        <div className="flex items-center space-x-4">
          {/* SI HAY UN PERFIL SELECCIONADO, LO MUESTRA */}
          {profile && (
            <span className="text-gray-700">
              <strong>PERFIL DE:&nbsp;</strong> {profile.name}
            </span>
          )}
          {/* BOTÓN PARA CERRAR SESIÓN Y LIMPIAR EL PERFIL */}
          <button
            onClick={() => {
              clearProfile?.()
              logout()
            }}
            className="px-4 py-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded transform transition hover:scale-105 active:scale-95"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  )
}
