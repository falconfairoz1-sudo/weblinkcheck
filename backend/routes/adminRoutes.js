const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, updateUser, getAllScans, deleteScan } = require('../controllers/adminController');

// All admin routes require login + admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/scans', getAllScans);
router.delete('/scans/:id', deleteScan);

module.exports = router;
