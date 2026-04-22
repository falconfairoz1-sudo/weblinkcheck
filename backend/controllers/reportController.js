const { generateScannerReport } = require('../services/reportGenerator');
const fs = require('fs');
const path = require('path');

/**
 * Generate and download scanner report
 */
exports.generateReport = async (req, res) => {
  try {
    const { scannerType, analysisData } = req.body;

    // Validate input
    if (!scannerType) {
      return res.status(400).json({ error: 'Scanner type is required' });
    }

    const validScanners = ['url_scanner', 'qr_scanner', 'content_scanner', 'monitor'];
    if (!validScanners.includes(scannerType)) {
      return res.status(400).json({ error: 'Invalid scanner type' });
    }

    // Generate PDF report
    const filePath = await generateScannerReport(scannerType, analysisData);

    // Send file
    res.download(filePath, `scanner-report-${scannerType}-${Date.now()}.pdf`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up temp file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

/**
 * Get scanner information
 */
exports.getScannerInfo = (req, res) => {
  try {
    const { scannerType } = req.params;

    const scannerInfo = {
      url_scanner: {
        title: '🔗 URL Scanner Report',
        description: 'Comprehensive analysis of link security threats',
        overview: 'The URL Scanner analyzes links for security threats using multiple detection methods including Google Safe Browsing, VirusTotal, and AI heuristics. It provides a risk score and detailed threat analysis.',
        features: [
          'Real-time URL scanning',
          'Google Safe Browsing integration',
          'VirusTotal malware detection',
          'AI heuristic analysis',
          'Risk scoring (0-100)',
          'Shortened URL detection',
          'IP-based URL identification',
          'Suspicious keyword detection',
          'SSL/HTTPS verification',
          'Domain age analysis'
        ],
        detects: [
          'Phishing attacks and fake login pages',
          'Malware distribution sites',
          'Ransomware delivery URLs',
          'Credential theft attempts',
          'Drive-by download attacks',
          'Suspicious redirects',
          'Fake e-commerce sites',
          'Scam landing pages',
          'Unencrypted connections',
          'Recently registered malicious domains'
        ]
      },
      qr_scanner: {
        title: '📷 QR Code Scanner Report',
        description: 'Analysis of QR codes for hidden threats',
        overview: 'The QR Code Scanner decodes QR codes and analyzes the hidden URLs for security threats. It helps you see where a QR code leads before scanning it with your phone.',
        features: [
          'QR code decoding',
          'Hidden URL extraction',
          'URL threat analysis',
          'Camera-based scanning',
          'Image upload support',
          'Real-time processing',
          'Malicious QR detection',
          'Redirect analysis',
          'Phishing QR identification',
          'Batch QR scanning'
        ],
        detects: [
          'Malicious URLs hidden in QR codes',
          'Phishing QR codes',
          'Malware distribution QR codes',
          'Fake payment QR codes',
          'Credential harvesting attempts',
          'Suspicious redirects',
          'Shortened URL QR codes',
          'Fake WiFi QR codes',
          'Malicious app installation QR codes',
          'Scam landing page QR codes'
        ]
      },
      content_scanner: {
        title: '🔍 Content Scanner Report',
        description: 'Analysis of text content for scam indicators',
        overview: 'The Content Scanner analyzes text messages, emails, and other content for scam indicators. It detects crypto fraud, job scams, and general phishing attempts using AI pattern recognition.',
        features: [
          'Crypto fraud detection',
          'Job scam identification',
          'General phishing detection',
          'Urgency language analysis',
          'Suspicious keyword detection',
          'Scam probability calculation',
          'Indicator highlighting',
          'Confidence scoring',
          'Multi-language support',
          'Real-time analysis'
        ],
        detects: [
          'Cryptocurrency investment scams',
          'Fake job offers',
          'Prize and reward scams',
          'Urgent action requests',
          'Personal data requests',
          'Financial fraud attempts',
          'Wallet verification scams',
          'Upfront payment requests',
          'Fake employment opportunities',
          'Inheritance and lottery scams'
        ]
      },
      monitor: {
        title: '👁️ Monitor Report',
        description: 'Continuous monitoring of URLs for threat changes',
        overview: 'The Monitor continuously tracks URLs for security changes. It performs automatic daily scans and alerts you when threats are detected on previously safe URLs.',
        features: [
          'Real-time threat monitoring',
          'Automatic daily scans',
          'Alert notifications',
          'Historical threat tracking',
          'Trend analysis',
          'Scheduled monitoring',
          'Multi-URL tracking',
          'Threat change detection',
          'Email notifications',
          'Dashboard reporting'
        ],
        detects: [
          'New threats on previously safe URLs',
          'Compromised websites',
          'Malware injection',
          'Phishing page updates',
          'Domain takeovers',
          'Content changes',
          'SSL certificate issues',
          'Redirect changes',
          'Server compromises',
          'Defacement attempts'
        ]
      }
    };

    const info = scannerInfo[scannerType];
    if (!info) {
      return res.status(404).json({ error: 'Scanner type not found' });
    }

    res.json(info);
  } catch (error) {
    console.error('Error fetching scanner info:', error);
    res.status(500).json({ error: 'Failed to fetch scanner information' });
  }
};
