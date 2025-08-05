const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMyProfile, createMyProfile } = require('../controllers/userController');

// Rutas protegidas para el perfil del usuario
router.get('/me/profile', authMiddleware, getMyProfile);
router.post('/me/profile', authMiddleware, createMyProfile);

module.exports = router;