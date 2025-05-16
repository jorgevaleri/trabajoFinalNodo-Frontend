// frontend/src/pages/AdminMovies.jsx
// IMPORTA HOOKS DE REACT
import { useState, useEffect, useContext } from "react"
// IMPORTA INSTANCIA CONFIGURADA DE AXIOS
import axios from "../api/axios"
// IMPORTA EL CONTEXTO DE AUTENTICACIÓN
import { AuthContext } from "../context/AuthContext"
// IMPORTA FUNCIONES DE NOTIFICACIÓN
import { toast } from "react-toastify"
// IMPORTA SWEETALERT PARA ALERTAS PERSONALIZADAS
import Swal from "sweetalert2"

// IMPORTA HOOK PRINCIPAL DE REACT HOOK FORM
import { useForm } from "react-hook-form"
// IMPORTA RESOLVER PARA YUP
import { yupResolver } from "@hookform/resolvers/yup"
// IMPORTA TODA LA LIBRERÍA YUP
import * as yup from "yup"

// TU MAPA ESTÁTICO DE GÉNEROS
const genresMap = {
  28: "Acción",
  12: "Aventura",
  16: "Animación",
  35: "Comedia",
  80: "Crimen",
  99: "Documental",
  18: "Drama",
  10751: "Familiar",
  14: "Fantasía",
  36: "Historia",
  27: "Terror",
  10402: "Música",
  9648: "Misterio",
  10749: "Romance",
  878: "Ciencia Ficción",
  10770: "TV Movie",
  53: "Suspenso",
  10752: "Guerra",
  37: "Western",
}

// ESQUEMA DE VALIDACIÓN CON YUP
const schema = yup.object({
  title: yup.string().required("El título es obligatorio"), // TÍTULO REQUERIDO
  description: yup.string().optional(), // DESCRIPCIÓN OPCIONAL
  posterUrl: yup
    .string()
    .url("La URL del póster no es válida")
    .nullable()
    .notRequired(), // URL VÁLIDA OPCIONAL
  genres: yup
    .array()
    .of(yup.number())
    .min(1, "Selecciona al menos un género"), // AL MENOS UN GÉNERO SELECCIONADO
  minAge: yup
    .number()
    .typeError("La edad mínima debe ser un número")
    .min(0, "Edad mínima inválida")
    .required("La edad mínima es obligatoria"), // EDAD MÍNIMA REQUERIDA Y VÁLIDA
}).required()


