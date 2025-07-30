// Constantes de la aplicación
module.exports = {
  // Planes de suscripción
  PLANS: {
    FREE: {
      name: 'FREE',
      maxMenus: 1,
      maxProducts: 10,
      features: ['QR básico', 'Tema por defecto']
    },
    BASIC: {
      name: 'BASIC',
      maxMenus: 1,
      maxProducts: -1, // ilimitado
      features: ['QR personalizado', 'Temas', 'Analytics básicos']
    },
    PROFESSIONAL: {
      name: 'PROFESSIONAL',
      maxMenus: 3,
      maxProducts: -1,
      features: ['Múltiples menús', 'Personalización avanzada', 'Analytics completos']
    },
    ENTERPRISE: {
      name: 'ENTERPRISE',
      maxMenus: -1,
      maxProducts: -1,
      features: ['Menús ilimitados', 'API', 'Soporte prioritario']
    }
  },

  // Temas disponibles
  THEMES: {
    DEFAULT: {
      name: 'Default',
      primaryColor: '#1f2937',
      secondaryColor: '#f59e0b',
      fontFamily: 'Inter'
    },
    DARK: {
      name: 'Dark',
      primaryColor: '#111827',
      secondaryColor: '#10b981',
      fontFamily: 'Inter'
    },
    LIGHT: {
      name: 'Light',
      primaryColor: '#ffffff',
      secondaryColor: '#3b82f6',
      fontFamily: 'Inter'
    }
  },

  // Idiomas soportados
  LANGUAGES: {
    ES: {
      name: 'Español',
      code: 'ES',
      flag: '🇪🇸'
    },
    EN: {
      name: 'English',
      code: 'EN',
      flag: '🇺🇸'
    }
  },

  // Configuración de archivos
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    UPLOAD_PATH: 'uploads/',
    IMAGE_SIZES: {
      thumbnail: { width: 150, height: 150 },
      medium: { width: 400, height: 400 },
      large: { width: 800, height: 800 }
    }
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Configuración de rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
    MAX_REQUESTS: 100
  },

  // Configuración de JWT
  JWT: {
    EXPIRES_IN: '7d',
    REFRESH_EXPIRES_IN: '30d'
  },

  // Configuración de analytics
  ANALYTICS: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    TRACK_EVENTS: ['page_view', 'product_view', 'category_view']
  },

  // Mensajes de error
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION_ERROR: 'Error de validación',
    INTERNAL_ERROR: 'Error interno del servidor',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    EMAIL_EXISTS: 'El email ya está registrado',
    SLUG_EXISTS: 'El slug ya está en uso',
    PLAN_LIMIT_EXCEEDED: 'Límite del plan excedido'
  },

  // Mensajes de éxito
  SUCCESS_MESSAGES: {
    RESTAURANT_CREATED: 'Restaurante creado exitosamente',
    RESTAURANT_UPDATED: 'Restaurante actualizado exitosamente',
    RESTAURANT_DELETED: 'Restaurante eliminado exitosamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
    PASSWORD_UPDATED: 'Contraseña actualizada exitosamente'
  }
}; 