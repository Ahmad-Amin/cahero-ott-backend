const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js');
const bookController = require('../controllers/bookController.js');
const { validateBookCreation, validateBookUpdate } = require('../middleware/validation/book-validator.js');
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');

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

module.exports = router;
