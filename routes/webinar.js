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
  // authMiddleware, 
  asyncHandler(webinarController.getAllWebinars)
);

// get  webinar by ID
router.get(
  '/webinars/:id',
  // authMiddleware, 
  asyncHandler(webinarController.getWebinarById)
);


//delete a wabinar
router.delete(
  '/webinars/:id',
  authMiddleware, 
  asyncHandler(webinarController.deleteWebinar)
);

// Update a webinar
router.patch(
  '/webinars/:id',
  authMiddleware,
  validateWebinarCreation,
  handleValidation,        
  asyncHandler(webinarController.updateWebinar)
);


// Update a webinar
router.post(
  '/webinars/:id/send-email',
  authMiddleware,
  asyncHandler(webinarController.sendEmailToAllUsers)
);

// Update a webinar
router.post(
  '/webinars/:id/start-stream',
  authMiddleware,
  asyncHandler(webinarController.startStream)
);

module.exports = router;