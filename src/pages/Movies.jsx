// // src/pages/Movies.jsx
// import { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import axios from "../api/axios";
// import MovieCard from "../components/MovieCard";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";

// // Convierte IDs de género en nombres
// function mapGenreNames(ids = [], genresList = []) {
//   return ids
//     .map(id => genresList.find(g => g.id === id)?.name)
//     .filter(Boolean);
// }

// export default function Movies() {
//   const { user } = useContext(AuthContext);
//   const [movies, setMovies] = useState([]);
//   const [genres, setGenres] = useState([]);
//   const [watchlist, setWatchlist] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // filtros de catálogo
//   const [search, setSearch] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState("");
//   const [filterAge, setFilterAge] = useState("All");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const profile = JSON.parse(localStorage.getItem("selectedProfile")) || {};

//   // 1) Carga de géneros una vez
//   useEffect(() => {
//     axios.get("/genres")
//       .then(res => setGenres(res.data.genres))
//       .catch(() => toast.error("No se pudieron cargar los géneros"));
//   }, []);

//   // 2) Carga de películas & watchlist al cambiar filtros o página
//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const { data: mv } = await axios.get("/movies", {
//           params: {
//             search: search || undefined,
//             page,
//             genre: selectedGenre || undefined,
//           },
//         });

//         // normalizamos y convertimos géneros a nombres
//         const normalized = mv.movies.map(m => {
//           const id = m.id || m._id;
//           return {
//             ...m,
//             id,
//             genres: mapGenreNames(m.genres, genres),
//           };
//         });

//         setMovies(normalized);
//         setTotalPages(mv.totalPages || 1);

//         // si hay perfil, cargamos watchlist
//         if (profile._id) {
//           const { data: fav } = await axios.get("/watchlist", {
//             params: { profileId: profile._id }
//           });
//           setWatchlist(fav.watchlist);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Error cargando catálogo o Favoritos");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [search, selectedGenre, page, profile._id, genres]);

//   // handlers de filtros/paginación
//   const handleSearchChange = e => { setSearch(e.target.value); setPage(1); };
//   const handleGenreChange = e => { setSelectedGenre(e.target.value); setPage(1); };
//   const handleAgeChange = e => setFilterAge(e.target.value);
//   const prevPage = () => page > 1 && setPage(p => p - 1);
//   const nextPage = () => page < totalPages && setPage(p => p + 1);

//   // toggle favorito
//   const toggleFav = async movie => {
//     if (!profile._id) return;
//     try {
//       if (watchlist.includes(movie.id)) {
//         await axios.delete(`/watchlist/${profile._id}/${movie.id}`);
//         setWatchlist(wl => wl.filter(id => id !== movie.id));
//       } else {
//         await axios.post("/watchlist", {
//           profileId: profile._id,
//           movieId: movie.id,
//         });
//         setWatchlist(wl => [...wl, movie.id]);
//       }
//     } catch {
//       toast.error("Error actualizando Favoritos");
//     }
//   };

//   // filtrado por edad de perfil y selector
//   const allowedAge = profile.type === "child"
//     ? Math.min(profile.age, 13)
//     : profile.age || Infinity;
//   const ageLimit = filterAge === "All" ? Infinity : parseInt(filterAge, 10);

//   const visible = movies
//     .filter(m => m.minAge <= allowedAge)
//     .filter(m => filterAge === "All" || m.minAge <= ageLimit);

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
//       {/* enlaces rápidos */}
//       <div className="flex flex-wrap items-center gap-4 mb-6">
//         <Link
//           to="/watchlist"
//           className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
//         >
//           <span>⭐</span><span>Favoritos</span>
//         </Link>
//         {user?.role === "admin" && (
//           <Link
//             to="/movies/crud"
//             className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
//           >
//             <span>🛠️</span><span>Administrar Películas</span>
//           </Link>
//         )}
//       </div>

//       <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
//         Catálogo de Películas
//       </h1>

//       {/* filtros */}
//       <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
//         <input
//           type="text"
//           value={search}
//           onChange={handleSearchChange}
//           placeholder="Buscar por título..."
//           className="w-full sm:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2 sm:mb-0"
//         />
//         <select
//           value={selectedGenre}
//           onChange={handleGenreChange}
//           className="w-full sm:w-1/4 px-4 py-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2 sm:mb-0"
//         >
//           <option value="">Todos los géneros</option>
//           {genres.map(g => (
//             <option key={g.id} value={g.id}>{g.name}</option>
//           ))}
//         </select>
//         <select
//           value={filterAge}
//           onChange={handleAgeChange}
//           className="w-full sm:w-1/5 px-4 py-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
//         >
//           <option value="All">Todas las edades</option>
//           {[0, 7, 13, 16, 18].map(a => (
//             <option key={a} value={a}>{a}+</option>
//           ))}
//         </select>
//       </div>

