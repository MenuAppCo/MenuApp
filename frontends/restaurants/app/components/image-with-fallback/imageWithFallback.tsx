import { useState } from "react";
import { getImageUrl, getOptimizedImageUrl } from "../../utils/imageUtils";

export default function ImageWithFallback({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO fix
  src,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO fix
  alt,
  className = "",
  size = "medium",
  fallbackSrc = null,
  ...props
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // Si hay error y hay fallback, usar fallback
  if (error && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  // Si hay error y no hay fallback, mostrar placeholder
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-xs">Sin imagen</span>
      </div>
    );
  }

  // Construir URL de imagen
  let imageUrl;
  if (size === "original") {
    imageUrl = getImageUrl(src);
  } else if (size) {
    imageUrl = getOptimizedImageUrl(src, size);
  } else {
    imageUrl = getImageUrl(src);
  }

  return (
    <img
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore TODO fix
      src={imageUrl}
      alt={alt}
      className={`${loading ? "animate-pulse bg-gray-200" : ""} ${className}`}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}
