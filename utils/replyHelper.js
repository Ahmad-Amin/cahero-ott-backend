const addReply = async (Model, modelId, reviewId, userId, content) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const review = entity.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  const newReply = {
    content,
    createdBy: userId,
  };

  review.replies.push(newReply);
  await entity.save();

  return newReply;
};

// Delete a reply from a review
const deleteReply = async (Model, modelId, reviewId, replyId, userId) => {
  const entity = await Model.findById(modelId);
  if (!entity) {
    throw new Error('Entity not found');
  }

  const review = entity.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  const reply = review.replies.id(replyId);
  if (!reply) {
    throw new Error('Reply not found');
  }

  if (reply.createdBy.toString() !== userId) {
    throw new Error('Unauthorized to delete this reply');
  }

  review.replies.pull(replyId);
  await entity.save();
  return { message: 'Reply deleted successfully' };
};


// Fetch all replies for a specific review
const getReplies = async (Model, modelId, reviewId) => {
  const entity = await Model.findById(modelId).populate({
    path: 'reviews.replies.createdBy',
    select: 'firstName lastName email',
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  const review = entity.reviews.id(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  return review.replies;
};


module.exports = {
  addReply,
  deleteReply,
  getReplies
};
