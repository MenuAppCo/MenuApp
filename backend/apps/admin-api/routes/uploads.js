const express = require('express');
const { uploadProductImage, uploadCategoryImage, uploadRestaurantLogo } = require('../../../src/middleware/upload');
const {
  uploadProductImage: uploadProductImageController,
  uploadCategoryImage: uploadCategoryImageController,
  uploadRestaurantLogo: uploadRestaurantLogoController,
  deleteImage
} = require('../../../src/controllers/uploadController');

const router = express.Router();

router.post('/products/:productId', uploadProductImage, uploadProductImageController);
router.post('/categories/:categoryId', uploadCategoryImage, uploadCategoryImageController);
router.post('/restaurant/logo', uploadRestaurantLogo, uploadRestaurantLogoController);
router.delete('/restaurant/logo', (req, res) => {
  req.params.type = 'restaurant';
  req.params.id = req.restaurant.id;
  deleteImage(req, res);
});
router.delete('/:type/:id', deleteImage);

module.exports = router; 