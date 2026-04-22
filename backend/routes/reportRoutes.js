const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

/**
 * POST /api/report/generate
 * Generate and download a scanner report
 */
router.post('/generate', reportController.generateReport);

/**
 * GET /api/report/info/:scannerType
 * Get scanner information
 */
router.get('/info/:scannerType', reportController.getScannerInfo);

module.exports = router;
