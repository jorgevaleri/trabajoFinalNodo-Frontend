//frontend/src/routes/PrivateRoutes.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return user ? children : <Navigate to="/login" />;
}
