const Lecture = require('../models/Lecture');
const { applyDateFilter, addReview, getReviews, updateReview, deleteReview, getReviewStats, toggleReviewLike } = require('../utils/helper_functions');

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
      const { search, target } = req.query;
      let filter = {};

      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      filter = applyDateFilter(filter, target);

      const lectures = await Lecture.find(filter);
      res.status(200).json(lectures);
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

  addReview: async (req, res) => {
    try {
      const { id: lectureId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user.userId;

      const review = await addReview(Lecture, lectureId, userId, content, rating);
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to add review' });
    }
  },

  getReviews: async (req, res) => {
    try {
      const { id: lectureId } = req.params;
      const reviews = await getReviews(Lecture, lectureId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to retrieve reviews' });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { id: lectureId, reviewId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user.userId;

      const review = await updateReview(Lecture, lectureId, reviewId, userId, content, rating);
      res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to update review' });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id: lectureId, reviewId } = req.params;
      const userId = req.user.userId;

      const response = await deleteReview(Lecture, lectureId, reviewId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to delete review' });
    }
  },

  getReviewStats: async (req, res) => {
    try {
      const { id: lectureId } = req.params;
      const stats = await getReviewStats(Lecture, lectureId);
      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to retrieve review stats' });
    }
  },

  toggleReviewLike: async (req, res) => {
    try {
      const { id: lectureId, reviewId } = req.params;
      const userId = req.user.userId;

      const response = await toggleReviewLike(Lecture, lectureId, reviewId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to toggle like status' });
    }
  }
};

module.exports = lectureController;
