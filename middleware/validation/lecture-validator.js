const { body } = require('express-validator');
const { allowedLectureCategories } = require('../../constants/lecture');


// Regular expression to validate the HH:MM:SS format
const durationRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const validateLectureCreation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),

  body('duration')
    .trim()
    .notEmpty().withMessage('Duration is required')
    .matches(durationRegex).withMessage('Duration must be in the format HH:MM:SS'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(allowedLectureCategories).withMessage(`Category must be one of the following: ${allowedLectureCategories.join(', ')}`),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a valid string'),

  body('coverImageUrl')
    .trim()
    .notEmpty().withMessage('Cover image URL is required')
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Cover image URL must be a valid URL'),

  body('videoUrl')
    .trim()
    .notEmpty().withMessage('Video URL is required')
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Video URL must be a valid URL'),
];

const validateLectureUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 to 200 characters'),

  body('duration')
    .optional()
    .trim()
    .matches(durationRegex).withMessage('Duration must be in the format HH:MM:SS'),

  body('category')
    .optional()
    .trim()
    .isIn(allowedLectureCategories).withMessage(`Category must be one of the following: ${allowedLectureCategories.join(', ')}`),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a valid string'),

  body('coverImageUrl')
    .optional()
    .trim()
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Cover image URL must be a valid URL'),

  body('videoUrl')
    .optional()
    .trim()
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Video URL must be a valid URL'),
];

module.exports = {
  validateLectureCreation,
  validateLectureUpdate
};
