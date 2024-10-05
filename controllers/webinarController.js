const Webinar = require('../models/Webinar');

const webinarController = {

  createWebinar: async (req, res) => {
    try {
      const { title, startTime, endTime, startDate, description, type, user } = req.body;
      const { userId } = req.user;

      const webinar = new Webinar({
        title,
        startTime,
        endTime,
        startDate: new Date(startDate),
        description,
        type,
        user: userId,
      });

      await webinar.save();
      res.status(201).json(webinar);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllWebinars: async (req, res) => {
    try {
      const webinars = await Webinar.find();
      res.status(200).json({ results: webinars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

module.exports = webinarController;