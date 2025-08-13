
const express = require('express');
const publicRoutes = require('./public');

const router = express.Router();

router.use('/public', publicRoutes);

module.exports = router;
