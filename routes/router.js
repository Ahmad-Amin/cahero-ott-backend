const express = require('express');
const router = express.Router();

// Import user routes
const authRoutes = require('./auth');

router.use('/auth', authRoutes);

module.exports = router;
