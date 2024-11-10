const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js')
const webinarController = require('../controllers/webinarController.js');
const { validateWebinarCreation, validateWebinarUpdate } = require('../middleware/validation/webinar-validator.js')
const { validateReviewCreation, validateReviewUpdate } = require('../middleware/validation/review-validator.js');
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
  validateWebinarUpdate,
  handleValidation,
  asyncHandler(webinarController.updateWebinar)
);


// send webinar id to add users
router.post(
  '/webinars/:id/send-email',
  authMiddleware,
  asyncHandler(webinarController.sendEmailToAllUsers)
);

// Update a webinar
router.patch(
  '/webinars/:id/start-stream',
  authMiddleware,
  asyncHandler(webinarController.startStream)
);


// Join Webinar Check
router.post(
  '/webinars/:id/join',
  authMiddleware,
  asyncHandler(webinarController.joinWebinar)
);

// Add a review to a webinar
router.post(
  '/webinars/:id/reviews',
  authMiddleware,
  validateReviewCreation,
  handleValidation,
  asyncHandler(webinarController.addReview)
);

// Get all reviews for a webinar
router.get(
  '/webinars/:id/reviews',
  asyncHandler(webinarController.getReviews)
);

// Update a review for a webinar
router.put(
  '/webinars/:id/reviews/:reviewId',
  authMiddleware,
  validateReviewUpdate,
  handleValidation,
  asyncHandler(webinarController.updateReview)
);

// Delete a review for a webinar
router.delete(
  '/webinars/:id/reviews/:reviewId',
  authMiddleware,
  asyncHandler(webinarController.deleteReview)
);

// Get the review stats
router.get(
  '/webinars/:id/reviews/stats',
  asyncHandler(webinarController.getReviewStats)
);

// Toggle like on a review
router.post(
  '/webinars/:id/reviews/:reviewId/toggle-like',
  authMiddleware,
  webinarController.toggleReviewLike
);

module.exports = router;