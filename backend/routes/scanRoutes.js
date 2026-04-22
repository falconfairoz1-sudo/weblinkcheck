const express = require('express');
const { body } = require('express-validator');
const { scanUrl, bulkScanUrls, getScanStats } = require('../controllers/scanController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// URL validation middleware
const urlValidation = [
  body('url')
    .trim()
    .notEmpty().withMessage('URL is required')
    .isURL({ require_protocol: true, protocols: ['http', 'https', 'ftp'] })
    .withMessage('Please enter a valid URL (must include http:// or https://)')
    .isLength({ max: 2048 }).withMessage('URL is too long')
    .customSanitizer((value) => {
      // Basic XSS prevention
      return value.replace(/<[^>]*>/g, '');
    })
];

const bulkValidation = [
  body('urls')
    .isArray({ min: 1, max: 10 })
    .withMessage('Please provide 1-10 URLs as an array'),
  body('urls.*')
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Each item must be a valid URL')
];

// Routes
router.post('/', optionalAuth, urlValidation, scanUrl);
router.post('/bulk', optionalAuth, bulkValidation, bulkScanUrls);
router.get('/stats', getScanStats);

module.exports = router;
