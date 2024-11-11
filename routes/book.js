const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js');
const bookController = require('../controllers/bookController.js');
const { validateBookCreation, validateBookUpdate } = require('../middleware/validation/book-validator.js');
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');
const { validateReviewUpdate, validateReviewCreation, validateReviewReplyCreation } = require('../middleware/validation/review-validator.js');

// Create a new book
router.post(
  '/books',
  authMiddleware,
  validateBookCreation,
  handleValidation,
  asyncHandler(bookController.createBook)
);

// Get all books
router.get(
  '/books',
  asyncHandler(bookController.getAllBooks)
);

// Get a book by ID
router.get(
  '/books/:id',
  asyncHandler(bookController.getBookById)
);

// Delete a book by ID
router.delete(
  '/books/:id',
  authMiddleware,
  asyncHandler(bookController.deleteBook)
);

// Update a book by ID
router.patch(
  '/books/:id',
  authMiddleware,
  validateBookUpdate,
  handleValidation,
  asyncHandler(bookController.updateBook)
);


// Add a review to a book
router.post(
  '/books/:id/reviews',
  authMiddleware,
  validateReviewCreation,
  handleValidation,
  asyncHandler(bookController.addReview)
);


// Get all reviews for a book
router.get(
  '/books/:id/reviews',
  asyncHandler(bookController.getReviews)
);

// Update a review for a book
router.put(
  '/books/:id/reviews/:reviewId',
  authMiddleware,
  validateReviewUpdate,
  handleValidation,
  asyncHandler(bookController.updateReview)
);

// Delete a review for a book
router.delete(
  '/books/:id/reviews/:reviewId',
  authMiddleware,
  asyncHandler(bookController.deleteReview)
);

// Get the review stats
router.get(
  '/books/:id/reviews/stats',
  asyncHandler(bookController.getReviewStats)
);

// Toggle like on a review
router.post(
  '/books/:id/reviews/:reviewId/toggle-like',
  authMiddleware,
  bookController.toggleReviewLike
);


// Reply Routes
router.post(
  '/books/:id/reviews/:reviewId/replies',
  authMiddleware,
  validateReviewReplyCreation,
  handleValidation,
  asyncHandler(bookController.addReply)
);

router.get('/books/:id/reviews/:reviewId/replies', asyncHandler(bookController.getReplies));

router.delete(
  '/books/:id/reviews/:reviewId/replies/:replyId',
  authMiddleware,
  asyncHandler(bookController.deleteReply)
);


module.exports = router;
