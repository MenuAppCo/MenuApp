const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  toggleProductFeatured
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/visibility', toggleProductVisibility);
router.patch('/:id/featured', toggleProductFeatured);

module.exports = router; 