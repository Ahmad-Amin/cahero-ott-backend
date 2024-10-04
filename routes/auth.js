const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validation/auth-validator')


router.post('/login', authController.login)
router.post('/register', validateUserRegistration, authController.register)

module.exports = router;