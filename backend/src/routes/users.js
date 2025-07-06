const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/profile/:username
// @desc    Get user profile by username
// @access  Public
router.get('/profile/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // Check privacy settings
    if (user.preferences.privacy.profileVisibility === 'private' && 
        (!req.user || req.user._id.toString() !== user._id.toString())) {
      return res.status(403).json({
        error: 'Profile private',
        message: 'This profile is private'
      });
    }

    if (user.preferences.privacy.profileVisibility === 'followers' && 
        (!req.user || req.user._id.toString() !== user._id.toString())) {
      const isFollowing = user.followers.includes(req.user._id);
      if (!isFollowing) {
        return res.status(403).json({
          error: 'Profile restricted',
          message: 'This profile is only visible to followers'
        });
      }
    }

    res.json({
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Unable to get user profile',
      message: 'Please try again later'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, [
  body('displayName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters')
    .trim(),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters')
    .trim(),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
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

    const { displayName, bio, avatar } = req.body;
    const updateData = {};

    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Unable to update profile',
      message: 'Please try again later'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticateToken, [
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('notifications.roomInvites')
    .optional()
    .isBoolean()
    .withMessage('Room invites must be a boolean'),
  body('privacy.profileVisibility')
    .optional()
    .isIn(['public', 'followers', 'private'])
    .withMessage('Profile visibility must be public, followers, or private'),
  body('privacy.showOnlineStatus')
    .optional()
    .isBoolean()
    .withMessage('Show online status must be a boolean')
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

    const { theme, notifications, privacy } = req.body;
    const updateData = {};

    if (theme !== undefined) updateData['preferences.theme'] = theme;
    if (notifications) {
      if (notifications.email !== undefined) updateData['preferences.notifications.email'] = notifications.email;
      if (notifications.push !== undefined) updateData['preferences.notifications.push'] = notifications.push;
      if (notifications.roomInvites !== undefined) updateData['preferences.notifications.roomInvites'] = notifications.roomInvites;
    }
    if (privacy) {
      if (privacy.profileVisibility !== undefined) updateData['preferences.privacy.profileVisibility'] = privacy.profileVisibility;
      if (privacy.showOnlineStatus !== undefined) updateData['preferences.privacy.showOnlineStatus'] = privacy.showOnlineStatus;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Preferences updated successfully',
      preferences: updatedUser.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Unable to update preferences',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/users/follow/:userId
// @desc    Follow a user
// @access  Private
router.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        error: 'Cannot follow yourself',
        message: 'You cannot follow your own account'
      });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // Check if already following
    if (req.user.following.includes(userId)) {
      return res.status(400).json({
        error: 'Already following',
        message: 'You are already following this user'
      });
    }

    // Add to following
    req.user.following.push(userId);
    await req.user.save();

    // Add to user's followers
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    res.json({
      message: 'User followed successfully',
      followingCount: req.user.followingCount,
      followerCount: userToFollow.followerCount
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      error: 'Unable to follow user',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/users/unfollow/:userId
// @desc    Unfollow a user
// @access  Private
router.post('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    // Check if following
    if (!req.user.following.includes(userId)) {
      return res.status(400).json({
        error: 'Not following',
        message: 'You are not following this user'
      });
    }

    // Remove from following
    req.user.following = req.user.following.filter(id => id.toString() !== userId);
    await req.user.save();

    // Remove from user's followers
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id.toString());
    await userToUnfollow.save();

    res.json({
      message: 'User unfollowed successfully',
      followingCount: req.user.followingCount,
      followerCount: userToUnfollow.followerCount
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      error: 'Unable to unfollow user',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/users/followers/:userId
// @desc    Get user's followers
// @access  Public
router.get('/followers/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    const followers = await User.find({
      _id: { $in: user.followers }
    })
    .select('username displayName avatar isOnline lastSeen')
    .sort({ lastSeen: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = user.followers.length;

    res.json({
      followers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      error: 'Unable to get followers',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/users/following/:userId
// @desc    Get users that a user is following
// @access  Public
router.get('/following/:userId', optionalAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The specified user does not exist'
      });
    }

    const following = await User.find({
      _id: { $in: user.following }
    })
    .select('username displayName avatar isOnline lastSeen')
    .sort({ lastSeen: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = user.following.length;

    res.json({
      following,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      error: 'Unable to get following',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users
// @access  Public
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search query (minimum 2 characters)'
      });
    }

    const searchQuery = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ],
      isBanned: false
    };

    const users = await User.find(searchQuery)
      .select('username displayName avatar isOnline lastSeen totalPerformances averageScore')
      .sort({ isOnline: -1, lastSeen: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(searchQuery);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Unable to search users',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/users/online
// @desc    Get online users
// @access  Public
router.get('/online', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find({ 
      isOnline: true,
      isBanned: false,
      'preferences.privacy.showOnlineStatus': true
    })
    .select('username displayName avatar lastSeen totalPerformances averageScore')
    .sort({ lastSeen: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await User.countDocuments({ 
      isOnline: true,
      isBanned: false,
      'preferences.privacy.showOnlineStatus': true
    });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      error: 'Unable to get online users',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get user leaderboard
// @access  Public
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { type = 'score', timeRange = 'all', page = 1, limit = 20 } = req.query;

    let sortField;
    let timeFilter = {};

    switch (type) {
      case 'score':
        sortField = 'averageScore';
        break;
      case 'performances':
        sortField = 'totalPerformances';
        break;
      case 'points':
        sortField = 'totalPoints';
        break;
      default:
        sortField = 'averageScore';
    }

    // Apply time filter if specified
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      timeFilter.createdAt = { $gte: startDate };
    }

    const users = await User.find({
      isBanned: false,
      ...timeFilter
    })
    .select('username displayName avatar totalPerformances averageScore totalPoints')
    .sort({ [sortField]: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await User.countDocuments({
      isBanned: false,
      ...timeFilter
    });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      type,
      timeRange
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Unable to get leaderboard',
      message: 'Please try again later'
    });
  }
});

module.exports = router; 