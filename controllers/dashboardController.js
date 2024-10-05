const User = require('../models/User');
const Webinar = require('../models/Webinar');

const dashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      const users = await User.find();
      const webinars = await Webinar.find();
      const totalSales = 0
      const totalSubscribers = 0
      res.status(200).json({ activeUsers: users.length, upcomingWebinars: webinars.length, totalSales, totalSubscribers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

module.exports = dashboardController;