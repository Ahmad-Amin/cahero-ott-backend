const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the notification
const notificationSchema = new Schema({
  notificationType: {
    type: String,
    enum: ['System Update', 'User Notification', 'Upcoming Webinar', 'New Documentary', 'New Book'],
    required: true
  },
  recipientType: {
    type: String,
    enum: ['All', 'Admins', 'Users'],
    required: true
  },
  specificRecipient: {
    type: String,
    trim: true,
    default: null // Not required, can be null if not provided
  },
  externalNotificationDelivery: {
    type: String,
    enum: ['None', 'All', 'Email', 'Phone Number'],
    required: true,
    default: 'None'
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Failed', 'Pending'],
    default: 'Pending',
    required: true
  },
  recipients: {
    type: [String], 
    required: true
  }
}, { timestamps: true });

// Add toJSON and toObject transformation
notificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
    return ret;
  }
});

notificationSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.updatedAt;
    return ret;
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
