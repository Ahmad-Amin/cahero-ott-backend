const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js')
const webinarController = require('../controllers/webinarController.js');
const { validateWebinarCreation } = require('../middleware/validation/webinar-validator.js')
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');


router.post(
  '/webinars',
  authMiddleware,
  validateWebinarCreation,
  handleValidation,        
  asyncHandler(webinarController.createWebinar)
);

module.exports = router;