const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'assets';

    if (file.mimetype.startsWith('image/')) {
      folder = 'assets/images';
    } else if (file.mimetype.startsWith('audio/')) {
      folder = 'assets/audio';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'assets/videos';
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

module.exports = upload;
