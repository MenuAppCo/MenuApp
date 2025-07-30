const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMenus,
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  reorderMenus
} = require('../controllers/menuController');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los menús del restaurante
router.get('/', getMenus);

// Crear nuevo menú
router.post('/', createMenu);

// Reordenar menús
router.put('/reorder', reorderMenus);

// Obtener menú específico
router.get('/:menuId', getMenu);

// Actualizar menú
router.put('/:menuId', updateMenu);

// Eliminar menú
router.delete('/:menuId', deleteMenu);

module.exports = router; 