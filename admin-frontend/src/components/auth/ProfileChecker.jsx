
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

// Este componente se asegura de que el usuario tenga un perfil completo.
// Si no lo tiene, lo redirige a la página para completar el perfil.
// Si lo tiene, muestra el contenido protegido (el Layout principal).
const ProfileChecker = () => {
  const { profileExists, loading, user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  console.log('[ProfileChecker] Estado actual:', {
    profileExists,
    loading,
    user: user ? 'Presente' : 'Ausente',
    isReady,
    currentPath: window.location.pathname
  });

  // Delay para asegurar que todos los contextos estén listos
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('[ProfileChecker] ✅ Listo para renderizar');
      setIsReady(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Forzar re-render cuando profileExists cambie
  useEffect(() => {
    if (profileExists === true && !loading) {
      console.log('[ProfileChecker] 🔄 ProfileExists cambió a true, forzando re-render');
      // Pequeño delay para asegurar que el estado esté completamente actualizado
      setTimeout(() => {
        // En lugar de reload, forzar un re-render del componente
        setIsReady(false);
        setTimeout(() => setIsReady(true), 50);
      }, 100);
    }
  }, [profileExists, loading]);

  // Si está cargando o no está listo, mostrar loading
  if (loading || !isReady) {
    console.log('[ProfileChecker] 🔄 Mostrando loading:', { loading, isReady });
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no debería llegar aquí (ProtectedRoute debería manejar esto)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si profileExists es false, redirigir a complete-profile
  if (profileExists === false) {
    console.log('[ProfileChecker] 🔄 profileExists es false, redirigiendo a /complete-profile');
    return <Navigate to="/complete-profile" replace />;
  }

  // Si profileExists es true, mostrar el contenido protegido
  if (profileExists === true) {
    console.log('[ProfileChecker] ✅ Renderizando contenido protegido');
    // Si estamos en /complete-profile pero el perfil existe, redirigir a la página principal
    if (window.location.pathname === '/complete-profile') {
      console.log('[ProfileChecker] 🔄 Redirigiendo de /complete-profile a /');
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  // Si profileExists es undefined/null, seguir cargando
  console.log('[ProfileChecker] 🔄 profileExists es null/undefined, mostrando loading');
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando perfil...</p>
      </div>
    </div>
  );
};

export default ProfileChecker;
