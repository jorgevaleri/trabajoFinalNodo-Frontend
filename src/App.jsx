// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProfileProvider, ProfileContext } from './context/ProfileContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSelection from './pages/ProfileSelection';
import AdminProfiles from './pages/AdminProfiles';
import Movies from './pages/Movies';
import Watchlist from './pages/Watchlist';
import Users from './pages/Users';          // <-- tu página de Usuarios
import AdminMovies from './pages/AdminMovies'; // <-- CRUD películas

function AuthGuard({ children }) {
  const { user, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function ProfileGuard({ children }) {
  const { profile } = useContext(ProfileContext);
  return profile ? children : <Navigate to="/profiles" replace />;
}

function AdminGuard({ children }) {
  const { user, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) return null;
  return user.role === 'admin'
    ? children
    : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Navbar />

        <Routes>
          {/* RUTAS PUBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* REQUIERE LOGIN PERO NO PERFIL */}
          <Route
            path="/profiles"
            element={
              <AuthGuard>
                <ProfileSelection />
              </AuthGuard>
            }
          />
          <Route
            path="/profiles/admin"
            element={
              <AuthGuard>
                <AdminProfiles />
              </AuthGuard>
            }
          />

          {/* CRUD USUARIOS */}
          <Route
            path="/users"
            element={
              <AuthGuard>
                <AdminGuard>
                  <Users />
                </AdminGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/users/me"
            element={
              <AuthGuard>
                <Users />
              </AuthGuard>
            }
          />

          {/* CRUD PELICULAS (SOLO ADMIN) */}
          {/* <Route
            path="/admin/movies"
            element={
              <AuthGuard>
                <ProfileGuard>
                  <AdminGuard>
                    <AdminMovies />
                  </AdminGuard>
                </ProfileGuard>
              </AuthGuard>
            }
          /> */}
          
          <Route
            path="/movies/crud"
            element={
              <AuthGuard>
                <AdminGuard>
                  <AdminMovies />
                </AdminGuard>
              </AuthGuard>
            }
          />

          {/* REQUIERE PERFIL */}
          <Route
            path="/movies"
            element={
              <AuthGuard>
                <ProfileGuard>
                  <Movies />
                </ProfileGuard>
              </AuthGuard>
            }
          />
          <Route
            path="/watchlist"
            element={
              <AuthGuard>
                <ProfileGuard>
                  <Watchlist />
                </ProfileGuard>
              </AuthGuard>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ProfileProvider>
    </AuthProvider>
  );
}