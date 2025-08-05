import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'; // Importa el contexto desde el nuevo archivo

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};