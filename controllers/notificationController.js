const Notification = require('../models/Notification');
const { fetchUsersByRole, sendEmails } = require('../utils/helper_functions');
const User = require('../models/User');

let clients = []

const notificationController = {

  notificationStream: (req, res) => {
    const { role } = req.query;
  
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).send('Invalid role specified');
    }
  
    // Set headers for SSE and CORS
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'https://master--enchanting-hotteok-438d96.netlify.app'); // Set your frontend URL here
    res.flushHeaders();
  
    clients.push({ res, role });
  
    const keepAliveInterval = setInterval(() => {
      res.write(':\n\n');
    }, 25000);
  
    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(keepAliveInterval); // Stop the keep-alive interval
      clients = clients.filter(client => client.res !== res);
    });
  },
  

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
        status: externalNotificationDelivery === 'None' ? 'Sent' : 'Pending',
        recipients: recipients,
      });

      if (externalNotificationDelivery !== 'None') {
        const subject = `New Notification: ${notificationType}`;
        try {
          await sendEmails(recipients, subject, content);
          notification.status = 'Sent';
        } catch (emailError) {
          console.error('Failed to send some or all emails:', emailError.message);
          notification.status = 'Failed';
        }
      }

      await notification.save();

      // Notify only clients matching the recipient type
      const targetRole = recipientType === 'Admins' ? 'admin' : recipientType === 'Users' ? 'user' : null;

      clients.forEach(client => {
        if (!targetRole || client.role === targetRole) {
          client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
        }
      });


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

      // Fetch the original notification
      const originalNotification = await Notification.findById(notificationId);
      if (!originalNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      const { recipients, content, notificationType, specificRecipient, externalNotificationDelivery, recipientType } = originalNotification;

      // Add specificRecipient if it's an email and not already in recipients
      let newRecipients = [...recipients];
      if (specificRecipient && specificRecipient.includes('@') && !newRecipients.includes(specificRecipient)) {
        newRecipients.push(specificRecipient);
      }

      // Initialize the status of the new notification
      let newStatus = externalNotificationDelivery === 'None' ? 'Sent' : 'Pending';
      const subject = `Resend Notification: ${notificationType}`;

      if (externalNotificationDelivery !== 'None') {
        try {
          // Attempt to resend notification
          await sendEmails(newRecipients, subject, content);
          newStatus = 'Sent';
        } catch (emailError) {
          console.error('Failed to resend some or all emails:', emailError.message);
          newStatus = 'Failed';
        }
      }

      // Create a new notification entry based on the original one
      const newNotification = new Notification({
        recipients: newRecipients,
        content,
        notificationType,
        specificRecipient,
        recipientType,
        externalNotificationDelivery,
        status: newStatus,
      });

      // Save the new notification entry
      await newNotification.save();
      const targetRole = recipientType === 'Admins' ? 'admin' : recipientType === 'Users' ? 'user' : null;

      clients.forEach(client => {
        if (!targetRole || client.role === targetRole) {
          client.res.write(`data: ${JSON.stringify(newNotification)}\n\n`);
        }
      });

      res.status(201).json({ message: 'Notification resent and new entry created', notification: newNotification });
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
