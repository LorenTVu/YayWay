const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const Performance = require('../models/Performance');
const User = require('../models/User');
const Song = require('../models/Song');

const router = express.Router();

// @route   POST /api/performances
// @desc    Create a new performance
// @access  Private
router.post('/', authenticateToken, [
  body('songId')
    .isMongoId()
    .withMessage('Valid song ID is required'),
  body('roomId')
    .isMongoId()
    .withMessage('Valid room ID is required'),
  body('type')
    .optional()
    .isIn(['solo', 'duet', 'group'])
    .withMessage('Type must be solo, duet, or group'),
  body('duetPartner')
    .optional()
    .isMongoId()
    .withMessage('Valid duet partner ID is required'),
  body('duetPart')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Duet part must be between 1 and 50 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('Public visibility must be a boolean'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items')
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
      songId,
      roomId,
      type = 'solo',
      duetPartner = null,
      duetPart = null,
      isPublic = true,
      notes = '',
      tags = []
    } = req.body;

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        error: 'Song not found',
        message: 'The specified song does not exist'
      });
    }

    // Check if duet partner exists (if provided)
    if (duetPartner) {
      const partner = await User.findById(duetPartner);
      if (!partner) {
        return res.status(404).json({
          error: 'Duet partner not found',
          message: 'The specified duet partner does not exist'
        });
      }
    }

    // Create performance
    const performance = new Performance({
      user: req.user._id,
      song: songId,
      room: roomId,
      type,
      duetPartner,
      duetPart,
      isPublic,
      notes,
      tags,
      startTime: new Date(),
      status: 'recording'
    });

    await performance.save();

    // Populate references
    await performance.populate('song', 'title artist coverArt');
    await performance.populate('room', 'name');
    if (duetPartner) {
      await performance.populate('duetPartner', 'username displayName avatar');
    }

    res.status(201).json({
      message: 'Performance started successfully',
      performance: performance.getPublicData()
    });

  } catch (error) {
    console.error('Create performance error:', error);
    res.status(500).json({
      error: 'Unable to create performance',
      message: 'Please try again later'
    });
  }
});

