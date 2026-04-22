const express = require('express');
const {
  generatePDFReport,
  generatePDFHistoryReport,
  generateCSVReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/pdf/:id', generatePDFReport);
router.get('/pdf-history', generatePDFHistoryReport);
router.get('/csv', generateCSVReport);

module.exports = router;
