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
        recipients = await User.find({}, 'email')
      }

      const notification = new Notification({
        notificationType,
        recipientType,
        specificRecipient,
        externalNotificationDelivery,
        content,
        status: 'Pending'
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

  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find();
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
