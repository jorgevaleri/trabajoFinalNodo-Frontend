// src/context/AuthContext.jsx
// IMPORTA FUNCIONES NECESARIAS DE REACT PARA CREAR CONTEXTO Y MANEJAR ESTADO Y EFECTOS
import { createContext, useState, useEffect } from 'react'
// IMPORTA HOOK DE NAVEGACIÓN DE REACT ROUTER PARA REDIRECCIONAR PÁGINAS
import { useNavigate } from 'react-router-dom'
// IMPORTA INSTANCIA DE AXIOS CONFIGURADA PARA HACER PETICIONES HTTP
import axios from '../api/axios'
// IMPORTA TOAST PARA MOSTRAR NOTIFICACIONES EMERGENTES
import { toast } from 'react-toastify'

// CREA Y EXPORTA EL CONTEXTO DE AUTENTICACIÓN
export const AuthContext = createContext()

// DEFINE Y EXPORTA EL COMPONENTE PROVIDER DE AUTENTICACIÓN
export function AuthProvider({ children }) {
  // DECLARA EL ESTADO user PARA GUARDAR DATOS DEL USUARIO AUTENTICADO
  const [user, setUser] = useState(null)
  // ESTADO PARA INDICAR SI SE ESTÁ CARGANDO LA VERIFICACIÓN DE AUTENTICACIÓN
  const [loadingAuth, setLoadingAuth] = useState(true)
  // OBTIENE LA FUNCIÓN navigate PARA REDIRECCIONAR
  const navigate = useNavigate()

  // useEffect PARA COMPROBAR LA AUTENTICACIÓN AL MONTAR EL COMPONENTE
  useEffect(() => {
    // FUNCIÓN PARA VERIFICAR SI HAY UN USUARIO AUTENTICADO
    const checkAuth = async () => {
      // OBTIENE EL TOKEN DEL LOCAL STORAGE
      const token = localStorage.getItem('token')

      // SI HAY TOKEN, INTENTA VALIDARLO
      if (token) {
        try {
          // REALIZA PETICIÓN PARA OBTENER LOS DATOS DEL USUARIO ACTUAL
          const { data } = await axios.get('/auth/me')
          // ESTABLECE LOS DATOS DEL USUARIO EN EL ESTADO
          setUser(data.user)
        } catch {
          // SI FALLA, ELIMINA EL TOKEN DEL LOCAL STORAGE
          localStorage.removeItem('token')
        }
      }
      // INDICA QUE LA VERIFICACIÓN HA TERMINADO
      setLoadingAuth(false)
    }
    // LLAMA A LA FUNCIÓN DE VERIFICACIÓN
    checkAuth()
  }, []) // SE EJECUTA SOLO UNA VEZ AL MONTARSE EL COMPONENTE

  // FUNCIÓN PARA INICIAR SESIÓN
  const login = async (creds) => {
    try {
      // ENVÍA LAS CREDENCIALES AL ENDPOINT DE LOGIN
      const { data } = await axios.post('/auth/login', creds)
      // GUARDA EL TOKEN EN LOCAL STORAGE
      localStorage.setItem('token', data.token)
      // ESTABLECE EL USUARIO EN EL ESTADO
      setUser(data.user)
      // MUESTRA MENSAJE DE BIENVENIDA
      toast.success('¡Bienvenido de nuevo!')
      // REDIRECCIONA A LA PÁGINA DE PERFILES
      navigate('/profiles')
    } catch (error) {
      // SI OCURRE UN ERROR, MUESTRA MENSAJE DE ERROR
      console.error(error)
      toast.error('Credenciales inválidas')
    }
  }

  // FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO
  const register = async (creds) => {
    // ENVÍA LAS CREDENCIALES AL ENDPOINT DE REGISTRO
    const { data } = await axios.post('/auth/register', creds)
    // GUARDA EL TOKEN EN LOCAL STORAGE
    localStorage.setItem('token', data.token)
    // ESTABLECE EL USUARIO EN EL ESTADO
    setUser(data.user)
    // REDIRECCIONA A LA PÁGINA DE PERFILES
    navigate('/profiles')
  }

  // FUNCIÓN PARA CERRAR SESIÓN
  const logout = () => {
    // ELIMINA EL TOKEN DEL LOCAL STORAGE
    localStorage.removeItem('token')
    // LIMPIA EL ESTADO DEL USUARIO
    setUser(null)
    // MUESTRA MENSAJE DE CIERRE DE SESIÓN
    toast.info('Has cerrado sesión')
    // REDIRECCIONA A LA PÁGINA DE LOGIN
    navigate('/login')
  }

  // DEVUELVE EL CONTEXTO ENVOLVIENDO A LOS COMPONENTES HIJOS
  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, register, logout }}>
      {children} {/* RENDERIZA LOS COMPONENTES HIJOS DENTRO DEL CONTEXTO */}
    </AuthContext.Provider>
  )
}
