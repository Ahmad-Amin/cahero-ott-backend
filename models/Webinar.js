const mongoose = require('mongoose');
const reviewSchema = require('./review');
const { Schema } = mongoose;

// Define the schema for the event
const webinarSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  startDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  },
  isLive: {
    type: Boolean,
    default: false,
  },
  coverImageUrl: {
    type: String,
    required: false,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviews: [reviewSchema]
}, { timestamps: true });

webinarSchema.pre('save', function (next) {
  const [startHour, startMinute] = this.startTime.split(':').map(Number);
  const [endHour, endMinute] = this.endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  if (endTotalMinutes <= startTotalMinutes) {
    return next(new Error('End time must be after start time'));
  }

  next();
});

// Add toJSON and toObject transformation
webinarSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    delete ret.updatedAt;
    return ret;
  }
});

webinarSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.user;
    delete ret.updatedAt;
    return ret;
  }
});

const Webinar = mongoose.model('Webinar', webinarSchema);

module.exports = Webinar;
