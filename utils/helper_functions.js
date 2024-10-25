const nodemailer = require('nodemailer');
const User = require('../models/User');

// Function to fetch users based on role
const fetchUsersByRole = async (role) => {
  try {
    const users = await User.find({ role }, 'email');
    return users.map(user => user.email);
  } catch (error) {
    throw new Error('Error fetching users by role');
  }
};

// Function to send emails to a list of recipients
const sendEmails = async (recipients, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      subject,
      text: message,
    };

    // Sending emails to all recipients
    const emailPromises = recipients.map((email) => 
      transporter.sendMail({ ...mailOptions, to: email })
    );
    await Promise.all(emailPromises);
  } catch (error) {
    throw new Error('Error sending emails');
  }
};

module.exports = { fetchUsersByRole, sendEmails };
