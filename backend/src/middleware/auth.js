const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { errorResponse } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 authenticateToken called for:', req.method, req.path);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔑 Token present:', !!token);

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json(errorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Token decoded, restaurant ID:', decoded.restaurantId);
    
    // Buscar restaurante en la base de datos
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: decoded.restaurantId },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        isActive: true,
        planType: true,
        planExpiresAt: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true
      }
    });

    console.log('🏪 Restaurant found:', !!restaurant, restaurant?.name);

    if (!restaurant) {
      console.log('❌ Restaurant not found');
      return res.status(401).json(errorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    if (!restaurant.isActive) {
      return res.status(403).json(errorResponse('Restaurante inactivo', 403));
    }

    // Verificar si el plan ha expirado
    if (restaurant.planExpiresAt && new Date() > restaurant.planExpiresAt) {
      return res.status(403).json(errorResponse('Plan de suscripción expirado', 403));
    }

    // Agregar información del restaurante al request
    req.restaurant = restaurant;
    console.log('✅ Authentication successful, restaurant ID:', restaurant.id);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(errorResponse('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(errorResponse('Token expirado', 401));
    }
    
    console.error('Error en autenticación:', error);
    return res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Middleware opcional para autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: decoded.restaurantId },
        select: {
          id: true,
          name: true,
          email: true,
          slug: true,
          isActive: true,
          planType: true
        }
      });

      if (restaurant && restaurant.isActive) {
        req.restaurant = restaurant;
      }
    }
    
    next();
  } catch (error) {
    // Si hay error en el token, simplemente continuamos sin autenticación
    next();
  }
};

// Middleware para verificar permisos de plan
const checkPlanPermission = (requiredPlan = 'FREE') => {
  return (req, res, next) => {
    const planHierarchy = {
      'FREE': 0,
      'BASIC': 1,
      'PROFESSIONAL': 2,
      'ENTERPRISE': 3
    };

    const userPlan = req.restaurant?.planType || 'FREE';
    const userPlanLevel = planHierarchy[userPlan];
    const requiredPlanLevel = planHierarchy[requiredPlan];

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json(errorResponse(
        `Esta función requiere el plan ${requiredPlan} o superior`, 
        403
      ));
    }

    next();
  };
};

// Middleware para verificar límites del plan
const checkPlanLimits = (resourceType) => {
  return async (req, res, next) => {
    try {
      const restaurant = req.restaurant;
      const { PLANS } = require('../utils/constants');
      
      const plan = PLANS[restaurant.planType];
      
      if (resourceType === 'products') {
        const productCount = await prisma.product.count({
          where: { restaurantId: restaurant.id }
        });
        
        if (plan.maxProducts !== -1 && productCount >= plan.maxProducts) {
          return res.status(403).json(errorResponse(
            `Límite de productos alcanzado para el plan ${restaurant.planType}`, 
            403
          ));
        }
      }
      
      next();
    } catch (error) {
      console.error('Error verificando límites del plan:', error);
      next();
    }
  };
};

// Generar token JWT
const generateToken = (restaurantId) => {
  return jwt.sign(
    { restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  authenticateToken,
  optionalAuth,
  checkPlanPermission,
  checkPlanLimits,
  generateToken
}; 