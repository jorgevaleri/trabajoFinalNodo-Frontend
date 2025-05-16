//frontend/src/api/axios.js
// IMPORTA AXIOS, UNA LIBRERÍA PARA HACER PETICIONES HTTP
import axios from 'axios'

// CREA UNA INSTANCIA PERSONALIZADA DE AXIOS
const instance = axios.create({
  // DEFINE LA URL BASE DE LA API, OBTENIDA DE LAS VARIABLES DE ENTORNO DE VITE
  baseURL: import.meta.env.VITE_API_URL,
  // CONFIGURA LOS HEADERS POR DEFECTO PARA ENVIAR DATOS EN FORMATO JSON
  headers: {
    'Content-Type': 'application/json',
  },
})

// AGREGA UN INTERCEPTOR A LA INSTANCIA DE AXIOS PARA MODIFICAR CADA PETICIÓN ANTES DE ENVIARLA
instance.interceptors.request.use(config => {
  // OBTIENE EL TOKEN DE AUTENTICACIÓN GUARDADO EN LOCALSTORAGE
  const token = localStorage.getItem('token')
  // SI EXISTE UN TOKEN, LO AGREGA AL HEADER DE AUTORIZACIÓN DE LA PETICIÓN
  if (token) config.headers.Authorization = `Bearer ${token}`
  // RETORNA LA CONFIGURACIÓN MODIFICADA
  return config
})

// EXPORTA LA INSTANCIA DE AXIOS CONFIGURADA PARA SER USADA EN TODO EL PROYECTO
export default instance
