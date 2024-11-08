const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.js');
const postController = require('../controllers/postController.js');
const handleValidation = require('../middleware/handleValidation');
const asyncHandler = require('../middleware/asyncHandler');
const { validatePostCreation, validatePostUpdate } = require('../middleware/validation/post-validator.js');
const { validateCommentCreation } = require('../middleware/validation/comment-validator.js');

// Create a new post
router.post(
  '/posts',
  authMiddleware,
  validatePostCreation,
  handleValidation,
  asyncHandler(postController.createPost)
);

// Get all posts
router.get(
  '/posts',
  authMiddleware,
  asyncHandler(postController.getAllPosts)
);

// Get a post by ID
router.get(
  '/posts/:id',
  asyncHandler(postController.getPostById)
);

// Delete a post by ID
router.delete(
  '/posts/:id',
  authMiddleware,
  asyncHandler(postController.deletePost)
);

// Update a post by ID
router.patch(
  '/posts/:id',
  authMiddleware,
  validatePostUpdate,
  handleValidation,
  asyncHandler(postController.updatePost)
);

router.post(
  '/posts/:postId/comments',
  authMiddleware,
  validateCommentCreation,
  handleValidation,
  asyncHandler(postController.addComment)
);

// Get all comments for a post
router.get(
  '/posts/:postId/comments',
  asyncHandler(postController.getComments)
);

// Delete a comment by ID
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  asyncHandler(postController.deleteComment)
);

module.exports = router;
