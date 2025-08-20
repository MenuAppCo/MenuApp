const multer = require('multer');
const path = require('path');
const { UPLOAD } = require('../utils/constants');
const { getS3Url, getS3Key } = require('../config/s3');

const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  // Verificar tipo de archivo
  if (!UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)'), false);
  }
  
  // Verificar tamaño del archivo
  if (file.size > UPLOAD.MAX_FILE_SIZE) {
    return cb(new Error('Archivo demasiado grande. Máximo 5MB'), false);
  }
  
  cb(null, true);
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
    files: 1 // Solo un archivo por vez
  }
});

// Middleware para diferentes tipos de upload
const uploadImage = (type = 'general') => {
  return (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: {
              message: 'Archivo demasiado grande. Máximo 5MB',
              statusCode: 400
            }
          });
        }
        return res.status(400).json({
          success: false,
          error: {
            message: 'Error al subir el archivo',
            statusCode: 400
          }
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: {
            message: err.message,
            statusCode: 400
          }
        });
      }
      
      // Verificar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No se proporcionó ningún archivo',
            statusCode: 400
          }
        });
      }
      
      // Generar nombre único para el archivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(req.file.originalname);
      const filename = `${req.file.fieldname}-${uniqueSuffix}${ext}`;
      
      // Agregar información del archivo al request
      req.uploadedFile = {
        filename: filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer, // Contenido del archivo en memoria
        url: `/uploads/${type}/${filename}`,
        s3Key: getS3Key(type, filename),
        s3Url: getS3Url(getS3Key(type, filename))
      };
      
      next();
    });
  };
};

// Middleware específico para diferentes tipos
const uploadProductImage = uploadImage('products');
const uploadCategoryImage = uploadImage('categories');
const uploadRestaurantLogo = uploadImage('restaurants');

// Middleware específico para logo del restaurante con campo 'logo'
const uploadRestaurantLogoField = (req, res, next) => {
  console.log('🔄 Procesando upload de logo del restaurante...')
  
  upload.single('logo')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log('❌ Error de Multer:', err.code)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Archivo demasiado grande. Máximo 5MB',
            statusCode: 400
          }
        });
      }
      return res.status(400).json({
        success: false,
        error: {
          message: 'Error al subir el archivo',
          statusCode: 400
        }
      });
    } else if (err) {
      console.log('❌ Error general:', err.message)
      return res.status(400).json({
        success: false,
        error: {
          message: err.message,
          statusCode: 400
        }
      });
    }
    
    // Verificar que se subió un archivo
    if (!req.file) {
      console.log('❌ No se encontró archivo en req.file')
      return res.status(400).json({
        success: false,
        error: {
          message: 'No se proporcionó ningún archivo',
          statusCode: 400
        }
      });
    }
    
    console.log('✅ Archivo recibido:', req.file.originalname)
    
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `logo-${uniqueSuffix}${ext}`;
    
    // Agregar información del archivo al request
    req.uploadedFile = {
      filename: filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer, // Contenido del archivo en memoria
      url: `/uploads/restaurants/${filename}`,
      s3Key: getS3Key('restaurants', filename),
      s3Url: getS3Url(getS3Key('restaurants', filename))
    };
    
    console.log('✅ Archivo procesado, URL:', req.uploadedFile.url)
    next();
  });
};

module.exports = {
  uploadImage,
  uploadProductImage,
  uploadCategoryImage,
  uploadRestaurantLogo,
  uploadRestaurantLogoField
}; 