//frontend/src/components/MovieCard.jsx
// IMPORTA VALIDACIÓN DE PROPIEDADES
import PropTypes from "prop-types"
// IMPORTA LA LIBRERÍA DE NOTIFICACIONES
import { toast } from "react-toastify"
// IMPORTA HOOKS DE REACT PARA MANEJAR ESTADO Y EFECTOS
import { useState, useEffect } from "react"
// IMPORTA ICONOS DE HEROICONS
import {
  PlayIcon,
  HeartIcon as HeartSolid,
  HeartIcon as HeartOutline,
} from "@heroicons/react/24/solid"

// COMPONENTE PRINCIPAL DE TARJETA DE PELÍCULA
export default function MovieCard({
  movie,
  profile,
  isInWatchlist,
  onToggleWatchlist,
}) {
  // ESTADO LOCAL PARA CONTAR CUÁNTAS VECES SE HA REPRODUCIDO LA PELÍCULA
  const [playCount, setPlayCount] = useState(0)

  // EFECTO QUE CARGA DESDE LOCALSTORAGE CUÁNTAS VECES SE HA REPRODUCIDO LA PELÍCULA
  useEffect(() => {
    const saved = localStorage.getItem(`playCount_${movie.id}`)
    if (saved) setPlayCount(Number(saved))
  }, [movie.id])

  // FUNCIÓN QUE INCREMENTA EL CONTADOR DE REPRODUCCIONES Y LO GUARDA
  const handlePlay = () => {
    const next = playCount + 1
    setPlayCount(next)
    localStorage.setItem(`playCount_${movie.id}`, next)
    toast.success("¡Película reproducida!")
  }

  // FUNCIÓN PARA AGREGAR O ELIMINAR LA PELÍCULA DE FAVORITOS
  const handleFav = () => {
    onToggleWatchlist(movie)
    toast.success(
      isInWatchlist
        ? `"${movie.title}" eliminado de Favoritos`
        : `"${movie.title}" agregado a Favoritos`
    )
  }

  // LISTA DE GÉNEROS DE LA PELÍCULA (VACÍA POR DEFECTO)
  const genreList = movie.genres || []

  // RENDERIZA LA INTERFAZ DE LA TARJETA
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col">
      {/* IMAGEN DEL PÓSTER DE LA PELÍCULA */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-64 object-contain bg-gray-200"
      />

      {/* CUERPO DE LA TARJETA */}
      <div className="p-4 flex-1 flex flex-col">
        {/* TÍTULO DE LA PELÍCULA */}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {movie.title}
        </h3>
        {/* DESCRIPCIÓN DE LA PELÍCULA */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
          {movie.description}
        </p>
        {/* INFORMACIÓN DE GÉNERO Y EDAD MÍNIMA */}
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-200">
          <strong>Género:</strong> {genreList.join(", ") || "—"}
          <br />
          <strong>Edad mínima:</strong> {movie.minAge}+
        </div>

        {/* BOTONES DE REPRODUCIR, CONTADOR Y FAVORITOS */}
        <div className="flex items-center justify-between space-x-2 mt-auto">
          {/* BOTÓN DE REPRODUCIR */}
          <button
            onClick={handlePlay}
            className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            <PlayIcon className="h-5 w-5" />
            <span>Reproducir</span>
          </button>
          {/* MOSTRAR CUÁNTAS VECES SE HA REPRODUCIDO */}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            🎬 {playCount}
          </span>
          {/* BOTÓN DE AGREGAR/QUITAR FAVORITOS */}
          <button
            onClick={handleFav}
            className="p-2 rounded-full transition"
            title={
              isInWatchlist
                ? "Eliminar de Favoritos"
                : "Agregar a Favoritos"
            }
          >

            {isInWatchlist ? (
              // ICONO LLENO SI ESTÁ EN FAVORITOS
              <HeartSolid className="h-6 w-6 text-red-500" />
            ) : (
              // ICONO VACÍO SI NO ESTÁ EN FAVORITOS
              <HeartOutline className="h-6 w-6 text-gray-400 hover:text-red-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// VALIDACIÓN DE PROPIEDADES ESPERADAS EN EL COMPONENTE
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    posterUrl: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    minAge: PropTypes.number,
  }).isRequired,
  profile: PropTypes.object.isRequired,
  isInWatchlist: PropTypes.bool.isRequired,
  onToggleWatchlist: PropTypes.func.isRequired,
}
