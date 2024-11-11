// reviewSchema.js
const mongoose = require('mongoose');
const replySchema = require('./Reply');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5 
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  replies: [replySchema]
}, { timestamps: true });

reviewSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

reviewSchema.methods.toggleLike = async function (userId) {
  const userIndex = this.likes.indexOf(userId);
  
  if (userIndex === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(userIndex, 1);
  }
  
  await this.save();
};

reviewSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.likeCount = doc.likes.length;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

reviewSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.likeCount = doc.likes.length;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = reviewSchema;
