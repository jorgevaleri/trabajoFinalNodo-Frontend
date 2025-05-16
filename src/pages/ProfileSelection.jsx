// src/pages/ProfileSelection.jsx
import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ProfileContext } from '../context/ProfileContext';

export default function ProfileSelection() {
  const { user } = useContext(AuthContext);
  const { chooseProfile } = useContext(ProfileContext);
  const [profiles, setProfiles] = useState([]);

  // Base URL de tu backend (quitamos /api)
  const BACKEND_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

  useEffect(() => {
    axios.get('/profiles')
      .then(({ data }) => {
        // normalizamos respuesta
        const list = Array.isArray(data) ? data : data.profiles || [];
        setProfiles(list);
      })
      .catch(err => console.error('Error cargando perfiles:', err));
  }, []);

  // Nombre antes de la @
  const username = user.email.split('@')[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Hola, <span className="capitalize">{username}</span>! Elige un perfil
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {profiles.map(p => {
          // calculamos la ruta de la imagen
          let imgSrc = p.avatar || '';
          if (!imgSrc.startsWith('http')) {
            imgSrc = imgSrc.startsWith('/')
              ? `${BACKEND_BASE}${imgSrc}`
              : `${BACKEND_BASE}/profile-images/${imgSrc}`;
          }

          return (
            <div
              key={p._id}
              onClick={() => chooseProfile(p)}
              className="text-center cursor-pointer"
            >
              <img
                src={imgSrc}
                alt={p.name}
                onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-2 border-4 border-gray-200 hover:border-blue-400 transition"
              />
              <h2 className="text-lg font-medium capitalize">{p.name}</h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = '/profiles/admin'}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded transition"
        >
          Administrar perfiles
        </button>
      </div>
    </div>
  );
}
