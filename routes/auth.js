const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserRegistration } = require('../middleware/validation/auth-validator')
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/login', authController.login)

router.post(
  '/register',
  validateUserRegistration,
  handleValidation,        
  asyncHandler(authController.register)
);

module.exports = router;