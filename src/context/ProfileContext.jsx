// src/context/ProfileContext.jsx
// IMPORTA FUNCIONES DE REACT PARA CREAR CONTEXTO, MANEJAR ESTADO Y EFECTOS
import { createContext, useState, useEffect } from 'react'
// IMPORTA HOOK DE NAVEGACIÓN DE REACT ROUTER PARA REDIRECCIONAR PÁGINAS
import { useNavigate } from 'react-router-dom'

// CREA Y EXPORTA EL CONTEXTO DE PERFIL
export const ProfileContext = createContext()

// DEFINE Y EXPORTA EL COMPONENTE PROVIDER DEL CONTEXTO DE PERFIL
export function ProfileProvider({ children }) {
    // DEFINE ESTADO LOCAL PARA GUARDAR EL PERFIL SELECCIONADO
  const [profile, setProfile] = useState(null)
    // OBTIENE LA FUNCIÓN DE NAVEGACIÓN PARA REDIRECCIONAR
  const navigate = useNavigate()

    // CUANDO SE MONTA EL COMPONENTE, INTENTA CARGAR EL PERFIL DESDE LOCAL STORAGE
  useEffect(() => {
        // OBTIENE EL PERFIL GUARDADO DEL LOCAL STORAGE
    const stored = localStorage.getItem('selectedProfile')
        // SI EXISTE, ACTUALIZA EL ESTADO CON EL PERFIL PARSEADO
    if (stored) {
      setProfile(JSON.parse(stored))
    }
  }, []) // SE EJECUTA UNA VEZ AL MONTARSE EL COMPONENTE

  // FUNCION PARA ELEGIR UN PERFIL
  const chooseProfile = (p) => {
    setProfile(p) // GUARDA EL PERFIL EN EL ESTADO
    localStorage.setItem('selectedProfile', JSON.stringify(p)) // LO ALMACENA EN LOCAL STORAGE
    navigate('/movies') // REDIRECCIONA A LA RUTA /movies
  }

  // FUNCION PARA LIMPIAR EL PERFIL ACTUAL
  const clearProfile = () => {
    setProfile(null) // RESETEA EL ESTADO DEL PERFIL
    localStorage.removeItem('selectedProfile') // ELIMINA EL PERFIL DEL LOCAL STORAGE
    navigate('/profiles') // REDIRECCIONA A LA PÁGINA DE SELECCIÓN DE PERFILES
  }

  // DEVUELVE EL CONTEXTO ENVOLVIENDO A LOS COMPONENTES HIJOS, PROVEYENDO ACCESO A profile, chooseProfile Y clearProfile
  return (
    <ProfileContext.Provider value={{ profile, chooseProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}
