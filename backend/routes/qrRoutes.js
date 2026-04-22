const express = require('express');
const multer = require('multer');
const { scanQRCode } = require('../controllers/qrController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// QR code scanning route (optional auth)
router.post('/', optionalAuth, upload.single('qrImage'), scanQRCode);

module.exports = router;
