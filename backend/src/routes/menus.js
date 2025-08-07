const express = require('express');
const router = express.Router();
const {
  getMenus,
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  reorderMenus
} = require('../controllers/menuController');


router.get('/', getMenus);
router.post('/', createMenu);
router.put('/reorder', reorderMenus);
router.get('/:menuId', getMenu);
router.put('/:menuId', updateMenu);
router.delete('/:menuId', deleteMenu);

module.exports = router; 