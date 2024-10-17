const { body } = require('express-validator');

const validateWebinarCreation = [
  // Title must not be empty and must have a max length of 200 characters
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),

  // StartTime should be in HH:MM format (24-hour time)
  body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in the format HH:MM (24-hour clock)'),

  // EndTime should be in HH:MM format (24-hour time)
  body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in the format HH:MM (24-hour clock)'),

  // StartDate should be a valid date and not empty
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),

  // Description is optional but, if present, must be trimmed
  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a valid string'),

  // Type should be either 'paid' or 'unpaid' (default is handled in the model)
  body('type')
    .optional()
    .isIn(['paid', 'unpaid']).withMessage('Type must be either "paid" or "unpaid"'),

  body('coverImageUrl')
    .trim()
    .notEmpty().withMessage('Cover image URL is required')
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Cover image URL must be a valid URL'),
];



const validateWebinarUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),

  body('startTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in the format HH:MM (24-hour clock)'),

  body('endTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in the format HH:MM (24-hour clock)'),

  body('startDate')
    .optional()
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a valid string'),

  body('type')
    .optional()
    .isIn(['paid', 'unpaid']).withMessage('Type must be either "paid" or "unpaid"'),

  body('coverImageUrl')
    .optional()
    .trim()
    .notEmpty().withMessage('Cover image URL is required')
    .isURL({
      require_tld: false,
      protocols: ['http', 'https'],
      require_protocol: true
    })
    .withMessage('Cover image URL must be a valid URL'),
];

module.exports = {
  validateWebinarCreation,
  validateWebinarUpdate
};
