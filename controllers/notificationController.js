const Notification = require('../models/Notification');
const { fetchUsersByRole, sendEmails } = require('../utils/helper_functions');
const User = require('../models/User');

const notificationController = {
  createNotification: async (req, res) => {
    try {
      const {
        notificationType,
        recipientType,
        specificRecipient,
        externalNotificationDelivery,
        content
      } = req.body;


      let recipients = [];
      if (recipientType === 'Admins') {
        recipients = await fetchUsersByRole('admin');
      } else if (recipientType === 'Users') {
        recipients = await fetchUsersByRole('user');
      } else {
        recipients = (await User.find({}, 'email')).map(user => user.email);
      }

      if (specificRecipient && specificRecipient.includes('@')) {
        recipients.push(specificRecipient);
      }

      const notification = new Notification({
        notificationType,
        recipientType,
        specificRecipient,
        externalNotificationDelivery,
        content,
        status: 'Pending',
        recipients: recipients,
      });

      const subject = `New Notification: ${notificationType}`;
      try {
        await sendEmails(recipients, subject, content);
        notification.status = 'Sent';
      } catch (emailError) {
        console.error('Failed to send some or all emails:', emailError.message);
        notification.status = 'Failed';
      }

      await notification.save();

      res.status(201).json({ message: 'Notification created and processed', notification });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        notificationType,
        recipientType,
        specificRecipient,
        externalNotificationDelivery,
        content
      } = req.body;

      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      // Update notification fields if provided
      if (notificationType) notification.notificationType = notificationType;
      if (recipientType) notification.recipientType = recipientType;
      if (specificRecipient) notification.specificRecipient = specificRecipient;
      if (externalNotificationDelivery !== undefined) notification.externalNotificationDelivery = externalNotificationDelivery;
      if (content) notification.content = content;

      // Update recipients based on recipientType
      let recipients = notification.recipients;
      if (recipientType === 'Admins') {
        recipients = await fetchUsersByRole('admin');
      } else if (recipientType === 'Users') {
        recipients = await fetchUsersByRole('user');
      } else {
        recipients = (await User.find({}, 'email')).map(user => user.email);
      }

      if (specificRecipient && specificRecipient.includes('@')) {
        recipients.push(specificRecipient);
      }

      notification.recipients = recipients;

      // Save the updated notification
      await notification.save();

      res.status(200).json({ message: 'Notification updated successfully', notification });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },


  resendNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      const { recipients, content, notificationType, specificRecipient } = notification;

      if (specificRecipient && specificRecipient.includes('@') && !recipients.includes(specificRecipient)) {
        recipients.push(specificRecipient);
      }

      const subject = `Resend Notification: ${notificationType}`;
      try {
        await sendEmails(recipients, subject, content);
        notification.status = 'Sent';
      } catch (emailError) {
        console.error('Failed to resend some or all emails:', emailError.message);
        notification.status = 'Failed';
      }

      await notification.save();

      res.status(200).json({ message: 'Notification resent and processed', notification });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.status(200).json({ results: notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getNotificationById: async (req, res) => {
    try {
      const { id: notificationId } = req.params;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json(notification);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { id: notificationId } = req.params;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      await Notification.findByIdAndDelete(notificationId);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },
};

module.exports = notificationController;
