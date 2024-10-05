const User = require('../models/User');
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
  }
}

module.exports = webinarController;