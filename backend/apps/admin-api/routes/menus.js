const express = require('express');
const {
  getMenus,
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  reorderMenus
} = require('../../../src/controllers/menuController');

const router = express.Router();

router.get('/', getMenus);
router.post('/', createMenu);
router.put('/reorder', reorderMenus);
router.get('/:menuId', getMenu);
router.put('/:menuId', updateMenu);
router.delete('/:menuId', deleteMenu);

module.exports = router; 