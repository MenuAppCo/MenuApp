// Función helper para construir URLs de imágenes de manera consistente
export const buildImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = import.meta.env.VITE_MEDIA_URL || 'media.menapp.co';
  
  // Asegurar que baseUrl termine con "/" para evitar problemas de concatenación
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  // Asegurar que la ruta no tenga "/" al inicio para evitar doble slash
  const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `https://${normalizedBaseUrl}${normalizedPath}`;
};

// Función para obtener la URL completa de una imagen
export const getImageUrl = (imagePath) => {
  return buildImageUrl(imagePath);
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