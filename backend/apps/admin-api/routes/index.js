
const express = require('express');
const categoryRoutes = require('./categories');
const menuRoutes = require('./menus');
const productRoutes = require('./products');
const restaurantRoutes = require('./restaurants');
const uploadRoutes = require('./uploads');
const userRoutes = require('./users');

const router = express.Router();

router.use('/categories', categoryRoutes);
router.use('/menus', menuRoutes);
router.use('/products', productRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);

module.exports = router;
