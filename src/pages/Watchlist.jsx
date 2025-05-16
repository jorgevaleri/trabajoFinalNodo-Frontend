// src/pages/Watchlist.jsx
import { useState, useEffect } from "react";
import axios from "../api/axios";
import MovieCard from "../components/MovieCard";
import { toast } from "react-toastify";

// Tu mapa estático de géneros
const genresMap = {
  28:    "Acción",
  12:    "Aventura",
  16:    "Animación",
  35:    "Comedia",
  80:    "Crimen",
  99:    "Documental",
  18:    "Drama",
  10751: "Familiar",
  14:    "Fantasía",
  36:    "Historia",
  27:    "Terror",
  10402: "Música",
  9648:  "Misterio",
  10749: "Romance",
  878:   "Ciencia Ficción",
  10770: "TV Movie",
  53:    "Suspenso",
  10752: "Guerra",
  37:    "Western",
};

// Convierte un array de IDs en un array de nombres usando `genresMap`
function mapGenreIdsToNames(ids = []) {
  return ids
    .map(id => genresMap[id])
    .filter(Boolean);
}

export default function Watchlist() {
  const [watchlistIds, setWatchlistIds]       = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading]                 = useState(true);

  const profile = JSON.parse(localStorage.getItem("selectedProfile")) || {};

  // 1) Cargo los IDs de favoritos
  useEffect(() => {
    if (!profile._id) {
      setLoading(false);
      return;
    }
    axios
      .get("/watchlist", { params: { profileId: profile._id } })
      .then(({ data }) => setWatchlistIds(data.watchlist))
      .catch(() => {
        toast.error("Error cargando Favoritos");
        setLoading(false);
      });
  }, [profile._id]);

  // 2) Con esos IDs, traigo los detalles uno a uno y mapeo géneros
  useEffect(() => {
    if (!watchlistIds.length) {
      setWatchlistMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      watchlistIds.map(id =>
        axios.get(`/movies/${id}`).then(res => {
          const m = res.data;
          return {
            ...m,
            id: m.id || m._id,
            // aquí aplico tu mapa estático
            genres: mapGenreIdsToNames(m.genres || []),
          };
        })
      )
    )
      .then(movies => setWatchlistMovies(movies))
      .catch(() => toast.error("Error cargando detalles de Favoritos"))
      .finally(() => setLoading(false));
  }, [watchlistIds]);

  // toggle desde favoritos
  const handleToggle = async movie => {
    if (!profile._id) return;
    try {
      if (watchlistIds.includes(movie.id)) {
        await axios.delete(`/watchlist/${profile._id}/${movie.id}`);
        setWatchlistIds(ids => ids.filter(i => i !== movie.id));
        setWatchlistMovies(ms => ms.filter(m => m.id !== movie.id));
        toast.info(`"${movie.title}" eliminado de Favoritos`);
      } else {
        await axios.post("/watchlist", {
          profileId: profile._id,
          movieId: movie.id,
        });
        setWatchlistIds(ids => [...ids, movie.id]);
        setWatchlistMovies(ms => [...ms, movie]);
        toast.success(`"${movie.title}" agregado a Favoritos`);
      }
    } catch {
      toast.error("Error actualizando Favoritos");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl text-gray-800 dark:text-gray-100">
          Cargando…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Mis Favoritos
      </h1>

      {watchlistMovies.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No tienes películas en Favoritos.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlistMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              profile={profile}
              isInWatchlist={true}
              onToggleWatchlist={() => handleToggle(movie)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
