// Función para obtener la URL completa de una imagen
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Si es una ruta relativa, construir la URL completa
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  // Remover /api del final si existe
  const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
  
  // Asegurar que la ruta comience con /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};

// Función para obtener URL de imagen optimizada
export const getOptimizedImageUrl = (imagePath, size = 'medium') => {
  if (!imagePath) return null;
  
  const baseUrl = getImageUrl(imagePath);
  if (!baseUrl) return null;
  
  // Si la imagen ya tiene un sufijo de tamaño, no agregar otro
  if (baseUrl.includes('-thumbnail') || baseUrl.includes('-medium') || baseUrl.includes('-large')) {
    return baseUrl;
  }
  
  // Agregar sufijo de tamaño
  const extension = baseUrl.split('.').pop();
  const baseWithoutExt = baseUrl.replace(`.${extension}`, '');
  
  return `${baseWithoutExt}-${size}.webp`;
}; 