import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // Si el usuario ya está autenticado, lo redirigimos a la página principal.
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, le mostramos la ruta pública (ej. Login).
  return children;
};

export default PublicRoute;