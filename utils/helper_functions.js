const nodemailer = require('nodemailer');
const User = require('../models/User');
const moment = require('moment');

// Function to fetch users based on role
const fetchUsersByRole = async (role) => {
  try {
    const users = await User.find({ role }, 'email');
    return users.map(user => user.email);
  } catch (error) {
    throw new Error('Error fetching users by role');
  }
};

// Function to send emails to a list of recipients
const sendEmails = async (recipients, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      subject,
      text: message,
    };

    // Sending emails to all recipients
    const emailPromises = recipients.map((email) =>
      transporter.sendMail({ ...mailOptions, to: email })
    );
    await Promise.all(emailPromises);
  } catch (error) {
    throw new Error('Error sending emails');
  }
};

const applyDateFilter = (filter, target) => {
  const today = moment().startOf('day');

  if (target === 'today') {
    filter.createdAt = {
      $gte: today.toDate(),
      $lt: moment(today).endOf('day').toDate(),
    };
  } else if (target === 'this_week') {
    filter.createdAt = {
      $gte: today.startOf('week').toDate(),
      $lt: moment(today).endOf('week').toDate(),
    };
  } else if (target === 'this_month') {
    filter.createdAt = {
      $gte: today.startOf('month').toDate(),
      $lt: moment(today).endOf('month').toDate(),
    };
  }

  return filter;
}


const addReview = async (Model, modelId, userId, content, rating) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const newReview = {
    content,
    rating,
    createdBy: userId,
  };

  entity.reviews.push(newReview);
  await entity.save();

  return newReview;
};

const getReviews = async (Model, modelId) => {
  const entity = await Model.findById(modelId)
    .populate('reviews.createdBy', 'firstName lastName email') // Populate createdBy for reviews
    .populate('reviews.replies.createdBy', 'firstName lastName email'); // Populate createdBy for replies

  if (!entity) {
    throw new Error('Entity not found');
  }

  const sortedReviews = entity.reviews
    .map(review => ({
      ...review.toJSON(),
      likeCount: review.likeCount,
      replies: review.replies.map(reply => ({
        ...reply.toJSON(),
      }))
    }))
    .sort((a, b) => b.createdAt - a.createdAt);

  return sortedReviews;
};


const updateReview = async (Model, modelId, reviewId, userId, content, rating) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const review = entity.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  if (review.createdBy.toString() !== userId) {
    throw new Error('Unauthorized to update this review');
  }

  review.content = content;
  review.rating = rating;
  await entity.save();

  return review;
};

const deleteReview = async (Model, modelId, reviewId, userId) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const review = entity.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  if (review.createdBy.toString() !== userId) {
    throw new Error('Unauthorized to delete this review');
  }

  entity.reviews.pull(reviewId);
  await entity.save();

  return { message: 'Review deleted successfully' };
};

const getReviewStats = async (Model, modelId) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const reviews = entity.reviews;

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  const ratingsCount = [0, 0, 0, 0, 0]; // Index 0 for 1 star, Index 4 for 5 stars

  reviews.forEach((review) => {
    const ratingIndex = Math.round(review.rating) - 1; // Ratings are from 1 to 5
    if (ratingIndex >= 0 && ratingIndex < 5) {
      ratingsCount[ratingIndex]++;
    }
  });

  return {
    totalReviews,
    averageRating: parseFloat(averageRating.toFixed(1)), // Format to one decimal place
    ratings: [
      { stars: 5, count: ratingsCount[4] },
      { stars: 4, count: ratingsCount[3] },
      { stars: 3, count: ratingsCount[2] },
      { stars: 2, count: ratingsCount[1] },
      { stars: 1, count: ratingsCount[0] },
    ],
  };
};

const toggleReviewLike = async (Model, modelId, reviewId, userId) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const review = entity.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  review.toggleLike(userId);
  await entity.save();

  return { message: 'Like status updated', likeCount: review.likeCount };
};

module.exports = {
  fetchUsersByRole,
  sendEmails,
  applyDateFilter,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewStats,
  toggleReviewLike
};
