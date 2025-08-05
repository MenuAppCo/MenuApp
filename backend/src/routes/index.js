
const express = require('express');
const router = express.Router();

// Importaciones de todas las rutas
const authRoutes = require('./auth');
const categoryRoutes = require('./categories');
const menuRoutes = require('./menus');
const productRoutes = require('./products');
const publicRoutes = require('./public');
const restaurantRoutes = require('./restaurants');
const uploadRoutes = require('./uploads');
const userRoutes = require('./users'); // <-- AÑADIDO

// Uso de las rutas
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/menus', menuRoutes);
router.use('/products', productRoutes);
router.use('/public', publicRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes); // <-- AÑADIDO

module.exports = router;