export default function AdminMovies() {
  // OBTIENE EL USUARIO DEL CONTEXTO DE AUTENTICACIÓN
  const { user } = useContext(AuthContext)
  // SI NO ES ADMIN, NO RENDERIZA NADA
  if (user.role !== "admin") return null

  // ESTADOS PARA LA LISTA Y FILTROS
  const [list, setList] = useState([]) // LISTA DE PELÍCULAS
  const [allGenres, setAllGenres] = useState([]) // LISTA DE GÉNEROS DISPONIBLES
  const [searchTerm, setSearchTerm] = useState("") // TÉRMINO DE BÚSQUEDA
  const [filterGenre, setFilterGenre] = useState("") // FILTRO POR GÉNERO
  const [filterAge, setFilterAge] = useState("") // FILTRO POR EDAD

  // ID DE LA PELÍCULA EN EDICIÓN (SI APLICA)
  const [editingId, setEditingId] = useState(null)

  // CONFIGURACIÓN DE REACT-HOOK-FORM CON YUP
  const {
    register, // REGISTRA INPUTS
    handleSubmit, // MANEJA ENVÍO DE FORMULARIO
    reset, // RESETEA LOS VALORES DEL FORMULARIO
    formState: { errors, isSubmitting }, // ESTADO DE ERRORES Y SUBMIT
  } = useForm({
    resolver: yupResolver(schema), // RESOLVER CON VALIDACIÓN YUP
    defaultValues: {
      title: "",
      description: "",
      posterUrl: "",
      genres: [],
      minAge: 0,
    },
  })

  // AL MONTAR EL COMPONENTE, CARGA LAS PELÍCULAS Y GÉNEROS
  useEffect(() => {
    loadList()
    // Usamos tu endpoint real de géneros
    setAllGenres(Object.entries(genresMap).map(([id, name]) => ({ id: Number(id), name })))
  }, [])

  // FUNCIÓN PARA CARGAR LA LISTA DE PELÍCULAS
  const loadList = async () => {
    try {
      const { data } = await axios.get("/movies/crud")
      setList(data)
    } catch {
      toast.error("Error cargando películas")
    }
  }

  // ENVÍA LOS DATOS DEL FORMULARIO (CREAR O EDITAR)
  const onSubmit = async (data) => {
    try {
      let res
      // payload
      const payload = { ...data } // CLONA LOS DATOS DEL FORMULARIO
      if (editingId) { // SI ESTÁ EDITANDO
        res = await axios.put(`/movies/crud/${editingId}`, payload)
        setList(l => l.map(m => m._id === editingId ? res.data : m))
        toast.success("Película actualizada")
      } else { // SI ESTÁ CREANDO
        res = await axios.post("/movies/crud", payload)
        setList(l => [res.data, ...l])
        toast.success("Película creada")
      }
      reset() // RESETEA FORMULARIO
      setEditingId(null) // LIMPIA MODO EDICIÓN
    } catch {
      toast.error("Error guardando película")
    }
  }

  // CARGA DATOS DE UNA PELÍCULA PARA EDITAR
  const handleEdit = (m) => {
    setEditingId(m._id)
    reset({
      title: m.title,
      description: m.description,
      posterUrl: m.posterUrl,
      genres: m.genres,
      minAge: m.minAge,
    })
  }

  // ELIMINA UNA PELÍCULA CON CONFIRMACIÓN
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de eliminar esta película?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!result.isConfirmed) return

    try {
      await axios.delete(`/movies/crud/${id}`)
      setList(l => l.filter(m => m._id !== id))
      toast.success("Película eliminada")
    } catch {
      toast.error("Error eliminando película")
    }
  }

  // APLICA FILTROS A LA LISTA DE PELÍCULAS
  const visible = list
    .filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(m => !filterGenre || m.genres.includes(Number(filterGenre)))
    .filter(m => !filterAge || m.minAge <= Number(filterAge))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administrador de Películas</h1>

      {/* FORMULARIO DE PELÍCULA */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 bg-white p-4 rounded shadow space-y-4">
        {/* CAMPO TÍTULO */}
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input
            type="text"
            {...register("title")}
            className={`w-full border p-2 rounded ${errors.title ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.title && <p className="text-red-600 font-bold mt-1">{errors.title.message}</p>}
        </div>

        {/* CAMPO DESCRIPCIÓN */}
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            {...register("description")}
            className="w-full border p-2 rounded border-gray-300"
          />
        </div>

        {/* CAMPO URL DEL PÓSTER */}
        <div>
          <label className="block mb-1 font-medium">URL del póster (opcional)</label>
          <input
            type="url"
            {...register("posterUrl")}
            className={`w-full border p-2 rounded ${errors.posterUrl ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.posterUrl && <p className="text-red-600 font-bold mt-1">{errors.posterUrl.message}</p>}
        </div>

        {/* CAMPO EDAD MÍNIMA */}
        <div>
          <label className="block mb-1 font-medium">Edad mínima</label>
          <input
            type="number"
            {...register("minAge")}
            className={`w-full border p-2 rounded ${errors.minAge ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.minAge && <p className="text-red-600 font-bold mt-1">{errors.minAge.message}</p>}
        </div>

        {/* CAMPO GÉNEROS */}
        <div>
          <label className="block mb-1 font-medium">Géneros</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border p-2 rounded">
            {allGenres.map(g => (
              <label key={g.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={g.id}
                  {...register("genres")}
                />
                <span>{g.name}</span>
              </label>
            ))}
          </div>
          {errors.genres && <p className="text-red-600 font-bold mt-1">{errors.genres.message}</p>}
        </div>

        {/* BOTONES DE ENVIAR Y CANCELAR */}
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
          >
            {isSubmitting ? (editingId ? "Actualizando…" : "Creando…")
              : (editingId ? "Guardar cambios" : "Crear película")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { reset(); setEditingId(null); }}
              className="text-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* BÚSQUEDA Y FILTROS */}
      <div className="flex flex-wrap gap-6 mb-6">
        {/* BÚSQUEDA POR TÍTULO */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Buscar por título:</label>
          <input
            type="text"
            placeholder="Introduce parte del título..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded w-64"
          />
        </div>

        {/* FILTRO POR GÉNERO */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Filtrar por género:</label>
          <select
            value={filterGenre}
            onChange={e => setFilterGenre(e.target.value)}
            className="px-3 py-2 border rounded w-48"
          >
            <option value="">Todos los géneros</option>
            {allGenres.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* FILTRO POR EDAD MÍNIMA */}
        <div className="flex flex-col">
          <label className="font-medium mb-1">Filtrar por edad mínima:</label>
          <select
            value={filterAge}
            onChange={e => setFilterAge(e.target.value)}
            className="px-3 py-2 border rounded w-48"
          >
            <option value="">Sin filtro de edad</option>
            {[0, 7, 13, 16, 18].map(a => (
              <option key={a} value={a}>{a}+</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Géneros</th>
            <th className="px-4 py-2">Edad Mín.</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((m, idx) => (
            <tr key={m._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2">{m.title}</td>
              <td className="px-4 py-2">{m.genres.map(id => genresMap[id]).join(", ")}</td>
              <td className="px-4 py-2">{m.minAge}</td>
              <td className="px-4 py-2 space-x-2 text-center">
                <button onClick={() => handleEdit(m)} className="text-green-600 hover:text-green-800">✏️</button>
                <button onClick={() => handleDelete(m._id)} className="text-red-600 hover:text-red-800">🗑️</button>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No hay películas que coincidan
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
