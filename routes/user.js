const express = require('express');
const router = express.Router();
const { validateUserUpdate } = require('../middleware/validation/auth-validator.js')
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');

const authMiddleware = require('../middleware/auth.js')
const userController = require('../controllers/userController.js');

router.get('/users', authMiddleware, userController.getAllUsers)
router.get('/me', authMiddleware, userController.getMe)


//delete a wabinar
router.delete(
  '/users/:id',
  authMiddleware, 
  asyncHandler(userController.deleteUser)
);

router.patch(
  '/me',
  authMiddleware,
  validateUserUpdate,
  handleValidation,
  asyncHandler(userController.updateUser))

module.exports = router;