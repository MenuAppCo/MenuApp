const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UPLOAD } = require('../utils/constants');

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Crear subdirectorios por tipo
    const type = req.params.type || 'general';
    const typeDir = path.join(uploadDir, type);
    
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

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
    // Agregar el tipo al request para que Multer lo use
    req.params.type = type;
    
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
      
      // Agregar información del archivo al request
      req.uploadedFile = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${type}/${req.file.filename}`
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
  
  // Agregar el tipo al request para que Multer lo use
  req.params.type = 'restaurants';
  
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
    
    console.log('✅ Archivo recibido:', req.file.filename)
    
    // Agregar información del archivo al request
    req.uploadedFile = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/restaurants/${req.file.filename}`
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