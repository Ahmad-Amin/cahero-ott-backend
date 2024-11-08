const { body } = require('express-validator');

const validatePostCreation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ max: 1000 }).withMessage('Content must not exceed 1000 characters'),

  body('likes')
    .optional()
    .isInt({ min: 0 }).withMessage('Likes must be a non-negative integer'),

  body('image')
    .optional()
    .trim()
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Image URL must be a valid URL'),

  body('comments.*.user')
    .optional()
    .isMongoId().withMessage('User ID in comments must be a valid MongoDB ID'),

  body('comments.*.comment')
    .optional()
    .trim()
    .notEmpty().withMessage('Comment text is required for each comment')
    .isLength({ max: 300 }).withMessage('Comment must not exceed 300 characters')
];

const validatePostUpdate = [
  body('content')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Content must not exceed 1000 characters'),

  body('likes')
    .optional()
    .isInt({ min: 0 }).withMessage('Likes must be a non-negative integer'),

  body('image')
    .optional()
    .trim()
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Image URL must be a valid URL'),

  body('comments.*.user')
    .optional()
    .isMongoId().withMessage('User ID in comments must be a valid MongoDB ID'),

  body('comments.*.comment')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Comment must not exceed 300 characters')
];

module.exports = {
  validatePostCreation,
  validatePostUpdate
};
