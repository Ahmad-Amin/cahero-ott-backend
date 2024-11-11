const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// Configure S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multerS3 for S3 file upload
const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    let folder = 'assets';

    if (file.mimetype.startsWith('image/')) {
      folder = 'assets/images';
    } else if (file.mimetype.startsWith('audio/')) {
      folder = 'assets/audio';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'assets/videos';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'assets/documents';
    }

    cb(null, `${folder}/${Date.now()}-${file.originalname}`);
  },
  contentDisposition: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, 'inline');
    } else {
      cb(null, 'attachment');
    }
  }
});

// Set up multer with the S3 storage configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,  // 50 MB file size limit
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);  // Allow all file types
  },
});

module.exports = upload;
