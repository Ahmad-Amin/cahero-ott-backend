const { body } = require('express-validator');

const validateFile = (type) => {

  const sizeLimits = {
    image: 5 * 1024 * 1024,
    audio: 5 * 1024 * 1024,
    video: 20 * 1024 * 1024
  };

  const allowedMimeTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
    video: ['video/mp4', 'video/x-matroska', 'video/webm']
  };

  return [
    body('file')
      .custom((_, { req }) => {
        if (!req.file) {
          throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} file is required`);
        }

        // Validate file type based on MIME type
        const mimeType = req.file.mimetype;
        const allowedTypes = allowedMimeTypes[type];
        if (!allowedTypes.includes(mimeType)) {
          throw new Error(`Only the following ${type} types are allowed: ${allowedTypes.join(', ')}`);
        }

        // Validate file size
        const maxSize = sizeLimits[type]; // Get the max size based on the file type
        if (req.file.size > maxSize) {
          throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} file size should not exceed ${maxSize / (1024 * 1024)} MB`);
        }

        return true;
      })
  ];
};

module.exports = validateFile;
