const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/youtube/analyze
 * @desc    Analyze YouTube video for AI-generated content
 * @access  Public
 */
router.post('/analyze', youtubeController.analyzeVideo);

/**
 * @route   GET /api/youtube/history
 * @desc    Get user's YouTube analysis history
 * @access  Private
 */
router.get('/history', auth, youtubeController.getHistory);

module.exports = router;
