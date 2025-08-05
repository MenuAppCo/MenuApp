import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// Función para establecer el token JWT en las cabeceras de Axios
export const setAuthToken = (token) => {
  if (token) {
    // Aplicar el token de autorización a cada petición si el usuario está logueado
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Eliminar el header si no hay token (logout)
    delete api.defaults.headers.common['Authorization'];
  }
};

// Puedes añadir interceptores para manejar errores de forma global si quieres
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Opcional: Manejar la expiración del token, por ejemplo, deslogueando al usuario.
      // Esto es menos común con Supabase ya que la librería gestiona la renovación del token.
      console.error("Unauthorized request - token might be expired.");
    }
    return Promise.reject(error);
  }
);

export default api;