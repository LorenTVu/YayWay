const express = require('express');
const { query, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const Song = require('../models/Song');

const router = express.Router();

// @route   GET /api/songs
// @desc    Search and browse songs
// @access  Public
router.get('/', optionalAuth, [
  query('q')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters'),
  query('genre')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Genre must be between 1 and 50 characters'),
  query('language')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Language must be between 1 and 20 characters'),
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Difficulty must be easy, medium, hard, or expert'),
  query('isPremium')
    .optional()
    .isBoolean()
    .withMessage('Premium filter must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['title', 'artist', 'duration', 'difficulty', 'stats.totalPlays', 'stats.averageScore', 'createdAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
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
      q = '',
      genre,
      language,
      difficulty,
      isPremium,
      page = 1,
      limit = 20,
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    // Build search options
    const searchOptions = {
      genre,
      language,
      difficulty,
      isPremium: isPremium === 'true' ? true : isPremium === 'false' ? false : undefined,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy,
      sortOrder
    };

    // Search songs
    const songs = await Song.search(q, searchOptions);
    const total = await Song.countDocuments({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { album: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      ...(genre && { genre }),
      ...(language && { language }),
      ...(difficulty && { difficulty }),
      ...(isPremium !== undefined && { isPremium })
    });

    res.json({
      songs: songs.map(song => song.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Search songs error:', error);
    res.status(500).json({
      error: 'Unable to search songs',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/:songId
// @desc    Get song by ID
// @access  Public
router.get('/:songId', optionalAuth, async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        error: 'Song not found',
        message: 'The specified song does not exist'
      });
    }

    if (!song.isActive) {
      return res.status(404).json({
        error: 'Song not available',
        message: 'This song is currently not available'
      });
    }

    // Increment play count
    await song.incrementPlays();

    res.json({
      song: song.getPublicData()
    });

  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({
      error: 'Unable to get song',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/popular
// @desc    Get popular songs
// @access  Public
router.get('/popular', optionalAuth, async (req, res) => {
  try {
    const { timeRange = '7d', limit = 20, page = 1 } = req.query;

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
      case 'all':
        startDate = null;
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    let query = { isActive: true };
    if (startDate) {
      query.createdAt = { $gte: startDate };
    }

    const songs = await Song.find(query)
      .sort({ 'stats.totalPlays': -1, 'stats.averageScore': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Song.countDocuments(query);

    res.json({
      songs: songs.map(song => song.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      timeRange
    });

  } catch (error) {
    console.error('Get popular songs error:', error);
    res.status(500).json({
      error: 'Unable to get popular songs',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/trending
// @desc    Get trending songs
// @access  Public
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const { timeRange = '7d', limit = 20, page = 1 } = req.query;

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

    const songs = await Song.find({
      isActive: true,
      createdAt: { $gte: startDate }
    })
    .sort({ 'stats.totalPerformances': -1, 'stats.averageScore': -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Song.countDocuments({
      isActive: true,
      createdAt: { $gte: startDate }
    });

    res.json({
      songs: songs.map(song => song.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      timeRange
    });

  } catch (error) {
    console.error('Get trending songs error:', error);
    res.status(500).json({
      error: 'Unable to get trending songs',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/genres
// @desc    Get all available genres
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    const genres = await Song.distinct('genre', { isActive: true });
    
    res.json({
      genres: genres.sort()
    });

  } catch (error) {
    console.error('Get genres error:', error);
    res.status(500).json({
      error: 'Unable to get genres',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/languages
// @desc    Get all available languages
// @access  Public
router.get('/languages', async (req, res) => {
  try {
    const languages = await Song.distinct('language', { isActive: true });
    
    res.json({
      languages: languages.sort()
    });

  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({
      error: 'Unable to get languages',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/artists
// @desc    Get all available artists
// @access  Public
router.get('/artists', async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;

    let query = { isActive: true };
    if (search) {
      query.artist = { $regex: search, $options: 'i' };
    }

    const artists = await Song.distinct('artist', query);
    const sortedArtists = artists.sort();
    
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedArtists = sortedArtists.slice(startIndex, endIndex);

    res.json({
      artists: paginatedArtists,
      totalPages: Math.ceil(artists.length / parseInt(limit)),
      currentPage: parseInt(page),
      total: artists.length
    });

  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({
      error: 'Unable to get artists',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/artist/:artistName
// @desc    Get songs by artist
// @access  Public
router.get('/artist/:artistName', optionalAuth, async (req, res) => {
  try {
    const { artistName } = req.params;
    const { page = 1, limit = 20, sortBy = 'title', sortOrder = 'asc' } = req.query;

    const songs = await Song.find({
      artist: { $regex: artistName, $options: 'i' },
      isActive: true
    })
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Song.countDocuments({
      artist: { $regex: artistName, $options: 'i' },
      isActive: true
    });

    res.json({
      songs: songs.map(song => song.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      artist: artistName
    });

  } catch (error) {
    console.error('Get songs by artist error:', error);
    res.status(500).json({
      error: 'Unable to get songs by artist',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/genre/:genreName
// @desc    Get songs by genre
// @access  Public
router.get('/genre/:genreName', optionalAuth, async (req, res) => {
  try {
    const { genreName } = req.params;
    const { page = 1, limit = 20, sortBy = 'title', sortOrder = 'asc' } = req.query;

    const songs = await Song.find({
      genre: { $regex: genreName, $options: 'i' },
      isActive: true
    })
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Song.countDocuments({
      genre: { $regex: genreName, $options: 'i' },
      isActive: true
    });

    res.json({
      songs: songs.map(song => song.getPublicData()),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      genre: genreName
    });

  } catch (error) {
    console.error('Get songs by genre error:', error);
    res.status(500).json({
      error: 'Unable to get songs by genre',
      message: 'Please try again later'
    });
  }
});

// @route   POST /api/songs/:songId/favorite
// @desc    Add song to favorites
// @access  Private
router.post('/:songId/favorite', authenticateToken, async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        error: 'Song not found',
        message: 'The specified song does not exist'
      });
    }

    // In a real app, you would have a UserFavorites model
    // For now, we'll just increment the favorite count
    await song.incrementFavorites();

    res.json({
      message: 'Song added to favorites successfully'
    });

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      error: 'Unable to add song to favorites',
      message: 'Please try again later'
    });
  }
});

// @route   DELETE /api/songs/:songId/favorite
// @desc    Remove song from favorites
// @access  Private
router.delete('/:songId/favorite', authenticateToken, async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        error: 'Song not found',
        message: 'The specified song does not exist'
      });
    }

    // In a real app, you would have a UserFavorites model
    // For now, we'll just decrement the favorite count
    await song.decrementFavorites();

    res.json({
      message: 'Song removed from favorites successfully'
    });

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      error: 'Unable to remove song from favorites',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/songs/random
// @desc    Get random songs
// @access  Public
router.get('/random', optionalAuth, async (req, res) => {
  try {
    const { limit = 10, genre, difficulty } = req.query;

    let query = { isActive: true };
    if (genre) query.genre = genre;
    if (difficulty) query.difficulty = difficulty;

    const songs = await Song.aggregate([
      { $match: query },
      { $sample: { size: parseInt(limit) } }
    ]);

    res.json({
      songs: songs.map(song => {
        const songDoc = new Song(song);
        return songDoc.getPublicData();
      })
    });

  } catch (error) {
    console.error('Get random songs error:', error);
    res.status(500).json({
      error: 'Unable to get random songs',
      message: 'Please try again later'
    });
  }
});

module.exports = router; 