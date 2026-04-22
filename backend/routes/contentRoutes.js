const express = require('express');
const { body } = require('express-validator');
const { scanContent } = require('../controllers/contentController');

const router = express.Router();

/**
 * POST /api/content/scan
 * Scan content for scams
 */
router.post(
  '/scan',
  [
    body('content')
      .trim()
      .notEmpty().withMessage('Content is required')
      .isLength({ max: 10000 }).withMessage('Content too long (max 10000 characters)')
  ],
  scanContent
);

module.exports = router;
