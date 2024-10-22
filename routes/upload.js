const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload'); 
const { uploadFile } = require('../controllers/uploadController');
const validateFile = require('../middleware/validation/file-validator');
const handleValidation = require('../middleware/handleValidation');


router.post(
  '/upload/image',
  upload.single('file'),
  validateFile('image'),
  handleValidation,     
  uploadFile            
);

router.post(
  '/upload/audio',
  upload.single('file'),
  validateFile('audio'),
  handleValidation,     
  uploadFile            
);

router.post(
  '/upload/video',
  upload.single('file'),
  validateFile('video'),
  handleValidation,    
  uploadFile            
);


router.post(
  '/upload/profile',
  upload.single('file'),
  validateFile('image'),
  handleValidation,    
  uploadFile            
);

module.exports = router;
