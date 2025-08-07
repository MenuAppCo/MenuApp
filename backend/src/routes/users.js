const express = require('express');
const router = express.Router();
const { getMyProfile, createMyProfile } = require('../controllers/userController');

router.get('/me/profile', getMyProfile);
router.post('/me/profile', createMyProfile);

module.exports = router;