const path = require('path');

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

  res.status(200).json({ message: 'File uploaded successfully', fileUrl });
};

module.exports = { uploadFile };
