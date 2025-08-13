const express = require('express')
const restaurantController = require('../../../src/controllers/restaurantController')

const router = express.Router()

router.get('/me', restaurantController.getMyRestaurant)
router.put('/me', restaurantController.updateMyRestaurant)
router.get('/me/settings', restaurantController.getMySettings)
router.put('/me/settings', restaurantController.updateMySettings)
router.get('/me/social-media', restaurantController.getMySocialMedia)
router.put('/me/social-media', restaurantController.updateMySocialMedia)

module.exports = router