const Webinar = require('../models/Webinar');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const webinarController = {

  joinWebinar: async (req, res) => {
    try {
      const { id: webinarId } = req.params;
      const webinar = await Webinar.findById(webinarId);

      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }

      if (!webinar.isLive) {
        return res.status(400).json({ message: 'Webinar has not started yet' });
      }

      return res.status(200).json({ message: 'Webinar is live' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWebinar: async (req, res) => {
    try {
      const { title, startTime, endTime, startDate, description, type, coverImageUrl } = req.body;
      const { userId } = req.user;

      const webinar = new Webinar({
        title,
        startTime,
        endTime,
        startDate: new Date(startDate),
        description,
        type,
        coverImageUrl,
        user: userId,
      });

      await webinar.save();
      res.status(201).json(webinar);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteWebinar: async (req, res) => {
    try {

      const { id: webinarId } = req.params;
      const webinar = await Webinar.findById(webinarId);

      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }

      await Webinar.findByIdAndDelete(webinarId);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  getWebinarById: async (req, res) => {
    try {
      const { id: webinarId } = req.params;
      const webinar = await Webinar.findById(webinarId);

      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }

      res.status(200).json(webinar);
    } catch (error) {
      console.error(error);

      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  updateWebinar: async (req, res) => {
    try {
      // Extract the webinarId from the request parameters
      const { id: webinarId } = req.params;
      const webinar = await Webinar.findById(webinarId);

      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }

      // // Check if the current user is authorized to update the webinar
      // if (webinar.user.toString() !== req.user.userId) {
      //   return res.status(403).json({ message: 'Unauthorized: You cannot update this webinar' });
      // }

      const updatedWebinar = await Webinar.findByIdAndUpdate(
        webinarId,
        { $set: req.body }, // Update only the fields passed in the request body
        { new: true, runValidators: true } // Return the updated document and validate changes
      );

      // Send the updated webinar as a response
      res.status(200).json(updatedWebinar);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  getAllWebinars: async (req, res) => {
    try {
      const { type } = req.query;
      let filter = {};
  
      if (type === 'past') {
        filter = { startDate: { $lt: new Date() } };
      }
  
      const webinars = await Webinar.find(filter).sort({ startDate: 1 });
      res.status(200).json({ results: webinars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },  

  sendEmailToAllUsers: async (req, res) => {
    try {
      const { id: webinarId } = req.params;

      // Fetch the webinar details
      const webinar = await Webinar.findById(webinarId);
      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }

      // Fetch all users from the database
      const users = await User.find({}, 'email'); // Fetch only the email field

      // Setup email transport (You need to configure this with your credentials)
      const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email provider
        auth: {
          user: process.env.EMAIL_USER, // Email sender
          pass: process.env.EMAIL_PASS, // Password
        },
      });

      // Prepare the email content
      const mailOptions = {
        from: process.env.EMAIL_USER, // Your email
        subject: `Invitation to Webinar: ${webinar.title}`,
        text: `You are invited to join the webinar "${webinar.title}". \nWebinar ID to Join: ${webinar.id} \n\nDetails:\nDescription: ${webinar.description}\nDate: ${webinar.startDate.toDateString()}\nStart Time: ${webinar.startTime}\nEnd Time: ${webinar.endTime}`
      };

      // Send email to all users
      const emailPromises = users.map(user => {
        return transporter.sendMail({ ...mailOptions, to: user.email });
      });

      // Wait for all emails to be sent
      await Promise.all(emailPromises);

      res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Failed to send emails' });
    }
  },

  startStream: async (req, res) => {
    try {
      const { id: webinarId } = req.params;

      const webinar = await Webinar.findById(webinarId);
      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }

      webinar.isLive = true;
      await webinar.save();

      const users = await User.find({}, 'email');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        subject: `${webinar.title} has started!`,
        text: `The webinar "${webinar.title}" has just started!\n\n` +
          `You can join the webinar using the following ID: **${webinar.id}**\n\n` +
          `Details:\n` +
          `Description: ${webinar.description}\n` +
          `Date: ${webinar.startDate.toDateString()}\n` +
          `Start Time: ${webinar.startTime}\n` +
          `End Time: ${webinar.endTime}`
      };

      // Send email to all users
      const emailPromises = users.map(user => {
        return transporter.sendMail({ ...mailOptions, to: user.email });
      });
      await Promise.all(emailPromises);

      res.status(200).json({ message: 'Streaming started & Emails sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Failed to start streaming' });
    }
  }
}

module.exports = webinarController;