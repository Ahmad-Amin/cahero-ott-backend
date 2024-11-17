const User = require('../models/User');

async function addToFavorites(userId, type, itemId) {
  // Step 1: Validate input
  const validTypes = ['Webinar', 'Book', 'Lecture']; // Allowed types
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid type. Allowed types are: ${validTypes.join(', ')}`);
  }

  if (!itemId) {
    throw new Error('Item ID is required');
  }

  // Step 2: Check if the favorite already exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const alreadyFavorited = user.favorites.some(
    (favorite) => favorite.type === type && favorite.item.toString() === itemId
  );

  if (alreadyFavorited) {
    throw new Error(`${type} is already in favorites`);
  }

  // Step 3: Add to favorites
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { favorites: { type, item: itemId } }, // Prevent duplicates at the database level
    },
    { new: true }
  ).populate('favorites.item');

  return updatedUser;
}


async function removeFromFavorites(userId, type, itemId) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { favorites: { type, item: itemId } },
    },
    { new: true }
  ).populate('favorites.item'); 
  return user;
}

const getFavorites = async (userId, type) => {
  const user = await User.findById(userId).populate('favorites.item');
  if (!user) {
    throw new Error('User not found');
  }

  // Filter and transform the favorites
  const filteredFavorites = user.favorites
    .filter(favorite => favorite.type === type)
    .map(favorite => {
      const transformedFavorite = { ...favorite.toObject() };
      if (transformedFavorite.item && transformedFavorite.item._id) {
        transformedFavorite.item.id = transformedFavorite.item._id.toString();
        delete transformedFavorite.item._id;
      }

      transformedFavorite.id = transformedFavorite._id.toString();
      delete transformedFavorite._id;
      return transformedFavorite;
    });

  return filteredFavorites;
};


module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};
