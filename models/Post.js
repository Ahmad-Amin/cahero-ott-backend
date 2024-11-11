const mongoose = require('mongoose');

// Define the schema for the Post model
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  assetUrl: {
    type: String,
    trim: true
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });
postSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Transform _id to id in comments array
    if (ret.comments && Array.isArray(ret.comments)) {
      ret.comments = ret.comments.map(comment => {
        comment.id = comment._id;
        delete comment._id;
        return comment;
      });
    }

    return ret;
  }
});

// Transformation for object output
postSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Transform _id to id in comments array
    if (ret.comments && Array.isArray(ret.comments)) {
      ret.comments = ret.comments.map(comment => {
        comment.id = comment._id;
        delete comment._id;
        return comment;
      });
    }

    return ret;
  }
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
