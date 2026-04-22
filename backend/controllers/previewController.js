const { validationResult } = require('express-validator');
const { getWebsitePreview } = require('../services/previewService');

/**
 * GET /api/preview
 * Fetch website preview (title, description, screenshot)
 */
async function getPreview(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Get preview data
    const preview = await getWebsitePreview(url);

    return res.json(preview);
  } catch (error) {
    next(error);
  }
}

module.exports = { getPreview };
