const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth, requireRoomHost, requireRoomParticipant } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/rooms
// @desc    Create a new karaoke room
// @access  Private
router.post('/', authenticateToken, [
  body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Room name must be between 3 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .trim(),
  body('type')
    .optional()
    .isIn(['solo', 'group', 'public', 'private'])
    .withMessage('Room type must be solo, group, public, or private'),
  body('settings.maxParticipants')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Max participants must be between 1 and 50'),
  body('settings.allowSpectators')
    .optional()
    .isBoolean()
    .withMessage('Allow spectators must be a boolean'),
  body('settings.autoStart')
    .optional()
    .isBoolean()
    .withMessage('Auto start must be a boolean'),
  body('settings.songDuration')
    .optional()
    .isInt({ min: 60, max: 600 })
    .withMessage('Song duration must be between 60 and 600 seconds'),
  body('settings.enableChat')
    .optional()
    .isBoolean()
    .withMessage('Enable chat must be a boolean'),
  body('settings.enableGifts')
    .optional()
    .isBoolean()
    .withMessage('Enable gifts must be a boolean'),
  body('isPasswordProtected')
    .optional()
    .isBoolean()
    .withMessage('Password protection must be a boolean'),
  body('password')
    .optional()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items'),
  body('tags.*')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const {
      name,
      description = '',
      type = 'public',
      settings = {},
      isPasswordProtected = false,
      password = null,
      tags = [],
      theme = {}
    } = req.body;

    // Create room
    const room = new Room({
      name,
      description,
      type,
      host: req.user._id,
      settings: {
        maxParticipants: settings.maxParticipants || 10,
        allowSpectators: settings.allowSpectators !== false,
        autoStart: settings.autoStart || false,
        songDuration: settings.songDuration || 180,
        enableChat: settings.enableChat !== false,
        enableGifts: settings.enableGifts !== false
      },
      isPasswordProtected,
      password: isPasswordProtected ? password : null,
      tags,
      theme: {
        backgroundColor: theme.backgroundColor || '#1a1a1a',
        accentColor: theme.accentColor || '#ff6b6b',
        backgroundImage: theme.backgroundImage || null
      }
    });

    // Add host as first participant
    await room.addParticipant(req.user._id, 'host');

    // Generate invite code for private rooms
    if (type === 'private') {
      await room.generateInviteCode();
    }

    await room.save();

    // Populate host information
    await room.populate('host', 'username displayName avatar');

    res.status(201).json({
      message: 'Room created successfully',
      room: room.getPublicData()
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      error: 'Unable to create room',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/rooms
// @desc    Get all public rooms
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type = 'public',
      status = 'active',
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      tags,
      search
    } = req.query;

    let query = {
      type: type === 'all' ? { $in: ['public', 'group'] } : type,
      isPasswordProtected: false
    };

    if (status !== 'all') {
      query.status = status;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(query)
      .populate('host', 'username displayName avatar')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Room.countDocuments(query);

    res.json({
      rooms: rooms.map(room => room.getPublicData()),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      error: 'Unable to get rooms',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/rooms/:roomId
// @desc    Get room by ID
// @access  Public
router.get('/:roomId', optionalAuth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate('host', 'username displayName avatar')
      .populate('participants.user', 'username displayName avatar isOnline')
      .populate('currentPerformance.performer', 'username displayName avatar')
      .populate('currentPerformance.song', 'title artist coverArt duration')
      .populate('queue.user', 'username displayName avatar')
      .populate('queue.song', 'title artist coverArt duration');

    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        message: 'The specified room does not exist'
      });
    }

    // Check if room is password protected
    if (room.isPasswordProtected && !req.user) {
      return res.status(403).json({
        error: 'Password required',
        message: 'This room requires a password to access'
      });
    }

    res.json({
      room: room.getPublicData()
    });

  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      error: 'Unable to get room',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/rooms/:roomId/join
// @desc    Join a room
// @access  Private
router.post('/:roomId/join', authenticateToken, [
  body('password')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Password is required for this room'),
  body('role')
    .optional()
    .isIn(['performer', 'spectator'])
    .withMessage('Role must be performer or spectator')
], async (req, res) => {
  try {
    const { roomId } = req.params;
    const { password, role = 'spectator' } = req.body;

    const room = await Room.findById(roomId)
      .populate('host', 'username displayName avatar')
      .populate('participants.user', 'username displayName avatar');

    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        message: 'The specified room does not exist'
      });
    }

    // Check if room is full
    if (room.participantCount >= room.settings.maxParticipants) {
      return res.status(400).json({
        error: 'Room is full',
        message: 'This room has reached its maximum capacity'
      });
    }

    // Check password if required
    if (room.isPasswordProtected) {
      if (!password) {
        return res.status(400).json({
          error: 'Password required',
          message: 'This room requires a password to join'
        });
      }
      if (room.password !== password) {
        return res.status(401).json({
          error: 'Invalid password',
          message: 'The password you entered is incorrect'
        });
      }
    }

    // Check if user is already in the room
    const existingParticipant = room.participants.find(p => 
      p.user._id.toString() === req.user._id.toString() && p.isActive
    );

    if (existingParticipant) {
      return res.status(400).json({
        error: 'Already in room',
        message: 'You are already a participant in this room'
      });
    }

    // Add user to room
    await room.addParticipant(req.user._id, role);

    res.json({
      message: 'Joined room successfully',
      room: room.getPublicData()
    });

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      error: 'Unable to join room',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/rooms/:roomId/leave
// @desc    Leave a room
// @access  Private
router.post('/:roomId/leave', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        message: 'The specified room does not exist'
      });
    }

    // Check if user is in the room
    const participant = room.participants.find(p => 
      p.user.toString() === req.user._id.toString() && p.isActive
    );

    if (!participant) {
      return res.status(400).json({
        error: 'Not in room',
        message: 'You are not a participant in this room'
      });
    }

    // Remove user from room
    await room.removeParticipant(req.user._id);

    // If host leaves, transfer host to next participant or end room
    if (room.host.toString() === req.user._id.toString()) {
      const nextHost = room.participants.find(p => p.isActive && p.user.toString() !== req.user._id.toString());
      if (nextHost) {
        room.host = nextHost.user;
        nextHost.role = 'host';
      } else {
        room.status = 'ended';
        room.endedAt = new Date();
      }
      await room.save();
    }

    res.json({
      message: 'Left room successfully'
    });

  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({
      error: 'Unable to leave room',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/rooms/:roomId/queue/add
// @desc    Add song to room queue
// @access  Private
router.post('/:roomId/queue/add', requireRoomParticipant, [
  body('songId')
    .isMongoId()
    .withMessage('Valid song ID is required'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be between 0 and 10')
], async (req, res) => {
  try {
    const { roomId } = req.params;
    const { songId, priority = 0 } = req.body;

    // Check if song exists (you might want to add Song model import)
    // const song = await Song.findById(songId);
    // if (!song) {
    //   return res.status(404).json({
    //     error: 'Song not found',
    //     message: 'The specified song does not exist'
    //   });
    // }

    await req.room.addToQueue(req.user._id, songId, priority);

    res.json({
      message: 'Song added to queue successfully',
      queue: req.room.queue
    });

  } catch (error) {
    console.error('Add to queue error:', error);
    res.status(500).json({
      error: 'Unable to add song to queue',
      message: 'Please try again later'
    });
  }
});

// @route   DELETE /api/rooms/:roomId/queue/:index
// @desc    Remove song from room queue
// @access  Private
router.delete('/:roomId/queue/:index', requireRoomHost, async (req, res) => {
  try {
    const { index } = req.params;
    const queueIndex = parseInt(index);

    if (isNaN(queueIndex) || queueIndex < 0) {
      return res.status(400).json({
        error: 'Invalid queue index',
        message: 'Please provide a valid queue index'
      });
    }

    await req.room.removeFromQueue(queueIndex);

    res.json({
      message: 'Song removed from queue successfully',
      queue: req.room.queue
    });

  } catch (error) {
    console.error('Remove from queue error:', error);
    res.status(500).json({
      error: 'Unable to remove song from queue',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/rooms/:roomId/start-performance
// @desc    Start a performance in the room
// @access  Private
router.post('/:roomId/start-performance', requireRoomHost, [
  body('performerId')
    .isMongoId()
    .withMessage('Valid performer ID is required'),
  body('songId')
    .isMongoId()
    .withMessage('Valid song ID is required')
], async (req, res) => {
  try {
    const { performerId, songId } = req.body;

    // Check if performer is in the room
    const performer = req.room.participants.find(p => 
      p.user.toString() === performerId && p.isActive
    );

    if (!performer) {
      return res.status(400).json({
        error: 'Performer not in room',
        message: 'The specified performer is not in this room'
      });
    }

    await req.room.startPerformance(performerId, songId);

    res.json({
      message: 'Performance started successfully',
      currentPerformance: req.room.currentPerformance
    });

  } catch (error) {
    console.error('Start performance error:', error);
    res.status(500).json({
      error: 'Unable to start performance',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/rooms/:roomId/end-performance
// @desc    End current performance in the room
// @access  Private
router.post('/:roomId/end-performance', requireRoomHost, async (req, res) => {
  try {
    await req.room.endPerformance();

    res.json({
      message: 'Performance ended successfully',
      currentPerformance: req.room.currentPerformance
    });

  } catch (error) {
    console.error('End performance error:', error);
    res.status(500).json({
      error: 'Unable to end performance',
      message: 'Please try again later'
    });
  }
});

// @route   PUT /api/rooms/:roomId
// @desc    Update room settings
// @access  Private
router.put('/:roomId', requireRoomHost, [
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Room name must be between 3 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .trim(),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items'),
  body('theme')
    .optional()
    .isObject()
    .withMessage('Theme must be an object')
], async (req, res) => {
  try {
    const { name, description, settings, tags, theme } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (settings) {
      Object.keys(settings).forEach(key => {
        updateData[`settings.${key}`] = settings[key];
      });
    }
    if (tags !== undefined) updateData.tags = tags;
    if (theme) {
      Object.keys(theme).forEach(key => {
        updateData[`theme.${key}`] = theme[key];
      });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.roomId,
      updateData,
      { new: true, runValidators: true }
    ).populate('host', 'username displayName avatar');

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom.getPublicData()
    });

  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      error: 'Unable to update room',
      message: 'Please try again later'
    });
  }
});

// @route   DELETE /api/rooms/:roomId
// @desc    Delete a room
// @access  Private
router.delete('/:roomId', requireRoomHost, async (req, res) => {
  try {
    req.room.status = 'ended';
    req.room.endedAt = new Date();
    await req.room.save();

    res.json({
      message: 'Room ended successfully'
    });

  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      error: 'Unable to delete room',
      message: 'Please try again later'
    });
  }
});

module.exports = router; 