const express = require('express');
const {
  addMonitor,
  getMonitors,
  deleteMonitor
} = require('../controllers/monitorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', addMonitor);
router.get('/', getMonitors);
router.delete('/:id', deleteMonitor);

module.exports = router;
