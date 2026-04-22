const youtubeAIDetector = require('../services/youtubeAIDetector');

/**
 * Analyze YouTube video for AI-generated content
 */
exports.analyzeVideo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'YouTube URL is required'
      });
    }

    // Validate YouTube URL format
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubePattern.test(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube URL format'
      });
    }

    // Perform AI detection
    const result = await youtubeAIDetector.detectAIContent(url);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);

  } catch (error) {
    console.error('YouTube analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze YouTube video',
      details: error.message
    });
  }
};

/**
 * Get analysis history for authenticated user
 */
exports.getHistory = async (req, res) => {
  try {
    // TODO: Implement database storage for analysis history
    res.json({
      success: true,
      message: 'History feature coming soon',
      history: []
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history'
    });
  }
};
