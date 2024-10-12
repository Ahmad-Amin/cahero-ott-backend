const path = require('path');

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const normalizedPath = path.posix.normalize(req.file.path);
  const fileUrl = `${req.protocol}://${req.get('host')}/${normalizedPath.replace(/\\/g, '/')}`;

  res.status(200).json({ message: 'File uploaded successfully', fileUrl });
};

module.exports = { uploadFile };
