const { body } = require('express-validator');

const validateUserRegistration = [
  body('firstName').trim().notEmpty().withMessage('First Name is required'),
  body('lastName').trim().notEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').trim().isLength({ min: 10, max: 15 }).withMessage('Phone Number must be valid'),
];

const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty().withMessage('First Name cannot be empty'),

  body('lastName')
    .optional()
    .trim()
    .notEmpty().withMessage('Last Name cannot be empty'),

  body('email')
    .optional()
    .isEmail().withMessage('Email must be a valid email address'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('phoneNumber')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 }).withMessage('Phone Number must be between 10 and 15 characters long')
    .matches(/^\+?[0-9]*$/).withMessage('Phone Number must be valid and contain only numbers'),

  // body('address')
  //   .optional()
  //   .trim()
  //   .notEmpty().withMessage('Address cannot be empty'),

  // body('profileImageUrl')
  //   .optional()
  //   .trim()
  //   .isURL({
  //     require_tld: false,
  //     protocols: ['http', 'https'],
  //     require_protocol: true
  //   }).withMessage('Profile image URL must be a valid URL'),
];

module.exports = {
  validateUserRegistration,
  validateUserUpdate
};