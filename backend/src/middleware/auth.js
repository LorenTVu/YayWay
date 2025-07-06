const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({ 
        error: 'Account banned',
        message: user.banReason || 'Your account has been suspended'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token is not valid'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Token has expired, please login again'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      message: 'Internal server error'
    });
  }
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && !user.isBanned) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Middleware to check if user is premium
const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please login to access this feature'
    });
  }

  if (req.user.subscription.type === 'free') {
    return res.status(403).json({ 
      error: 'Premium required',
      message: 'This feature requires a premium subscription'
    });
  }

  // Check if premium subscription is expired
  if (req.user.subscription.expiresAt && new Date() > req.user.subscription.expiresAt) {
    return res.status(403).json({ 
      error: 'Subscription expired',
      message: 'Your premium subscription has expired'
    });
  }

  next();
};

// Middleware to check if user is verified
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please login to access this feature'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({ 
      error: 'Verification required',
      message: 'Please verify your account to access this feature'
    });
  }

  next();
};

// Middleware to check if user is room host
const requireRoomHost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please login to access this feature'
      });
    }

    const roomId = req.params.roomId || req.body.roomId;
    if (!roomId) {
      return res.status(400).json({ 
        error: 'Room ID required',
        message: 'Please provide a room ID'
      });
    }

    const Room = require('../models/Room');
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found',
        message: 'The specified room does not exist'
      });
    }

    if (room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Host access required',
        message: 'Only the room host can perform this action'
      });
    }

    req.room = room;
    next();
  } catch (error) {
    console.error('Room host middleware error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Internal server error'
    });
  }
};

// Middleware to check if user is room participant
const requireRoomParticipant = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please login to access this feature'
      });
    }

    const roomId = req.params.roomId || req.body.roomId;
    if (!roomId) {
      return res.status(400).json({ 
        error: 'Room ID required',
        message: 'Please provide a room ID'
      });
    }

    const Room = require('../models/Room');
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found',
        message: 'The specified room does not exist'
      });
    }

    const isParticipant = room.participants.some(p => 
      p.user.toString() === req.user._id.toString() && p.isActive
    );

    if (!isParticipant && room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Room access required',
        message: 'You must be a participant in this room to perform this action'
      });
    }

    req.room = room;
    next();
  } catch (error) {
    console.error('Room participant middleware error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Internal server error'
    });
  }
};

// Rate limiting for authentication attempts
const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requirePremium,
  requireVerified,
  requireRoomHost,
  requireRoomParticipant,
  authRateLimit
}; 