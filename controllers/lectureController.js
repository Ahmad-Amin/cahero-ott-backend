const Lecture = require('../models/Lecture');

const lectureController = {
  createLecture: async (req, res) => {
    try {
      const { title, duration, category, description, coverImageUrl, videoUrl } = req.body;

      const lecture = new Lecture({
        title,
        duration,
        category,
        description,
        coverImageUrl,
        videoUrl
      });

      await lecture.save();
      res.status(201).json(lecture);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllLectures: async (req, res) => {
    try {
      const lectures = await Lecture.find();
      res.status(200).json({ results: lectures });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getLectureById: async (req, res) => {
    try {
      const { id: lectureId } = req.params;
      const lecture = await Lecture.findById(lectureId);

      if (!lecture) {
        return res.status(404).json({ message: 'Lecture not found' });
      }

      res.status(200).json(lecture);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  updateLecture: async (req, res) => {
    try {
      const { id: lectureId } = req.params;
      const lecture = await Lecture.findById(lectureId);

      if (!lecture) {
        return res.status(404).json({ message: 'Lecture not found' });
      }

      const updatedLecture = await Lecture.findByIdAndUpdate(
        lectureId,
        { $set: req.body }, 
        {
          new: true,        
          runValidators: true,
          context: 'query',
        }
      );

      res.status(200).json(updatedLecture);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  deleteLecture: async (req, res) => {
    try {
      const { id: lectureId } = req.params;
      const lecture = await Lecture.findById(lectureId);

      if (!lecture) {
        return res.status(404).json({ message: 'Lecture not found' });
      }

      await Lecture.findByIdAndDelete(lectureId);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },
};

module.exports = lectureController;
