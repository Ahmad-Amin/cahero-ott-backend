const { body } = require('express-validator');

// Generic validation middleware based on the type of file
const validateFile = (type) => {
  switch (type) {
    case 'image':
      return [
        body('file')
          .custom((_, { req }) => {
            if (!req.file) {
              throw new Error('Image file is required');
            }
            if (!req.file.mimetype.startsWith('image/')) {
              throw new Error('Only image files are allowed');
            }
            return true;
          })
      ];
    case 'audio':
      return [
        body('file')
          .custom((_, { req }) => {
            if (!req.file) {
              throw new Error('Audio file is required');
            }
            if (!req.file.mimetype.startsWith('audio/')) {
              throw new Error('Only audio files are allowed');
            }
            return true;
          })
      ];
    case 'video':
      return [
        body('file')
          .custom((_, { req }) => {
            if (!req.file) {
              throw new Error('Video file is required');
            }
            if (!req.file.mimetype.startsWith('video/')) {
              throw new Error('Only video files are allowed');
            }
            return true;
          })
      ];
    default:
      throw new Error('Unsupported file type');
  }
};

module.exports = validateFile;
