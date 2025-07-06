const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  // Performance details
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  // Audio recording
  audioUrl: {
    type: String,
    default: null
  },
  audioDuration: {
    type: Number, // in seconds
    default: 0
  },
  // Performance scoring
  score: {
    total: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    pitch: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    rhythm: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timing: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    expression: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  // Detailed scoring data
  scoringData: {
    pitchAccuracy: [{
      time: Number, // timestamp in ms
      expected: Number, // expected frequency
      actual: Number, // actual frequency
      accuracy: Number // accuracy percentage
    }],
    rhythmAccuracy: [{
      time: Number,
      expected: Number,
      actual: Number,
      accuracy: Number
    }],
    timingAccuracy: [{
      time: Number,
      expected: Number,
      actual: Number,
      accuracy: Number
    }]
  },
  // Performance status
  status: {
    type: String,
    enum: ['recording', 'processing', 'completed', 'failed'],
    default: 'recording'
  },
  // Performance type
  type: {
    type: String,
    enum: ['solo', 'duet', 'group'],
    default: 'solo'
  },
  // Duet information
  duetPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  duetPart: {
    type: String,
    default: null
  },
  // Performance visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  gifts: {
    type: Number,
    default: 0
  },
  // Points earned
  pointsEarned: {
    type: Number,
    default: 0
  },
  // Performance notes
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  // Technical details
  recordingQuality: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  },
  // Performance tags
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  // Moderation
  isModerated: {
    type: Boolean,
    default: false
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNotes: {
    type: String,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
performanceSchema.index({ user: 1, createdAt: -1 });
performanceSchema.index({ song: 1, createdAt: -1 });
performanceSchema.index({ room: 1, createdAt: -1 });
performanceSchema.index({ status: 1 });
performanceSchema.index({ isPublic: 1, createdAt: -1 });
performanceSchema.index({ 'score.total': -1 });
performanceSchema.index({ views: -1 });
performanceSchema.index({ likes: -1 });

// Virtual for performance duration in minutes
performanceSchema.virtual('durationMinutes').get(function() {
  return Math.floor(this.duration / 60);
});

// Virtual for performance duration in MM:SS format
performanceSchema.virtual('durationFormatted').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for performance rating
performanceSchema.virtual('rating').get(function() {
  if (this.score.total === 0) return 0;
  
  if (this.score.total >= 90) return 5;
  if (this.score.total >= 80) return 4;
  if (this.score.total >= 70) return 3;
  if (this.score.total >= 60) return 2;
  return 1;
});

// Method to calculate total score
performanceSchema.methods.calculateTotalScore = function() {
  const weights = {
    pitch: 0.4,
    rhythm: 0.25,
    timing: 0.2,
    expression: 0.15
  };

  this.score.total = Math.round(
    this.score.pitch * weights.pitch +
    this.score.rhythm * weights.rhythm +
    this.score.timing * weights.timing +
    this.score.expression * weights.expression
  );

  return this.save();
};

// Method to increment views
performanceSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment likes
performanceSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Method to decrement likes
performanceSchema.methods.decrementLikes = function() {
  this.likes = Math.max(0, this.likes - 1);
  return this.save();
};

// Method to increment comments
performanceSchema.methods.incrementComments = function() {
  this.comments += 1;
  return this.save();
};

// Method to increment shares
performanceSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

// Method to add gifts
performanceSchema.methods.addGifts = function(giftCount) {
  this.gifts += giftCount;
  return this.save();
};

// Method to add points
performanceSchema.methods.addPoints = function(points) {
  this.pointsEarned += points;
  return this.save();
};

// Method to complete performance
performanceSchema.methods.completePerformance = function() {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  this.status = 'completed';
  return this.save();
};

// Method to get public performance data
performanceSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    user: this.user,
    song: this.song,
    room: this.room,
    startTime: this.startTime,
    endTime: this.endTime,
    duration: this.duration,
    durationFormatted: this.durationFormatted,
    audioUrl: this.audioUrl,
    audioDuration: this.audioDuration,
    score: this.score,
    rating: this.rating,
    status: this.status,
    type: this.type,
    duetPartner: this.duetPartner,
    duetPart: this.duetPart,
    isPublic: this.isPublic,
    isHighlighted: this.isHighlighted,
    views: this.views,
    likes: this.likes,
    comments: this.comments,
    shares: this.shares,
    gifts: this.gifts,
    pointsEarned: this.pointsEarned,
    notes: this.notes,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

// Static method to get top performances
performanceSchema.statics.getTopPerformances = function(options = {}) {
  const {
    limit = 10,
    skip = 0,
    sortBy = 'score.total',
    sortOrder = 'desc',
    userId = null,
    songId = null,
    roomId = null
  } = options;

  let query = {
    isPublic: true,
    status: 'completed'
  };

  if (userId) query.user = userId;
  if (songId) query.song = songId;
  if (roomId) query.room = roomId;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(query)
    .populate('user', 'username displayName avatar')
    .populate('song', 'title artist coverArt')
    .populate('room', 'name')
    .sort(sortOptions)
    .limit(limit)
    .skip(skip);
};

// Static method to get trending performances
performanceSchema.statics.getTrendingPerformances = function(options = {}) {
  const {
    limit = 10,
    skip = 0,
    timeRange = '7d' // 7 days
  } = options;

  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '1d':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return this.find({
    isPublic: true,
    status: 'completed',
    createdAt: { $gte: startDate }
  })
  .populate('user', 'username displayName avatar')
  .populate('song', 'title artist coverArt')
  .populate('room', 'name')
  .sort({ views: -1, likes: -1 })
  .limit(limit)
  .skip(skip);
};

module.exports = mongoose.model('Performance', performanceSchema); 