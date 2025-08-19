const AWS = require('aws-sdk');
const config = require('./environment');

// Configurar AWS SDK
const s3Config = {
  region: config.AWS_REGION,
  ...(config.isDevelopment() && {
    // Solo en desarrollo usar credenciales explícitas
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  })
  // En producción (Lambda), usar credenciales del rol IAM automáticamente
};

// Validar que el bucket esté configurado
if (!config.S3_BUCKET_NAME) {
  console.warn('⚠️ S3_BUCKET_NAME no configurado, usando valor por defecto: production-menapp-images');
}

// Crear cliente S3
const s3 = new AWS.S3(s3Config);

// Configuración del bucket
const S3_CONFIG = {
  bucket: config.S3_BUCKET_NAME,
  region: config.AWS_REGION,
  // URLs base para diferentes tipos de contenido
  baseUrls: {
    products: 'products',
    categories: 'categories', 
    restaurants: 'restaurants',
    processed: 'processed',
    sizes: 'sizes'
  }
};

// Función para generar URL completa de S3
const getS3Url = (key) => {
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
};

// Función para generar key de S3
const getS3Key = (type, filename) => {
  return `${S3_CONFIG.baseUrls[type]}/${filename}`;
};

module.exports = {
  s3,
  S3_CONFIG,
  getS3Url,
  getS3Key
};
