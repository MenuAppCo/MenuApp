const express = require('express');
const { getMyProfile, createMyProfile } = require('../../../src/controllers/userController');

const router = express.Router();

router.get('/me/profile', getMyProfile);
router.post('/me/profile', createMyProfile);

module.exports = router;