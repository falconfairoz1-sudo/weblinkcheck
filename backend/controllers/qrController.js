const Jimp = require('jimp');
const jsQR = require('jsqr');
const { analyzeUrl } = require('../utils/urlAnalyzer');
const { checkGoogleSafeBrowsing } = require('../services/googleSafeBrowsing');
const { checkVirusTotal } = require('../services/virusTotal');
const Scan = require('../models/Scan');

/**
 * Extract URL from QR code image and scan it
 */
exports.scanQRCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read and decode the image
    const image = await Jimp.read(req.file.buffer);
    const imageData = {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height
    };

    // Decode QR code
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (!qrCode) {
      return res.status(400).json({ error: 'No QR code found in image' });
    }

    const url = qrCode.data;

    // Validate if it's a URL
    if (!url.match(/^https?:\/\//i) && !url.includes('.')) {
      return res.json({
        qrContent: url,
        isUrl: false,
        message: 'QR code contains text, not a URL'
      });
    }

    // Perform full URL scan
    const heuristicAnalysis = analyzeUrl(url);
    const googleResult = await checkGoogleSafeBrowsing(url);
    const virusTotalResult = await checkVirusTotal(url);

    const riskScore = Math.round(
      heuristicAnalysis.riskScore * 0.4 +
      (googleResult.isSafe ? 0 : 40) +
      (virusTotalResult.positives > 0 ? virusTotalResult.positives * 3 : 0)
    );

    const result = {
      url,
      qrContent: url,
      isUrl: true,
      riskScore: Math.min(riskScore, 100),
      status: riskScore < 30 ? 'safe' : riskScore < 70 ? 'suspicious' : 'dangerous',
      heuristicAnalysis,
      googleSafeBrowsing: googleResult,
      virusTotal: virusTotalResult,
      scannedAt: new Date()
    };

    // Save to database if user is authenticated
    if (req.user) {
      const scan = new Scan({
        user: req.user.id,
        url,
        riskScore: result.riskScore,
        status: result.status,
        scanType: 'qr-code',
        results: result
      });
      await scan.save();
      result.scanId = scan._id;
    }

    res.json(result);
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ error: 'Failed to process QR code', details: error.message });
  }
};
