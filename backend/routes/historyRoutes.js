const express = require('express');
const { getHistory, getScanById, deleteScan, clearHistory } = require('../controllers/historyController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getHistory);
router.delete('/clear', protect, clearHistory);
router.get('/:id', getScanById);
router.delete('/:id', protect, deleteScan);

module.exports = router;
