const express = require('express');
const router = express.Router();
const { getPublicMenu, getRestaurantInfo, getRestaurantMenus } = require('../controllers/publicMenuController');

router.get('/restaurant/:slug', getRestaurantInfo);
router.get('/restaurant/:slug/menus', getRestaurantMenus);
router.get('/menu/:slug/:menuType', getPublicMenu);

module.exports = router; 