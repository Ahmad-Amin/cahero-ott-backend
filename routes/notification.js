const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js');
const notificationController = require('../controllers/notificationController.js');
const { validateNotificationCreation } = require('../middleware/validation/notification-validator.js');
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new notification
router.post(
  '/notifications',
  authMiddleware,
  validateNotificationCreation,
  handleValidation,
  asyncHandler(notificationController.createNotification)
);

router.post('/notifications/:notificationId/resend', authMiddleware, notificationController.resendNotification);

// Get all notifications
router.get(
  '/notifications',
  authMiddleware,
  asyncHandler(notificationController.getAllNotifications)
);

// Get a notification by ID
router.get(
  '/notifications/:id',
  authMiddleware,
  asyncHandler(notificationController.getNotificationById)
);

// Delete a notification by ID
router.delete(
  '/notifications/:id',
  authMiddleware,
  asyncHandler(notificationController.deleteNotification)
);






module.exports = router;
