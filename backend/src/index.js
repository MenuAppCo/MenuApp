require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const serverlessExpress = require('@codegenie/serverless-express')
const { connectDB } = require('./config/database');

// Importar rutas
const routes = require('./routes');

// Crear aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    },
  },
}));

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite por IP
  message: {
    success: false,
    error: {
      message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde',
      statusCode: 429
    }
  }
});
app.use(limiter);

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Compresión
app.use(compression());

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 año
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MenuApp API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint para verificar imágenes
app.get('/test-image', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint for images',
    uploadsPath: '/uploads',
    exampleUrl: '/uploads/products/image-123-processed.webp'
  });
});

// Rutas de la API
app.use('/api', routes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Ruta no encontrada',
      statusCode: 404
    }
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message || 'Error interno del servidor',
      statusCode: error.status || 500,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

// Manejo de señales para cerrar el servidor
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

exports.handler = serverlessExpress({ app })

module.exports = app; 