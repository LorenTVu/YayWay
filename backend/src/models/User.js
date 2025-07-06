const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  // Performance stats
  totalPerformances: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  // Social features
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      roomInvites: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'followers', 'private'],
        default: 'public'
      },
      showOnlineStatus: { type: Boolean, default: true }
    }
  },
  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    default: null
  },
  // Subscription/Premium features
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    expiresAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ 'subscription.type': 1 });

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    displayName: this.displayName,
    avatar: this.avatar,
    bio: this.bio,
    isOnline: this.isOnline,
    lastSeen: this.lastSeen,
    totalPerformances: this.totalPerformances,
    averageScore: this.averageScore,
    totalPoints: this.totalPoints,
    followerCount: this.followerCount,
    followingCount: this.followingCount,
    isVerified: this.isVerified,
    subscription: this.subscription,
    createdAt: this.createdAt
  };
};

// Method to update online status
userSchema.methods.updateOnlineStatus = function(isOnline) {
  this.isOnline = isOnline;
  this.lastSeen = new Date();
  return this.save();
};

// Method to update performance stats
userSchema.methods.updatePerformanceStats = function(score) {
  this.totalPerformances += 1;
  this.averageScore = ((this.averageScore * (this.totalPerformances - 1)) + score) / this.totalPerformances;
  return this.save();
};

// Method to add points
userSchema.methods.addPoints = function(points) {
  this.totalPoints += points;
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 