const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  overview: {
    type: String,
    required: true,
    trim: true
  },
  coverImageUrl: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

lectureSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

lectureSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
