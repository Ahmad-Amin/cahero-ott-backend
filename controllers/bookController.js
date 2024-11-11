const Book = require('../models/Book');
const { applyDateFilter, addReview, getReviews, updateReview, deleteReview, getReviewStats, toggleReviewLike } = require('../utils/helper_functions');
const { addReply, getReplies, deleteReply } = require('../utils/replyHelper');

const bookController = {
  createBook: async (req, res) => {
    try {
      const { title, author, genre, description, audioFileUrl, coverImageUrl } = req.body;

      const book = new Book({
        title,
        author,
        genre,
        description,
        audioFileUrl,
        coverImageUrl,
      });

      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllBooks: async (req, res) => {
    try {
      const { type, search, target } = req.query;
      let filter = {};

      // Filter by type (e.g., past events)
      if (type === 'past') {
        filter.startDate = { $lt: new Date() };
      }

      // Filter by search query
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      filter = applyDateFilter(filter, target);

      // Query the database with the updated filter
      const books = await Book.find(filter);
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },


  getBookById: async (req, res) => {
    try {
      const { id: bookId } = req.params;
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      res.status(200).json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  updateBook: async (req, res) => {
    try {
      const { id: bookId } = req.params;
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { $set: req.body },  // Update only fields sent in req.body
        {
          new: true,          // Return the updated document
          runValidators: true, // Validate the fields being updated
          context: 'query',    // Needed for `runValidators` to work with update
        }
      );

      res.status(200).json(updatedBook);
    } catch (error) {
      console.error(error);
      console.log('error->', error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const { id: bookId } = req.params;
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      await Book.findByIdAndDelete(bookId);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  addReview: async (req, res) => {
    try {
      const { id: bookId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user.userId;

      const review = await addReview(Book, bookId, userId, content, rating);
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to add review' });
    }
  },

  getReviews: async (req, res) => {
    try {
      const { id: bookId } = req.params;
      const reviews = await getReviews(Book, bookId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to retrieve reviews' });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { id: bookId, reviewId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user.userId;

      const review = await updateReview(Book, bookId, reviewId, userId, content, rating);
      res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to update review' });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id: bookId, reviewId } = req.params;
      const userId = req.user.userId;

      const response = await deleteReview(Book, bookId, reviewId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to delete review' });
    }
  },

  getReviewStats: async (req, res) => {
    try {
      const { id: bookId } = req.params;
      const stats = await getReviewStats(Book, bookId);
      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to retrieve review stats' });
    }
  },

  toggleReviewLike: async (req, res) => {
    try {
      const { id: bookId, reviewId } = req.params;
      const userId = req.user.userId;

      const response = await toggleReviewLike(Book, bookId, reviewId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to toggle like status' });
    }
  },

  addReply: async (req, res) => {
    try {
      const { id: bookId, reviewId } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;

      const reply = await addReply(Book, bookId, reviewId, userId, content);
      res.status(201).json({ message: 'Reply added successfully', reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to add reply' });
    }
  },

  getReplies: async (req, res) => {
    try {
      const { id: bookId, reviewId } = req.params;
      const replies = await getReplies(Book, bookId, reviewId);
      res.status(200).json(replies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to retrieve replies' });
    }
  },

  deleteReply: async (req, res) => {
    try {
      const { id: bookId, reviewId, replyId } = req.params;
      const userId = req.user.userId;

      const response = await deleteReply(Book, bookId, reviewId, replyId, userId);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Server Error: Failed to delete reply' });
    }
  },
};

module.exports = bookController;
