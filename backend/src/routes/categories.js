const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.put('/reorder', reorderCategories);

module.exports = router; 