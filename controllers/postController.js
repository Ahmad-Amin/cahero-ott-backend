const Post = require('../models/Post');

const postController = {

  toggleLike: async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const liked = post.likedBy.includes(userId);
    if (liked) {
      post.likedBy.pull(userId);
      post.likes -= 1;
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    return res.status(200).json({
      message: liked ? 'Unliked the post' : 'Liked the post',
      likes: post.likes,
      likedBy: post.likedBy
    });
  },

  getLikeStatus: async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const liked = post.likedBy.includes(userId);
    return res.status(200).json({ liked });
  },

  createPost: async (req, res) => {
    try {
      const { content, likes, image } = req.body;
      const { userId } = req.user;

      const post = new Post({
        content,
        likes,
        image,
        createdBy: userId
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const { search } = req.query;
      let filter = {};

      if (search) {
        filter.content = { $regex: search, $options: 'i' };
      }

      const posts = await Post.find(filter)
        .populate('createdBy', 'firstName lastName email')
        .populate({
          path: 'comments.user',
          select: '_id, firstName lastName email profileImageUrl'
        })
        .sort({ createdAt: -1 });

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  },

  getPostById: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const post = await Post.findById(postId).populate('createdBy', 'firstName lastName').sort({ createdAt: -1 });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: req.body },
        {
          new: true,
          runValidators: true,
          context: 'query',
        }
      );

      res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      await Post.findByIdAndDelete(postId);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Make sure ID is present' });
    }
  },

  addComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const { comment } = req.body;
      const { userId } = req.user;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newComment = {
        user: userId,
        comment,
      };

      post.comments.push(newComment);
      await post.save();

      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId).populate('comments.user', 'firstName lastName');

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post.comments);
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user.userId; // Assuming req.user contains userId from authentication middleware

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Optionally, check if the user owns the comment before deleting
      if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Use pull to remove the comment
      post.comments.pull(commentId);
      await post.save();

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

};

module.exports = postController;
