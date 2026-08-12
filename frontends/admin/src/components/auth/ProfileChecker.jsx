import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Deja pasar al panel solo si el usuario tiene perfil. Si el backend confirma
// que no lo tiene, lo manda a completarlo.
//
// Importante: nunca se redirige al formulario mientras la respuesta no sea
// concluyente. Un fallo de red no significa "no tiene perfil", y tratarlo como
// tal es lo que hacía aparecer el formulario a quien ya lo había completado.
const ProfileChecker = () => {
  const { profileExists, profileError, refreshProfile, loading, user } = useAuth();

  if (loading) {
    return <Verificando />;
  }

  // No debería llegar aquí sin usuario, de eso se encarga ProtectedRoute.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profileError) {
    return <ErrorDeVerificacion onReintentar={refreshProfile} />;
  }

  if (profileExists === null) {
    return <Verificando />;
  }

  if (profileExists === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
};

const Verificando = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Verificando perfil...</p>
    </div>
  </div>
);

const ErrorDeVerificacion = ({ onReintentar }) => (
  <div className="flex items-center justify-center h-screen px-4">
    <div className="max-w-md w-full text-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">No pudimos verificar tu perfil</h2>
      <p className="text-gray-600">
        Comprueba tu conexión e inténtalo de nuevo. Tus datos siguen intactos.
      </p>
      <button onClick={onReintentar} className="btn-primary-static">
        Reintentar
      </button>
    </div>
  </div>
);

export default ProfileChecker;
