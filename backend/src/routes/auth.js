
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { syncUser } = require('../controllers/authController');

router.post('/sync', authMiddleware, syncUser);

module.exports = router;
