const express = require('express');
const router = express.Router();

// Import user routes
const authRoutes = require('./auth');
const userRoutes = require('./user');
const webinarRoutes = require('./webinar');

router.use('/auth', authRoutes);
router.use('/', userRoutes)
router.use('/', webinarRoutes)

module.exports = router;
