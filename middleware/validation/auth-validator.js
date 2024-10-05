const { body } = require('express-validator');

const validateUserRegistration = [
  body('firstName').trim().notEmpty().withMessage('First Name is required'),
  body('lastName').trim().notEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').trim().isLength({ min: 10, max: 15 }).withMessage('Phone Number must be valid'),
];

module.exports = {
  validateUserRegistration,
};