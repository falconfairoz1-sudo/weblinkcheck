const express = require('express');
const { query } = require('express-validator');
const { getPreview } = require('../controllers/previewController');

const router = express.Router();

/**
 * GET /api/preview
 * Fetch website preview metadata and screenshot
 */
router.get(
  '/',
  [
    query('url')
      .trim()
      .notEmpty().withMessage('URL is required')
      .isURL().withMessage('Invalid URL format')
  ],
  getPreview
);

module.exports = router;
