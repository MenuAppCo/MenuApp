const express = require('express');
const router = express.Router();
const { getPublicMenu, getRestaurantInfo, getRestaurantMenus } = require('../controllers/publicMenuController');

// Ruta para obtener información básica del restaurante (para QR)
router.get('/restaurant/:slug', getRestaurantInfo);

// Ruta para obtener menús disponibles del restaurante
router.get('/restaurant/:slug/menus', getRestaurantMenus);

// Ruta para obtener el menú público por tipo
router.get('/menu/:slug/:menuType', getPublicMenu);

module.exports = router; 