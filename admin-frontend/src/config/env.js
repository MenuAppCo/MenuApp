// Configuración de variables de entorno
export const config = {
  // URL del frontend público (menú para clientes)
  publicFrontendUrl: import.meta.env.VITE_PUBLIC_FRONTEND_URL || 'http://localhost:5174',
  
  // URL del backend API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Configuración de Supabase
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Determinar si estamos en desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Determinar si estamos en producción
  isProduction: import.meta.env.PROD,
};

// Función helper para construir URLs del menú público
export const buildPublicMenuUrl = (restaurantSlug) => {
  if (!restaurantSlug) return '';
  return `${config.publicFrontendUrl}/restaurant/${restaurantSlug}`;
}; 