//       {/* contenido */}
//       {loading ? (
//         <div className="flex justify-center">
//           <span className="text-xl text-gray-800 dark:text-gray-100">Cargando…</span>
//         </div>
//       ) : visible.length === 0 ? (
//         <p className="text-gray-700 dark:text-gray-300">No hay películas que mostrar.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {visible.map(movie => (
//             <MovieCard
//               key={movie.id}
//               movie={movie}
//               profile={profile}
//               isInWatchlist={watchlist.includes(movie.id)}
//               onToggleWatchlist={toggleFav}
//             />
//           ))}
//         </div>
//       )}

//       {/* paginación */}
//       <div className="flex justify-center items-center space-x-4 mt-6">
//         <button
//           onClick={prevPage}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded disabled:opacity-50 transition"
//         >
//           Anterior
//         </button>
//         <span className="text-gray-800 dark:text-gray-100">
//           Página {page} / {totalPages}
//         </span>
//         <button
//           onClick={nextPage}
//           disabled={page === totalPages}
//           className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded disabled:opacity-50 transition"
//         >
//           Siguiente
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import axios from "../api/axios"
import MovieCard from "../components/MovieCard"
import { toast } from "react-toastify"
import { AuthContext } from "../context/AuthContext"

function mapGenreNames(ids = [], genresList = []) {
  return ids
    .map(id => genresList.find(g => g.id === id)?.name)
    .filter(Boolean)
}

export default function Movies() {
  const { user } = useContext(AuthContext)
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [filterAge, setFilterAge] = useState("All")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const profile = JSON.parse(localStorage.getItem("selectedProfile")) || {}

  useEffect(() => {
    axios.get("/genres")
      .then(res => setGenres(res.data.genres))
      .catch(() => toast.error("No se pudieron cargar los géneros"))
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const { data: mv } = await axios.get("/movies", {
          params: {
            search: search || undefined,
            page,
            genre: selectedGenre || undefined,
          },
        })

        const normalized = mv.movies.map(m => {
          const id = m.id || m._id
          return {
            ...m,
            id,
            genres: mapGenreNames(m.genres, genres),
          }
        })

        setMovies(normalized)
        setTotalPages(mv.totalPages || 1)

        if (profile._id) {
          const { data: fav } = await axios.get("/watchlist", {
            params: { profileId: profile._id }
          })
          setWatchlist(fav.watchlist)
        }
      } catch (err) {
        console.error(err)
        toast.error("Error cargando catálogo o Favoritos")
      } finally {
        setLoading(false)
      }
    }

    if (genres.length > 0) {
      fetchAll()
    }
  }, [search, selectedGenre, page, profile._id, genres])

  const handleSearchChange = e => { setSearch(e.target.value); setPage(1) }
  const handleGenreChange = e => { setSelectedGenre(e.target.value); setPage(1) }
  const handleAgeChange = e => setFilterAge(e.target.value)
  const prevPage = () => page > 1 && setPage(p => p - 1)
  const nextPage = () => page < totalPages && setPage(p => p + 1)

  const toggleFav = async movie => {
    if (!profile._id) return
    try {
      if (watchlist.includes(movie.id)) {
        await axios.delete(`/watchlist/${profile._id}/${movie.id}`)
        setWatchlist(wl => wl.filter(id => id !== movie.id))
      } else {
        await axios.post("/watchlist", {
          profileId: profile._id,
          movieId: movie.id,
        })
        setWatchlist(wl => [...wl, movie.id])
      }
    } catch {
      toast.error("Error actualizando Favoritos")
    }
  }

  const allowedAge = profile.type === "child"
    ? Math.min(profile.age, 13)
    : profile.age || Infinity
  const ageLimit = filterAge === "All" ? Infinity : parseInt(filterAge, 10)

  const visible = movies
    .filter(m => m.minAge <= allowedAge)
    .filter(m => filterAge === "All" || m.minAge <= ageLimit)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Link
          to="/watchlist"
          className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
        >
          <span>⭐</span><span>Favoritos</span>
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/movies/crud"
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            <span>🛠️</span><span>Administrar Películas</span>
          </Link>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Catálogo de Películas
      </h1>

      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por título..."
          className="w-full sm:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2 sm:mb-0"
        />
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="w-full sm:w-1/4 px-4 py-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2 sm:mb-0"
        >
          <option value="">Todos los géneros</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <select
          value={filterAge}
          onChange={handleAgeChange}
          className="w-full sm:w-1/5 px-4 py-2 border rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="All">Todas las edades</option>
          {[0, 7, 13, 16, 18].map(a => (
            <option key={a} value={a}>{a}+</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <span className="text-xl text-gray-800 dark:text-gray-100">Cargando…</span>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No hay películas que mostrar.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visible.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              profile={profile}
              isInWatchlist={watchlist.includes(movie.id)}
              onToggleWatchlist={toggleFav}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded disabled:opacity-50 transition"
        >
          Anterior
        </button>
        <span className="text-gray-800 dark:text-gray-100">
          Página {page} / {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded disabled:opacity-50 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
