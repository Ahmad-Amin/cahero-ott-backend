const { body } = require('express-validator');

const validateCommentCreation = [
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ max: 300 }).withMessage('Comment must not exceed 300 characters'),
];

module.exports = {
  validateCommentCreation
};