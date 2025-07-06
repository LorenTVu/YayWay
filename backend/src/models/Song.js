const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  artist: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  album: {
    type: String,
    trim: true,
    maxlength: 200,
    default: ''
  },
  // Song metadata
  duration: {
    type: Number, // in seconds
    required: true,
    min: 30,
    max: 600
  },
  genre: {
    type: String,
    trim: true,
    maxlength: 50,
    default: 'Pop'
  },
  language: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'English'
  },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  // Audio files
  instrumentalUrl: {
    type: String,
    required: true
  },
  previewUrl: {
    type: String,
    default: null
  },
  // Lyrics and synchronization
  lyrics: [{
    line: {
      type: String,
      required: true
    },
    startTime: {
      type: Number, // in milliseconds
      required: true
    },
    endTime: {
      type: Number, // in milliseconds
      required: true
    },
    syllables: [{
      text: String,
      startTime: Number,
      endTime: Number
    }]
  }],
  // Song difficulty and scoring
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  bpm: {
    type: Number,
    min: 60,
    max: 200
  },
  key: {
    type: String,
    maxlength: 10
  },
  // Song status and availability
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  // Song statistics
  stats: {
    totalPlays: {
      type: Number,
      default: 0
    },
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
    favoriteCount: {
      type: Number,
      default: 0
    }
  },
  // Tags for discovery
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  // Song cover art
  coverArt: {
    type: String,
    default: null
  },
  // Song description
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  // Duet information
  duetInfo: {
    isDuet: {
      type: Boolean,
      default: false
    },
    duetParts: [{
      name: {
        type: String,
        required: true
      },
      lyrics: [{
        line: String,
        startTime: Number,
        endTime: Number
      }]
    }]
  },
  // Copyright and licensing
  copyright: {
    type: String,
    maxlength: 200,
    default: ''
  },
  license: {
    type: String,
    enum: ['free', 'premium', 'licensed'],
    default: 'free'
  },
  // Song source
  source: {
    type: String,
    enum: ['uploaded', 'licensed', 'user-generated'],
    default: 'licensed'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
songSchema.index({ title: 1, artist: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ genre: 1 });
songSchema.index({ language: 1 });
songSchema.index({ tags: 1 });
songSchema.index({ isActive: 1 });
songSchema.index({ isPremium: 1 });
songSchema.index({ difficulty: 1 });
songSchema.index({ 'stats.totalPlays': -1 });
songSchema.index({ 'stats.averageScore': -1 });

// Virtual for song display name
songSchema.virtual('displayName').get(function() {
  return `${this.title} - ${this.artist}`;
});

// Virtual for duration in minutes
songSchema.virtual('durationMinutes').get(function() {
  return Math.floor(this.duration / 60);
});

// Virtual for duration in MM:SS format
songSchema.virtual('durationFormatted').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Method to increment play count
songSchema.methods.incrementPlays = function() {
  this.stats.totalPlays += 1;
  return this.save();
};

// Method to increment performance count
songSchema.methods.incrementPerformances = function() {
  this.stats.totalPerformances += 1;
  return this.save();
};

// Method to update average score
songSchema.methods.updateScore = function(newScore) {
  const totalScore = this.stats.averageScore * this.stats.totalPerformances + newScore;
  this.stats.totalPerformances += 1;
  this.stats.averageScore = totalScore / this.stats.totalPerformances;
  return this.save();
};

// Method to add points
songSchema.methods.addPoints = function(points) {
  this.stats.totalPoints += points;
  return this.save();
};

// Method to increment favorite count
songSchema.methods.incrementFavorites = function() {
  this.stats.favoriteCount += 1;
  return this.save();
};

// Method to decrement favorite count
songSchema.methods.decrementFavorites = function() {
  this.stats.favoriteCount = Math.max(0, this.stats.favoriteCount - 1);
  return this.save();
};

// Method to get lyrics at specific time
songSchema.methods.getLyricsAtTime = function(timeMs) {
  return this.lyrics.find(lyric => 
    timeMs >= lyric.startTime && timeMs <= lyric.endTime
  );
};

// Method to get current line index
songSchema.methods.getCurrentLineIndex = function(timeMs) {
  return this.lyrics.findIndex(lyric => 
    timeMs >= lyric.startTime && timeMs <= lyric.endTime
  );
};

// Method to get public song data
songSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    title: this.title,
    artist: this.artist,
    album: this.album,
    duration: this.duration,
    durationFormatted: this.durationFormatted,
    genre: this.genre,
    language: this.language,
    year: this.year,
    instrumentalUrl: this.instrumentalUrl,
    previewUrl: this.previewUrl,
    difficulty: this.difficulty,
    bpm: this.bpm,
    key: this.key,
    isPremium: this.isPremium,
    isExplicit: this.isExplicit,
    stats: this.stats,
    tags: this.tags,
    coverArt: this.coverArt,
    description: this.description,
    duetInfo: this.duetInfo,
    copyright: this.copyright,
    license: this.license,
    createdAt: this.createdAt
  };
};

// Method to search songs
songSchema.statics.search = function(query, options = {}) {
  const {
    genre,
    language,
    difficulty,
    isPremium,
    limit = 20,
    skip = 0,
    sortBy = 'title',
    sortOrder = 'asc'
  } = options;

  let searchQuery = {
    isActive: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { artist: { $regex: query, $options: 'i' } },
      { album: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (genre) searchQuery.genre = genre;
  if (language) searchQuery.language = language;
  if (difficulty) searchQuery.difficulty = difficulty;
  if (isPremium !== undefined) searchQuery.isPremium = isPremium;

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(searchQuery)
    .sort(sortOptions)
    .limit(limit)
    .skip(skip)
    .select('title artist album duration genre language difficulty isPremium stats coverArt');
};

module.exports = mongoose.model('Song', songSchema); 