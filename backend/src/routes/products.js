const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  toggleProductFeatured
} = require('../controllers/productController');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los productos
router.get('/', getProducts);

// Obtener un producto específico
router.get('/:id', getProduct);

// Crear nuevo producto
router.post('/', createProduct);

// Actualizar producto
router.put('/:id', updateProduct);

// Eliminar producto
router.delete('/:id', deleteProduct);

// Cambiar visibilidad del producto
router.patch('/:id/visibility', toggleProductVisibility);

// Cambiar estado destacado del producto
router.patch('/:id/featured', toggleProductFeatured);

module.exports = router; 