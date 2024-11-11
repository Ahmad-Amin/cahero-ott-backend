const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js');
const lectureController = require('../controllers/lectureController.js');
const { validateLectureCreation, validateLectureUpdate } = require('../middleware/validation/lecture-validator.js');
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');
const { validateReviewUpdate, validateReviewCreation, validateReviewReplyCreation } = require('../middleware/validation/review-validator.js');

// Create a new lecture
router.post(
  '/lectures',
  authMiddleware,
  validateLectureCreation,
  handleValidation,
  asyncHandler(lectureController.createLecture)
);

// Get all lectures
router.get(
  '/lectures',
  asyncHandler(lectureController.getAllLectures)
);

// Get a lecture by ID
router.get(
  '/lectures/:id',
  asyncHandler(lectureController.getLectureById)
);

// Delete a lecture by ID
router.delete(
  '/lectures/:id',
  authMiddleware,
  asyncHandler(lectureController.deleteLecture)
);

// Update a lecture by ID
router.patch(
  '/lectures/:id',
  authMiddleware,
  validateLectureUpdate,
  handleValidation,
  asyncHandler(lectureController.updateLecture)
);

// Add a review to a webinar
router.post(
  '/lectures/:id/reviews',
  authMiddleware,
  validateReviewCreation,
  handleValidation,
  asyncHandler(lectureController.addReview)
);

// Get all reviews for a webinar
router.get(
  '/lectures/:id/reviews',
  asyncHandler(lectureController.getReviews)
);

// Update a review for a webinar
router.put(
  '/lectures/:id/reviews/:reviewId',
  authMiddleware,
  validateReviewUpdate,
  handleValidation,
  asyncHandler(lectureController.updateReview)
);

// Delete a review for a webinar
router.delete(
  '/lectures/:id/reviews/:reviewId',
  authMiddleware,
  asyncHandler(lectureController.deleteReview)
);

// Get the review stats
router.get(
  '/lectures/:id/reviews/stats',
  asyncHandler(lectureController.getReviewStats)
);

// Toggle like on a review
router.post(
  '/lectures/:id/reviews/:reviewId/toggle-like',
  authMiddleware,
  lectureController.toggleReviewLike
);

// Reply Routes
router.post(
  '/lectures/:id/reviews/:reviewId/replies',
  authMiddleware,
  validateReviewReplyCreation,
  handleValidation,
  asyncHandler(lectureController.addReply)
);

router.get('/lectures/:id/reviews/:reviewId/replies', asyncHandler(lectureController.getReplies));

router.delete(
  '/lectures/:id/reviews/:reviewId/replies/:replyId',
  authMiddleware,
  asyncHandler(lectureController.deleteReply)
);


module.exports = router;
