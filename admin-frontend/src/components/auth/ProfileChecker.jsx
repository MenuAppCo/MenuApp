
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Este componente se asegura de que el usuario tenga un perfil completo.
// Si no lo tiene, lo redirige a la página para completar el perfil.
// Si lo tiene, muestra el contenido protegido (el Layout principal).
const ProfileChecker = () => {
  const { profileExists, loading } = useAuth();

  if (loading) {
    return <div>Verificando perfil...</div>; // O un spinner
  }

  if (!profileExists) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />; // Outlet renderiza las rutas hijas (Dashboard, etc.)
};

export default ProfileChecker;
