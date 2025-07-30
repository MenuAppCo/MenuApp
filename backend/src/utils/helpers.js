const crypto = require('crypto');
const slugify = require('slugify');

// Generar slug único para restaurantes
function generateSlug(name) {
  const baseSlug = slugify(name, { 
    lower: true, 
    strict: true,
    locale: 'es'
  });
  
  // Agregar timestamp para hacerlo único
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

// Generar token aleatorio
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar contraseña (mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número)
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// Formatear precio
function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(price);
}

// Obtener información del dispositivo desde User-Agent
function getDeviceInfo(userAgent) {
  if (!userAgent) return { type: 'DESKTOP', browser: 'Unknown' };

  const ua = userAgent.toLowerCase();
  
  // Detectar dispositivo
  let deviceType = 'DESKTOP';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'MOBILE';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'TABLET';
  }

  // Detectar navegador
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';

  return { type: deviceType, browser };
}

// Obtener IP del cliente
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// Paginación
function getPagination(page = 1, limit = 10) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  return { offset, limit: limitNum, page: pageNum };
}

// Respuesta de error estandarizada
function errorResponse(message, statusCode = 400, details = null) {
  return {
    success: false,
    error: {
      message,
      statusCode,
      details
    },
    timestamp: new Date().toISOString()
  };
}

// Respuesta de éxito estandarizada
function successResponse(data, message = 'Operación exitosa', statusCode = 200) {
  return {
    success: true,
    data,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };
}

// Sanitizar string (remover caracteres especiales)
function sanitizeString(str) {
  if (!str) return '';
  return str.replace(/[<>]/g, '').trim();
}

// Validar URL
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Generar código QR para menú
function generateQRCode(restaurantSlug) {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  return `${baseUrl}/${restaurantSlug}`;
}

// Calcular tiempo de sesión
function calculateSessionDuration(startTime) {
  const endTime = Date.now();
  return Math.floor((endTime - startTime) / 1000); // en segundos
}

// Obtener idioma del navegador
function getBrowserLanguage(req) {
  const acceptLanguage = req.headers['accept-language'];
  if (!acceptLanguage) return 'ES';
  
  const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
  const preferredLang = languages[0]?.toLowerCase();
  
  if (preferredLang?.startsWith('en')) return 'EN';
  return 'ES';
}

module.exports = {
  generateSlug,
  generateToken,
  isValidEmail,
  isValidPassword,
  formatPrice,
  getDeviceInfo,
  getClientIP,
  getPagination,
  errorResponse,
  successResponse,
  sanitizeString,
  isValidURL,
  generateQRCode,
  calculateSessionDuration,
  getBrowserLanguage
}; 