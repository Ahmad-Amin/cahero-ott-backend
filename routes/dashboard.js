const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js')
const dashboardController = require('../controllers/dashboardController.js');

router.get('/stats', authMiddleware, dashboardController.getDashboardStats)

module.exports = router;