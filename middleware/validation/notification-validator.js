const { body } = require('express-validator');

const validateNotificationCreation = [
  body('notificationType')
    .notEmpty().withMessage('Notification type is required')
    .isIn(['System Update', 'User Notification', 'Upcoming Webinar', 'New Documentary', 'New Book'])
    .withMessage('Notification type must be one of: System Update, User Notification, Upcoming Webinar, New Documentary, New Book'),

  body('recipientType')
    .notEmpty().withMessage('Recipient type is required')
    .isIn(['All', 'Admins', 'Users'])
    .withMessage('Recipient type must be one of: All, Admins, Users'),

  body('specificRecipient')
    .optional()
    .trim()
    .isString().withMessage('Specific recipient must be a valid string'),

  body('externalNotificationDelivery')
    .notEmpty().withMessage('External notification delivery option is required')
    .isIn(['None', 'All', 'Email', 'Phone Number'])
    .withMessage('External notification delivery must be one of: None, All, Email, Phone Number'),

  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a valid string')
];

module.exports = {
  validateNotificationCreation
};
