const Book = require('../models/Book');

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
      const { type, search } = req.query;
      let filter = {};
  
      if (type === 'past') {
        filter.startDate = { $lt: new Date() };
      }
  
      if (search) {
        filter.title = { $regex: search, $options: 'i' }; 
      }
  
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
};

module.exports = bookController;
