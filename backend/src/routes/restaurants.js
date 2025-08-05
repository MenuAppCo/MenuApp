const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')

const restaurantController = require('../controllers/restaurantController')

// Log para debuggear
console.log('🔧 Registrando rutas de restaurantes...')

// IMPORTANTE: Esta ruta va primero y está protegida individualmente.
router.post('/initialize', authMiddleware, restaurantController.initializeRestaurant);

// El resto de las rutas también usan el middleware.
router.use(authMiddleware)

// Obtener información del restaurante del usuario autenticado
router.get('/me', restaurantController.getMyRestaurant)

// Actualizar información del restaurante
router.put('/me', restaurantController.updateMyRestaurant)

// Obtener configuración del restaurante
router.get('/me/settings', restaurantController.getMySettings)

// Actualizar configuración del restaurante
router.put('/me/settings', restaurantController.updateMySettings)

// Obtener redes sociales del restaurante
router.get('/me/social-media', restaurantController.getMySocialMedia)

// Actualizar redes sociales del restaurante
router.put('/me/social-media', restaurantController.updateMySocialMedia)

console.log('✅ Rutas de restaurantes registradas')

module.exports = router