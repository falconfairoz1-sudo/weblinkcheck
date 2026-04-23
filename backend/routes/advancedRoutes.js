const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  checkSSL, analyzeEmailHeaders, findSubdomains, pingHost,
  checkLeakedPassword, addScanNote, getScanNotes,
  getActivityHeatmap, getPhishingQuiz, submitPhishingQuiz,
  getScanTrend, bulkDomainReputation
} = require('../controllers/advancedController');

// Public routes
router.post('/ssl-check', checkSSL);
router.post('/email-headers', analyzeEmailHeaders);
router.post('/subdomains', findSubdomains);
router.post('/ping', pingHost);
router.post('/leaked-password', checkLeakedPassword);
router.post('/bulk-reputation', bulkDomainReputation);
router.get('/quiz', getPhishingQuiz);
router.post('/quiz/submit', submitPhishingQuiz);

// Protected routes
router.post('/scan-notes', protect, addScanNote);
router.get('/scan-notes/:scanId', optionalAuth, getScanNotes);
router.get('/heatmap', protect, getActivityHeatmap);
router.get('/trend', protect, getScanTrend);

module.exports = router;
