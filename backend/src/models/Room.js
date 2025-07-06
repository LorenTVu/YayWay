const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  type: {
    type: String,
    enum: ['solo', 'group', 'public', 'private'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'paused', 'ended'],
    default: 'waiting'
  },
  // Room settings
  settings: {
    maxParticipants: {
      type: Number,
      default: 10,
      min: 1,
      max: 50
    },
    allowSpectators: {
      type: Boolean,
      default: true
    },
    autoStart: {
      type: Boolean,
      default: false
    },
    songDuration: {
      type: Number,
      default: 180, // 3 minutes in seconds
      min: 60,
      max: 600
    },
    enableChat: {
      type: Boolean,
      default: true
    },
    enableGifts: {
      type: Boolean,
      default: true
    }
  },
  // Participants
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['host', 'performer', 'spectator'],
      default: 'spectator'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  // Current performance
  currentPerformance: {
    performer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ['waiting', 'performing', 'finished'],
      default: 'waiting'
    }
  },
  // Performance queue
  queue: [{
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
    addedAt: {
      type: Date,
      default: Date.now
    },
    priority: {
      type: Number,
      default: 0 // Higher number = higher priority
    }
  }],
  // Room statistics
  stats: {
    totalPerformances: {
      type: Number,
      default: 0
    },
    totalViewers: {
      type: Number,
      default: 0
    },
    totalGifts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  // Privacy and access
  isPasswordProtected: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: null
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  // Tags for discovery
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  // Room theme/customization
  theme: {
    backgroundColor: {
      type: String,
      default: '#1a1a1a'
    },
    accentColor: {
      type: String,
      default: '#ff6b6b'
    },
    backgroundImage: {
      type: String,
      default: null
    }
  },
  // Timestamps
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
roomSchema.index({ type: 1, status: 1 });
roomSchema.index({ host: 1 });
roomSchema.index({ 'participants.user': 1 });
roomSchema.index({ tags: 1 });
roomSchema.index({ inviteCode: 1 });
roomSchema.index({ createdAt: -1 });

// Virtual for current participant count
roomSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Virtual for current viewer count
roomSchema.virtual('viewerCount').get(function() {
  return this.participants.filter(p => p.role === 'spectator' && p.isActive).length;
});

// Virtual for current performer count
roomSchema.virtual('performerCount').get(function() {
  return this.participants.filter(p => p.role === 'performer' && p.isActive).length;
});

// Method to add participant
roomSchema.methods.addParticipant = function(userId, role = 'spectator') {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (existingParticipant) {
    existingParticipant.isActive = true;
    existingParticipant.role = role;
    existingParticipant.joinedAt = new Date();
  } else {
    this.participants.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      isActive: true
    });
  }
  
  return this.save();
};

// Method to remove participant
roomSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.isActive = false;
  }
  return this.save();
};

// Method to add song to queue
roomSchema.methods.addToQueue = function(userId, songId, priority = 0) {
  this.queue.push({
    user: userId,
    song: songId,
    addedAt: new Date(),
    priority: priority
  });
  
  // Sort queue by priority (highest first) and then by addedAt
  this.queue.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    return a.addedAt - b.addedAt;
  });
  
  return this.save();
};

// Method to remove song from queue
roomSchema.methods.removeFromQueue = function(queueIndex) {
  if (queueIndex >= 0 && queueIndex < this.queue.length) {
    this.queue.splice(queueIndex, 1);
  }
  return this.save();
};

// Method to get next song from queue
roomSchema.methods.getNextSong = function() {
  return this.queue.length > 0 ? this.queue[0] : null;
};

// Method to start performance
roomSchema.methods.startPerformance = function(performerId, songId) {
  this.currentPerformance = {
    performer: performerId,
    song: songId,
    startTime: new Date(),
    status: 'performing'
  };
  this.status = 'active';
  
  if (!this.startedAt) {
    this.startedAt = new Date();
  }
  
  return this.save();
};

// Method to end performance
roomSchema.methods.endPerformance = function() {
  if (this.currentPerformance) {
    this.currentPerformance.endTime = new Date();
    this.currentPerformance.status = 'finished';
    this.stats.totalPerformances += 1;
  }
  
  // Remove the finished song from queue
  if (this.queue.length > 0) {
    this.queue.shift();
  }
  
  return this.save();
};

// Method to generate invite code
roomSchema.methods.generateInviteCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  this.inviteCode = result;
  return this.save();
};

// Method to get public room data
roomSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    type: this.type,
    status: this.status,
    settings: this.settings,
    host: this.host,
    participantCount: this.participantCount,
    viewerCount: this.viewerCount,
    performerCount: this.performerCount,
    currentPerformance: this.currentPerformance,
    queueLength: this.queue.length,
    stats: this.stats,
    isPasswordProtected: this.isPasswordProtected,
    tags: this.tags,
    theme: this.theme,
    createdAt: this.createdAt,
    startedAt: this.startedAt
  };
};

module.exports = mongoose.model('Room', roomSchema); 