// @route   PUT /api/performances/:performanceId
// @desc    Update performance (complete recording, add scoring, etc.)
// @access  Private
router.put('/:performanceId', authenticateToken, [
  body('audioUrl')
    .optional()
    .isURL()
    .withMessage('Audio URL must be a valid URL'),
  body('audioDuration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Audio duration must be a positive number'),
  body('score')
    .optional()
    .isObject()
    .withMessage('Score must be an object'),
  body('score.pitch')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Pitch score must be between 0 and 100'),
  body('score.rhythm')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Rhythm score must be between 0 and 100'),
  body('score.timing')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Timing score must be between 0 and 100'),
  body('score.expression')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Expression score must be between 0 and 100'),
  body('scoringData')
    .optional()
    .isObject()
    .withMessage('Scoring data must be an object'),
  body('status')
    .optional()
    .isIn(['recording', 'processing', 'completed', 'failed'])
    .withMessage('Status must be recording, processing, completed, or failed'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items')
], async (req, res) => {
  try {
    const { performanceId } = req.params;
    const {
      audioUrl,
      audioDuration,
      score,
      scoringData,
      status,
      notes,
      tags
    } = req.body;

    const performance = await Performance.findById(performanceId);
    if (!performance) {
      return res.status(404).json({
        error: 'Performance not found',
        message: 'The specified performance does not exist'
      });
    }

    // Check if user owns this performance
    if (performance.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own performances'
      });
    }

    // Update performance
    const updateData = {};
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl;
    if (audioDuration !== undefined) updateData.audioDuration = audioDuration;
    if (score) {
      Object.keys(score).forEach(key => {
        updateData[`score.${key}`] = score[key];
      });
    }
    if (scoringData) updateData.scoringData = scoringData;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (tags !== undefined) updateData.tags = tags;

    // If completing the performance
    if (status === 'completed') {
      updateData.endTime = new Date();
      updateData.duration = Math.floor((new Date() - performance.startTime) / 1000);
    }

    const updatedPerformance = await Performance.findByIdAndUpdate(
      performanceId,
      updateData,
      { new: true, runValidators: true }
    );

    // If performance is completed and has scoring, update user and song stats
    if (status === 'completed' && score) {
      // Calculate total score
      await updatedPerformance.calculateTotalScore();

      // Update user stats
      await req.user.updatePerformanceStats(updatedPerformance.score.total);

      // Update song stats
      const song = await Song.findById(performance.song);
      if (song) {
        await song.updateScore(updatedPerformance.score.total);
        await song.incrementPerformances();
      }
    }

    // Populate references
    await updatedPerformance.populate('song', 'title artist coverArt');
    await updatedPerformance.populate('room', 'name');
    await updatedPerformance.populate('user', 'username displayName avatar');
    if (updatedPerformance.duetPartner) {
      await updatedPerformance.populate('duetPartner', 'username displayName avatar');
    }

    res.json({
      message: 'Performance updated successfully',
      performance: updatedPerformance.getPublicData()
    });

  } catch (error) {
    console.error('Update performance error:', error);
    res.status(500).json({
      error: 'Unable to update performance',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/performances/:performanceId
// @desc    Get performance by ID
// @access  Public
router.get('/:performanceId', optionalAuth, async (req, res) => {
  try {
    const { performanceId } = req.params;

    const performance = await Performance.findById(performanceId)
      .populate('user', 'username displayName avatar')
      .populate('song', 'title artist coverArt duration')
      .populate('room', 'name')
      .populate('duetPartner', 'username displayName avatar');

    if (!performance) {
      return res.status(404).json({
        error: 'Performance not found',
        message: 'The specified performance does not exist'
      });
    }

    // Check if performance is public or user owns it
    if (!performance.isPublic && (!req.user || performance.user._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This performance is private'
      });
    }

    // Increment view count
    await performance.incrementViews();

    res.json({
      performance: performance.getPublicData()
    });

  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({
      error: 'Unable to get performance',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/performances
// @desc    Get performances with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      userId,
      songId,
      roomId,
      type,
      status = 'completed',
      isPublic = true,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    if (userId) query.user = userId;
    if (songId) query.song = songId;
    if (roomId) query.room = roomId;
    if (type) query.type = type;
    if (status) query.status = status;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';

    const performances = await Performance.find(query)
      .populate('user', 'username displayName avatar')
      .populate('song', 'title artist coverArt duration')
      .populate('room', 'name')
      .populate('duetPartner', 'username displayName avatar')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Performance.countDocuments(query);

    res.json({
      performances: performances.map(p => p.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get performances error:', error);
    res.status(500).json({
      error: 'Unable to get performances',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/performances/user/:userId
// @desc    Get performances by user
// @access  Public
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    let query = { user: userId };
    
    // If not the owner, only show public performances
    if (!req.user || req.user._id.toString() !== userId) {
      query.isPublic = true;
    }

    const performances = await Performance.find(query)
      .populate('song', 'title artist coverArt duration')
      .populate('room', 'name')
      .populate('duetPartner', 'username displayName avatar')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Performance.countDocuments(query);

    res.json({
      performances: performances.map(p => p.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get user performances error:', error);
    res.status(500).json({
      error: 'Unable to get user performances',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/performances/top
// @desc    Get top performances
// @access  Public
router.get('/top', optionalAuth, async (req, res) => {
  try {
    const {
      sortBy = 'score.total',
      sortOrder = 'desc',
      timeRange = 'all',
      limit = 20,
      page = 1
    } = req.query;

    const options = {
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    if (timeRange !== 'all') {
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

      options.userId = null;
      options.songId = null;
      options.roomId = null;
      options.startDate = startDate;
    }

    const performances = await Performance.getTopPerformances(options);

    res.json({
      performances: performances.map(p => p.getPublicData()),
      totalPages: Math.ceil(performances.length / parseInt(limit)),
      currentPage: parseInt(page),
      total: performances.length,
      sortBy,
      timeRange
    });

  } catch (error) {
    console.error('Get top performances error:', error);
    res.status(500).json({
      error: 'Unable to get top performances',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/performances/trending
// @desc    Get trending performances
// @access  Public
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const {
      timeRange = '7d',
      limit = 20,
      page = 1
    } = req.query;

    const options = {
      timeRange,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const performances = await Performance.getTrendingPerformances(options);

    res.json({
      performances: performances.map(p => p.getPublicData()),
      totalPages: Math.ceil(performances.length / parseInt(limit)),
      currentPage: parseInt(page),
      total: performances.length,
      timeRange
    });

  } catch (error) {
    console.error('Get trending performances error:', error);
    res.status(500).json({
      error: 'Unable to get trending performances',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/performances/:performanceId/like
// @desc    Like a performance
// @access  Private
router.post('/:performanceId/like', authenticateToken, async (req, res) => {
  try {
    const { performanceId } = req.params;

    const performance = await Performance.findById(performanceId);
    if (!performance) {
      return res.status(404).json({
        error: 'Performance not found',
        message: 'The specified performance does not exist'
      });
    }

    // In a real app, you would have a UserLikes model to track who liked what
    // For now, we'll just increment the like count
    await performance.incrementLikes();

    res.json({
      message: 'Performance liked successfully',
      likes: performance.likes
    });

  } catch (error) {
    console.error('Like performance error:', error);
    res.status(500).json({
      error: 'Unable to like performance',
      message: 'Please try again later'
    });
  }
});

// @route   DELETE /api/performances/:performanceId/like
// @desc    Unlike a performance
// @access  Private
router.delete('/:performanceId/like', authenticateToken, async (req, res) => {
  try {
    const { performanceId } = req.params;

    const performance = await Performance.findById(performanceId);
    if (!performance) {
      return res.status(404).json({
        error: 'Performance not found',
        message: 'The specified performance does not exist'
      });
    }

    // In a real app, you would have a UserLikes model to track who liked what
    // For now, we'll just decrement the like count
    await performance.decrementLikes();

    res.json({
      message: 'Performance unliked successfully',
      likes: performance.likes
    });

  } catch (error) {
    console.error('Unlike performance error:', error);
    res.status(500).json({
      error: 'Unable to unlike performance',
      message: 'Please try again later'
    });
  }
});

// @route   DELETE /api/performances/:performanceId
// @desc    Delete a performance
// @access  Private
router.delete('/:performanceId', authenticateToken, async (req, res) => {
  try {
    const { performanceId } = req.params;

    const performance = await Performance.findById(performanceId);
    if (!performance) {
      return res.status(404).json({
        error: 'Performance not found',
        message: 'The specified performance does not exist'
      });
    }

    // Check if user owns this performance
    if (performance.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own performances'
      });
    }

    await Performance.findByIdAndDelete(performanceId);

    res.json({
      message: 'Performance deleted successfully'
    });

  } catch (error) {
    console.error('Delete performance error:', error);
    res.status(500).json({
      error: 'Unable to delete performance',
      message: 'Please try again later'
    });
  }
});

module.exports = router; 