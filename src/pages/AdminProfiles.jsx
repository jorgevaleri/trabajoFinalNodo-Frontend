// src/pages/AdminProfiles.jsx
// IMPORTA LOS HOOKS useState Y useEffect DE REACT
import { useState, useEffect } from 'react'
// IMPORTA LA INSTANCIA DE AXIOS CONFIGURADA
import axios from '../api/axios'
// IMPORTA LA LIBRERÍA SWEETALERT2 PARA ALERTAS MODALES
import Swal from 'sweetalert2'
// IMPORTA LA FUNCIÓN toast DE react-toastify PARA MOSTRAR NOTIFICACIONES
import { toast } from 'react-toastify'
// IMPORTA useForm DE REACT-HOOK-FORM PARA MANEJAR FORMULARIOS
import { useForm } from "react-hook-form"
// IMPORTA yupResolver PARA CONECTAR YUP CON REACT-HOOK-FORM
import { yupResolver } from "@hookform/resolvers/yup"
// IMPORTA TODA LA LIBRERÍA YUP PARA VALIDACIONES
import * as yup from "yup"

// DEFINE EL ESQUEMA DE VALIDACIÓN CON YUP
const schema = yup.object({
  name:   yup.string().required("El nombre es obligatorio"), // NOMBRE REQUERIDO
  age:    yup // EDAD CON VALIDACIÓN NUMÉRICA
    .number()
    .typeError("La edad debe ser un número")
    .min(0, "Edad inválida")
    .required("La edad es obligatoria"),
  avatar: yup.string().required("Selecciona un avatar") // AVATAR REQUERIDO
}).required()

