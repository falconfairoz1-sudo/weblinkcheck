const express = require('express');
const { getHistory, getScanById, deleteScan, clearHistory } = require('../controllers/historyController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, getHistory);
router.get('/:id', getScanById);
router.delete('/clear', protect, clearHistory);
router.delete('/:id', protect, deleteScan);

module.exports = router;
