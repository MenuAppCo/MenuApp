// Función helper para construir URLs de imágenes de manera consistente
export function buildImageUrl(imagePath: string): string | null {
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
  
  // Detectar si la imagen tiene sufijo de tamaño (thumbnail, medium, large)
  // Si es así, debe ir en la carpeta /sizes
  if (normalizedPath.includes('-thumbnail') || normalizedPath.includes('-medium') || normalizedPath.includes('-large')) {
    // Extraer solo el nombre del archivo con sufijo
    const filename = normalizedPath.split('/').pop();
    
    if (filename === undefined) return null;

    // Remover el sufijo '-processed' si existe, manteniendo solo el sufijo de tamaño
    const cleanFilename = filename.replace('-processed-', '-');

    return `https://${normalizedBaseUrl}sizes/${cleanFilename}`;
  }
  
  return `https://${normalizedBaseUrl}${normalizedPath}`;
};

// Función para obtener la URL completa de una imagen
export function getImageUrl(imagePath:string) : string | null  {
  return buildImageUrl(imagePath);
};

// Función para obtener URL de imagen optimizada
export function getOptimizedImageUrl(imagePath:string, size = 'medium'): string | null {
  if (!imagePath) return null;
  
  const baseUrl = import.meta.env.VITE_MEDIA_URL || 'media.menapp.co';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  // Si la imagen ya tiene un sufijo de tamaño, no agregar otro
  if (imagePath.includes('-thumbnail') || imagePath.includes('-medium') || imagePath.includes('-large')) {
    return buildImageUrl(imagePath);
  }
  
  // Extraer el nombre base del archivo (sin extensión)
  const pathParts = imagePath.split('/');
  const filename = pathParts.pop();

  if (filename === undefined) return null;

  // Remover el sufijo '-processed' si existe
  const baseName = filename.replace(/\.[^/.]+$/, '').replace('-processed', '');
  
  // Construir la URL para la imagen optimizada en la carpeta /sizes
  return `https://${normalizedBaseUrl}sizes/${baseName}-${size}.webp`;
}; 