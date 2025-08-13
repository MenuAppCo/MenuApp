const express = require('express');
const { getPublicMenu, getRestaurantInfo, getRestaurantMenus } = require('../../../src/controllers/publicMenuController');

const router = express.Router();

router.get('/restaurant/:slug', getRestaurantInfo);
router.get('/restaurant/:slug/menus', getRestaurantMenus);
router.get('/menu/:slug/:menuType', getPublicMenu);

module.exports = router; 