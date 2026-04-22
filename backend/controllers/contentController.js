const { validationResult } = require('express-validator');
const { analyzeContent } = require('../services/contentAnalyzer');

/**
 * POST /api/content/scan
 * Scan content for scams
 */
async function scanContent(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required and must be text' });
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content too long (max 10000 characters)' });
    }

    // Analyze content
    const analysis = analyzeContent(content);

    // Determine status
    let status = 'safe';
    if (analysis.riskScore >= 70) {
      status = 'malicious';
    } else if (analysis.riskScore >= 40) {
      status = 'suspicious';
    }

    const result = {
      content: content.substring(0, 200), // Store first 200 chars
      contentLength: content.length,
      status,
      riskScore: analysis.riskScore,
      scamType: analysis.scamType,
      indicators: analysis.indicators,
      confidence: analysis.confidence,
      details: analysis.details,
      scannedAt: new Date().toISOString()
    };

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { scanContent };
