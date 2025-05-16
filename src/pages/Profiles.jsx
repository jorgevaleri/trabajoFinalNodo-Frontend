// src/pages/Profiles.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import ProfileSelector from '../components/ProfileSelector';
import { toast } from 'react-toastify';

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);   // siempre un array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await axios.get('/profiles');
        const payload = response.data;
        // Si tu API devuelve { profiles: [...] } o devuelve directamente [...]
        const list = Array.isArray(payload.profiles)
          ? payload.profiles
          : Array.isArray(payload)
          ? payload
          : [];
        setProfiles(list);
      } catch (err) {
        console.error(err);
        toast.error('Error cargando perfiles');
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const handleSelect = (profile) => {
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
    navigate('/movies');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl">Cargando perfiles...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Elige un perfil
      </h1>

      {profiles.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No hay perfiles disponibles.
        </p>
      ) : (
        <div className="flex flex-wrap justify-start">
          {profiles.map((p) => (
            <ProfileSelector
              key={p._id || p.id}
              profile={p}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
