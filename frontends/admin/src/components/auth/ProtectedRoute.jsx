import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Usamos el objeto user directamente

  // Si no hay usuario, redirigimos a la página de login.
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si hay usuario, renderizamos el contenido protegido.
  return children
}

export default ProtectedRoute 