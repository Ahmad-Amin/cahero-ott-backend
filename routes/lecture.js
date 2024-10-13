const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js');
const lectureController = require('../controllers/lectureController.js');
const { validateLectureCreation, validateLectureUpdate } = require('../middleware/validation/lecture-validator.js');
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');

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

module.exports = router;
