const express = require('express');
const router = express.Router();

// Import user routes
const authRoutes = require('./auth');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/', userRoutes)

module.exports = router;
