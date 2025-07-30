const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { uploadProductImage, uploadCategoryImage, uploadRestaurantLogo } = require('../middleware/upload');
const {
  uploadProductImage: uploadProductImageController,
  uploadCategoryImage: uploadCategoryImageController,
  uploadRestaurantLogo: uploadRestaurantLogoController,
  deleteImage
} = require('../controllers/uploadController');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Subir imagen de producto
router.post('/products/:productId', uploadProductImage, uploadProductImageController);

// Subir imagen de categoría
router.post('/categories/:categoryId', uploadCategoryImage, uploadCategoryImageController);

// Subir logo del restaurante
router.post('/restaurant/logo', uploadRestaurantLogo, uploadRestaurantLogoController);

// Eliminar logo del restaurante
router.delete('/restaurant/logo', (req, res) => {
  req.params.type = 'restaurant';
  req.params.id = req.restaurant.id;
  deleteImage(req, res);
});

// Eliminar imagen
router.delete('/:type/:id', deleteImage);

module.exports = router; 