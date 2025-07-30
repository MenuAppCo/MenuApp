const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const uploadRoutes = require('./uploads');
const restaurantRoutes = require('./restaurants');
const menuRoutes = require('./menus');
const publicRoutes = require('./public');
const { authenticateToken } = require('../middleware/auth');
const { getRecentActivity } = require('../controllers/activityController');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/uploads', uploadRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/public', publicRoutes);

// Nueva ruta para actividad reciente
router.get('/activity/recent', authenticateToken, getRecentActivity);

module.exports = router; 