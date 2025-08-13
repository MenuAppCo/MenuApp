const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  toggleProductFeatured
} = require('../../../src/controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/visibility', toggleProductVisibility);
router.patch('/:id/featured', toggleProductFeatured);

module.exports = router; 