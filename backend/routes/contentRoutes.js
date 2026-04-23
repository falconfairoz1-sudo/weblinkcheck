const express = require('express');
const router = express.Router();

// Placeholder route for content routes
router.get('/', (req, res) => {
  res.json({ message: 'Content routes' });
});

module.exports = router;
