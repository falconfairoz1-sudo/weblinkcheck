const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  expandUrl, ipLookup, compareUrls, voteOnScan, getVotes,
  getThreatFeed, getScanStreak, getBookmarks, addBookmark, removeBookmark,
  checkPasswordStrength, getDomainInfo, getRecentScans
} = require('../controllers/toolsController');

router.post('/expand-url', expandUrl);
router.post('/ip-lookup', ipLookup);
router.post('/compare', compareUrls);
router.post('/vote', voteOnScan);
router.get('/votes/:scanId', getVotes);
router.get('/threat-feed', getThreatFeed);
router.get('/streak', protect, getScanStreak);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks', protect, addBookmark);
router.delete('/bookmarks', protect, removeBookmark);
router.post('/password-strength', checkPasswordStrength);
router.post('/domain-info', getDomainInfo);
router.get('/recent-scans', getRecentScans);

module.exports = router;
