const path = require('path');

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const normalizedPath = req.file.location;

  res.status(200).json({ message: 'File uploaded successfully', fileUrl: normalizedPath });
};

module.exports = { uploadFile };
