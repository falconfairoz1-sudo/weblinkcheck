const express = require('express');
const { body } = require('express-validator');
const { analyzeForChat } = require('../controllers/chatController');

const router = express.Router();

/**
 * POST /api/chat/analyze
 * Analyze a URL from chat message
 */
router.post(
  '/analyze',
  [
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ max: 2000 }).withMessage('Message too long')
  ],
  analyzeForChat
);

module.exports = router;