// DECLARA EL COMPONENTE PRINCIPAL
export default function AdminProfiles() {
    const [profiles, setProfiles] = useState([]) // ESTADO PARA GUARDAR LOS PERFILES
  const [images,   setImages]   = useState([]) // ESTADO PARA GUARDAR LAS IMÁGENES DE AVATAR
  const [viewing,  setViewing]  = useState(null) // ESTADO PARA SABER QUÉ PERFIL SE ESTÁ VISUALIZANDO
  const [editing,  setEditing]  = useState(null) // ESTADO PARA SABER QUÉ PERFIL SE ESTÁ EDITANDO

  // EFECTO QUE CARGA PERFILES E IMÁGENES AL MONTARSE EL COMPONENTE
  useEffect(() => {
    loadProfiles()
    loadImages()
  }, [])

  // FUNCIÓN ASÍNCRONA PARA CARGAR LOS PERFILES
  const loadProfiles = async () => {
    try {
      // PETICIÓN A LA API PARA OBTENER PERFILES
      const { data } = await axios.get('/profiles')
      // ACTUALIZA EL ESTADO CON LOS PERFILES
      setProfiles(data.profiles)
    } catch {
      // MUESTRA ERROR EN CASO DE FALLA
      toast.error('Error cargando perfiles')
    }
  }

  // FUNCIÓN ASÍNCRONA PARA CARGAR LAS IMÁGENES DE AVATAR
  const loadImages = async () => {
    try {
      // PETICIÓN PARA OBTENER AVATARES
      const { data } = await axios.get('/profiles/images/list')
      // ACTUALIZA EL ESTADO CON LAS IMÁGENES
      setImages(data.images)
    } catch {
      // MUESTRA ERROR EN CASO DE FALLA
      toast.error('No se pudieron cargar las imágenes de perfil')
    }
  }

  // CONFIGURA EL FORMULARIO USANDO REACT-HOOK-FORM Y YUP
  const {
    register, // PARA REGISTRAR CAMPOS
    handleSubmit, // MANEJADOR DE ENVÍO
    reset, // FUNCIÓN PARA RESETEAR FORMULARIO
    watch, // OBSERVA CAMBIOS EN CAMPOS
    getValues, // OBTIENE LOS VALORES ACTUALES
    formState: { errors, isSubmitting } // ESTADO DEL FORMULARIO (ERRORES Y SI ESTÁ ENVIANDO)
  } = useForm({
    resolver: yupResolver(schema), // APLICA VALIDACIÓN CON YUP
    // VALORES POR DEFECTO
    defaultValues: {
      name:   "",
      age:    "",
      avatar: ""
    }
  })

  // VARIABLE QUE OBTIENE EL AVATAR SELECCIONADO
  const selectedAvatar = watch("avatar")

  // FUNCIÓN QUE RESETEA EL FORMULARIO Y SALE DEL MODO EDICIÓN
  const resetForm = () => {
    reset({ name: "", age: "", avatar: "" }) // LIMPIA LOS CAMPOS
    setEditing(null) // SALE DEL MODO EDICIÓN
  }

  // FUNCIÓN QUE SE EJECUTA AL ENVIAR EL FORMULARIO
  const onSubmit = async (data) => {
    try {
      // SI ESTÁ EN MODO EDICIÓN
      if (editing) {
        await axios.put(`/profiles/${editing._id}`, data) // ACTUALIZA PERFIL
        toast.success('Perfil actualizado') // MUESTRA MENSAJE DE ÉXITO
      } else {
        await axios.post('/profiles', data) // CREA NUEVO PERFIL
        toast.success('Perfil creado') // MUESTRA MENSAJE DE ÉXITO
      }
      resetForm() // LIMPIA FORMULARIO
      loadProfiles() // RECARGA PERFILES
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error guardando perfil') // MUESTRA ERROR
    }
  }

  // FUNCIÓN PARA ELIMINAR UN PERFIL CON CONFIRMACIÓN
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar este perfil?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!result.isConfirmed) return

    try {
      await axios.delete(`/profiles/${id}`)
      setProfiles(prev => prev.filter(p => p._id !== id))
      toast.success('Perfil eliminado')
    } catch {
      toast.error('Error al eliminar perfil')
    }
  }

  // FUNCIÓN PARA MOSTRAR DETALLES DE UN PERFIL
  const handleView = (p) => {
    setViewing(p)
  }

  // FUNCIÓN PARA PREPARAR FORMULARIO EN MODO EDICIÓN
  const handleEdit = (p) => {
    setEditing(p)
    reset({
      name:   p.name,
      age:    p.age,
      avatar: p.avatar
    })
  }

  // FUNCIÓN PARA CERRAR EL MODAL DE VER MÁS
  const closeViewing = () => setViewing(null)

  // RETORNA EL JSX (INTERFAZ GRÁFICA)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administrar Perfiles</h1>

      {/* FORMULARIO PARA CREAR O EDITAR UN PERFIL */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl mb-2">
          {editing ? 'Editar perfil' : 'Crear nuevo perfil'}
        </h2>

        {/* CAMPO NOMBRE */}
        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            {...register("name")}
            className={`w-full border p-2 rounded ${
              errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.name && (
            <p className="text-red-600 font-bold mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* CAMPO EDAD */}
        <div>
          <label className="block mb-1 font-medium">Edad</label>
          <input
            type="number"
            {...register("age")}
            className={`w-full border p-2 rounded ${
              errors.age ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.age && (
            <p className="text-red-600 font-bold mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* LISTADO DE IMÁGENES DE AVATAR */}
        <div>
          <label className="block mb-1 font-medium">Avatar</label>
          <div
            className={`flex space-x-2 overflow-x-auto border p-2 rounded ${
              errors.avatar ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {images.map(img => (
              <img
                key={img}
                src={img}
                alt="avatar"
                onClick={() => reset({ ...getValues(), avatar: img })}
                className={
                  `w-16 h-16 object-cover rounded cursor-pointer transition-transform ${
                    selectedAvatar === img ? 'ring-4 ring-blue-500 scale-105' : ''
                  }`
                }
              />
            ))}
          </div>
          {errors.avatar && (
            <p className="text-red-600 font-bold mt-1">{errors.avatar.message}</p>
          )}
        </div>

        {/* BOTONES DEL FORMULARIO */}
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
          >
            {isSubmitting
              ? (editing ? 'Actualizando…' : 'Creando…')
              : (editing ? 'Guardar cambios' : 'Crear perfil')}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTADO DE PERFILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profiles.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow relative">
            <img
              src={p.avatar}
              alt={p.name}
              className="w-24 h-24 object-cover rounded-full mx-auto"
            />
            <h3 className="text-lg text-center my-2">{p.name}</h3>
            <div className="flex justify-around">
              <button onClick={() => handleView(p)} className="text-sm text-blue-600">
                Ver más
              </button>
              <button onClick={() => handleEdit(p)} className="text-sm text-green-600">
                Modificar
              </button>
              <button onClick={() => handleDelete(p._id)} className="text-sm text-red-600">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE “VER MÁS” */}
      {viewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-sm">
            <h2 className="text-xl font-bold mb-4">{viewing.name}</h2>
            <p>Edad: {viewing.age}</p>
            <img
              src={viewing.avatar}
              alt={viewing.name}
              className="w-32 h-32 object-cover rounded-full my-4"
            />
            <button
              onClick={closeViewing}
              className="mt-4 bg-gray-300 px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
