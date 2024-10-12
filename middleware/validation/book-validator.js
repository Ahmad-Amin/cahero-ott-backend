const { body, check } = require('express-validator');
const { allowedGenres } = require('../../constants/book');

const validateBookCreation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),

  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .isLength({ max: 100 }).withMessage('Author name must not exceed 100 characters'),

  body('genre')
    .notEmpty().withMessage('Genre is required')
    .isIn(allowedGenres).withMessage(`Genre must be one of the following: ${allowedGenres.join(', ')}`),

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

  body('audioFileUrl')
    .optional()
    .trim()
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Audio file URL must be a valid URL if provided'),
];


const validateBookUpdate = [

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must between 1 to 200 characters'),

  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Author name must be between 1 to 100 characters'),

  body('genre')
    .optional()
    .isIn(allowedGenres).withMessage(`Genre must be one of the following: ${allowedGenres.join(', ')}`),

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

  body('audioFileUrl')
    .optional()
    .trim()
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Audio file URL must be a valid URL if provided'),
];


module.exports = {
  validateBookCreation,
  validateBookUpdate
};
