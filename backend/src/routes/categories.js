const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = require('../controllers/categoryController');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las categorías
router.get('/', getCategories);

// Obtener una categoría específica
router.get('/:id', getCategory);

// Crear nueva categoría
router.post('/', createCategory);

// Actualizar categoría
router.put('/:id', updateCategory);

// Eliminar categoría
router.delete('/:id', deleteCategory);

// Reordenar categorías
router.put('/reorder', reorderCategories);

module.exports = router; 