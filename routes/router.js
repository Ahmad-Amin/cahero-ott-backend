const express = require('express');
const router = express.Router();

// Import user routes
const authRoutes = require('./auth');
const userRoutes = require('./user');
const webinarRoutes = require('./webinar');
const dashboardRoutes = require('./dashboard');
const bookRoutes = require('./book');
const uploadRoutes = require('./upload');

router.use('/auth', authRoutes);
router.use('/', userRoutes)
router.use('/', webinarRoutes)
router.use('/', dashboardRoutes)
router.use('/', bookRoutes)
router.use('/', uploadRoutes)

module.exports = router;
