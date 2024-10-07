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

  deleteWebinar: async (req, res) => {
    try {

      const { id: webinarId } = req.params;
      const webinar = await Webinar.findById(webinarId);
  
      if (!webinar) {
        return res.status(404).json({ message: 'Webinar not found' });
      }
  
      // if (webinar.user.toString() !== req.user.userId) {
      //   return res.status(403).json({ message: 'Unauthorized: You cannot delete this webinar' });
      // }
  
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
  
      // Check if the current user is authorized to update the webinar
      if (webinar.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized: You cannot update this webinar' });
      }
  
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
      const webinars = await Webinar.find();
      res.status(200).json({ results: webinars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

module.exports = webinarController;