const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone Number is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'admin',
  },
  profileImageUrl: {
    type: String,
    trim: true,
  },
  favorites: [
    {
      type: {
        type: String,
        enum: ['Webinar', 'Book', 'Lecture'],
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'favorites.type', 
        required: true,
      },
    },
  ],
});

// Ensure no duplicate favorites
userSchema.index({ 'favorites.type': 1, 'favorites.item': 1 }, { unique: true });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Exclude password from the output

    // Transform the favorites array
    if (ret.favorites) {
      ret.favorites = ret.favorites.map(favorite => {
        const transformedFavorite = { ...favorite, id: favorite._id }; // Create an id field
        delete transformedFavorite._id; // Remove the _id field
        return transformedFavorite;
      });
    }

    return ret;
  },
});

userSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Exclude password from the output

    // Transform the favorites array
    if (ret.favorites) {
      ret.favorites = ret.favorites.map(favorite => {
        const transformedFavorite = { ...favorite, id: favorite._id }; // Create an id field
        delete transformedFavorite._id; // Remove the _id field
        return transformedFavorite;
      });
    }

    return ret;
  },
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
