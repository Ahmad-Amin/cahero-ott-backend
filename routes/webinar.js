const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js')
const webinarController = require('../controllers/webinarController.js');
const { validateWebinarCreation } = require('../middleware/validation/webinar-validator.js')
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');


// create new webinar
router.post(
  '/webinars',
  authMiddleware,
  validateWebinarCreation,
  handleValidation,        
  asyncHandler(webinarController.createWebinar)
);

// get all webinars
router.get(
  '/webinars',
  authMiddleware, 
  asyncHandler(webinarController.getAllWebinars)
);

//delete a wabinar
// get all webinars
router.delete(
  '/webinars/:id',
  authMiddleware, 
  asyncHandler(webinarController.deleteWebinar)
);

module.exports = router;