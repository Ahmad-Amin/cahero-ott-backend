const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js')
const userController = require('../controllers/userController.js');

router.get('/users', authMiddleware, userController.getAllUsers)

module.exports = router;