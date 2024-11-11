const { body } = require('express-validator');

const validateReviewCreation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a valid string'),

  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

const validateReviewReplyCreation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a valid string'),
]

const validateReviewUpdate = [
  body('content')
    .optional()
    .trim()
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a valid string'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = {
  validateReviewCreation,
  validateReviewUpdate,
  validateReviewReplyCreation
};
