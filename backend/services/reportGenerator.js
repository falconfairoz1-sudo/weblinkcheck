const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate Scanner Explanation Report
 */
function generateScannerReport(scannerType, analysisData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40
      });

      const fileName = `scanner-report-${scannerType}-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../../temp', fileName);

      // Ensure temp directory exists
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);

      doc.on('end', () => {
        resolve(filePath);
      });

      doc.on('error', (err) => {
        reject(err);
      });

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('🛡️ LinkGuard Scanner Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(1);

      // Scanner Type Section
      const scannerInfo = getScannerInfo(scannerType);
      doc.fontSize(16).font('Helvetica-Bold').text(scannerInfo.title);
      doc.fontSize(11).font('Helvetica').text(scannerInfo.description);
      doc.moveDown(0.5);

      // Overview
      doc.fontSize(14).font('Helvetica-Bold').text('📋 Overview');
      doc.fontSize(10).font('Helvetica').text(scannerInfo.overview, { align: 'left' });
      doc.moveDown(0.5);

      // Key Features
      doc.fontSize(14).font('Helvetica-Bold').text('✨ Key Features');
      scannerInfo.features.forEach(feature => {
        doc.fontSize(10).font('Helvetica').text(`• ${feature}`, { indent: 20 });
      });
      doc.moveDown(0.5);

      // What It Detects
      doc.fontSize(14).font('Helvetica-Bold').text('🚨 What It Detects');
      scannerInfo.detects.forEach(threat => {
        doc.fontSize(10).font('Helvetica').text(`• ${threat}`, { indent: 20 });
      });
      doc.moveDown(0.5);

      // How It Works
      doc.fontSize(14).font('Helvetica-Bold').text('⚙️ How It Works');
      scannerInfo.howItWorks.forEach(step => {
        doc.fontSize(10).font('Helvetica').text(`• ${step}`, { indent: 20 });
      });
      doc.moveDown(0.5);

      // Analysis Data (if provided)
      if (analysisData) {
        doc.fontSize(14).font('Helvetica-Bold').text('📊 Analysis Results');
        
        if (analysisData.url) {
          doc.fontSize(10).font('Helvetica').text(`URL: ${analysisData.url}`);
        }
        
        if (analysisData.status) {
          doc.fontSize(10).font('Helvetica').text(`Status: ${analysisData.status.toUpperCase()}`);
        }
        
        if (analysisData.riskScore !== undefined) {
          doc.fontSize(10).font('Helvetica').text(`Risk Score: ${analysisData.riskScore}/100`);
        }
        
        if (analysisData.indicators && analysisData.indicators.length > 0) {
          doc.fontSize(10).font('Helvetica-Bold').text('Detected Indicators:');
          analysisData.indicators.forEach(indicator => {
            doc.fontSize(9).font('Helvetica').text(`• ${indicator}`, { indent: 20 });
          });
        }
        
        doc.moveDown(0.5);
      }

      // Use Cases
      doc.fontSize(14).font('Helvetica-Bold').text('💡 When to Use');
      doc.fontSize(10).font('Helvetica').text(scannerInfo.useCase);
      doc.moveDown(0.5);

      // Best Practices
      doc.fontSize(14).font('Helvetica-Bold').text('🛡️ Best Practices');
      scannerInfo.bestPractices.forEach(practice => {
        doc.fontSize(10).font('Helvetica').text(`• ${practice}`, { indent: 20 });
      });
      doc.moveDown(0.5);

      // Recommendations
      doc.fontSize(14).font('Helvetica-Bold').text('✅ Recommendations');
      scannerInfo.recommendations.forEach(rec => {
        doc.fontSize(10).font('Helvetica').text(`• ${rec}`, { indent: 20 });
      });
      doc.moveDown(1);

      // Footer
      doc.fontSize(9).font('Helvetica').text('LinkGuard - AI-Powered Security Scanner', { align: 'center' });
      doc.fontSize(8).font('Helvetica').text('For more information, visit: https://linkguard.app', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get scanner information
 */
function getScannerInfo(scannerType) {
  const scanners = {
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
      ],
      howItWorks: [
        'Extract and validate the URL format',
        'Query Google Safe Browsing database for known threats',
        'Check VirusTotal for malware signatures',
        'Perform heuristic analysis on URL structure',
        'Analyze domain reputation and age',
        'Check SSL certificate validity',
        'Calculate overall risk score',
        'Generate detailed threat report'
      ],
      useCase: 'Use this scanner when you receive a suspicious link via email, chat, social media, or any other source. Always verify links before clicking, especially from unknown senders.',
      bestPractices: [
        'Never click links from untrusted sources',
        'Hover over links to see the actual URL',
        'Check for HTTPS and valid SSL certificates',
        'Verify sender email addresses carefully',
        'Use this scanner for all suspicious links',
        'Report malicious URLs to authorities'
      ],
      recommendations: [
        'Scan all links before clicking',
        'Be cautious of shortened URLs',
        'Verify URLs match the claimed destination',
        'Check for misspelled domain names',
        'Use browser security extensions',
        'Keep antivirus software updated'
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
      ],
      howItWorks: [
        'Capture or upload QR code image',
        'Decode QR code content',
        'Extract hidden URL',
        'Validate URL format',
        'Perform threat analysis on extracted URL',
        'Check against threat databases',
        'Generate risk assessment',
        'Display decoded content and threats'
      ],
      useCase: 'Use this scanner when you encounter QR codes in public places, advertisements, business cards, or messages. Always scan QR codes with this tool before using your phone camera.',
      bestPractices: [
        'Never scan QR codes from unknown sources',
        'Be cautious of QR codes in public places',
        'Verify QR code source and context',
        'Use this scanner before scanning with phone',
        'Check decoded URL before visiting',
        'Report suspicious QR codes'
      ],
      recommendations: [
        'Scan all unfamiliar QR codes first',
        'Be wary of QR codes in parking lots',
        'Verify QR codes match advertised content',
        'Check for tampered or overlaid QR codes',
        'Use QR code scanner apps with security features',
        'Report malicious QR codes to venues'
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
      ],
      howItWorks: [
        'Accept text content input',
        'Convert to lowercase for analysis',
        'Scan for crypto fraud keywords',
        'Identify job scam patterns',
        'Detect general scam indicators',
        'Analyze urgency language',
        'Calculate risk score',
        'Generate detailed analysis report'
      ],
      useCase: 'Use this scanner when you receive suspicious messages, emails, or text content. Analyze any message that seems unusual or requests personal information.',
      bestPractices: [
        'Never share personal information via message',
        'Be suspicious of urgent requests',
        'Verify sender identity independently',
        'Use this scanner for all suspicious messages',
        'Report scams to authorities',
        'Block and delete suspicious messages'
      ],
      recommendations: [
        'Scan all suspicious messages',
        'Be wary of "too good to be true" offers',
        'Never send money to unknown parties',
        'Verify job offers independently',
        'Check sender email addresses carefully',
        'Use official contact methods to verify'
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
      ],
      howItWorks: [
        'Add URLs to monitoring list',
        'Schedule automatic daily scans',
        'Perform threat analysis',
        'Compare with previous results',
        'Detect threat changes',
        'Generate alerts for changes',
        'Send notifications',
        'Maintain historical records'
      ],
      useCase: 'Use this monitor to continuously track important URLs like your business website, banking portal, email provider, or frequently visited sites.',
      bestPractices: [
        'Monitor all critical business URLs',
        'Set up email alerts',
        'Review alerts promptly',
        'Investigate threat changes immediately',
        'Keep monitoring active 24/7',
        'Maintain backup monitoring systems'
      ],
      recommendations: [
        'Monitor your main business website',
        'Track banking and financial sites',
        'Monitor email provider URLs',
        'Watch for domain takeovers',
        'Set up redundant monitoring',
        'Review historical threat data regularly'
      ]
    }
  };

  return scanners[scannerType] || scanners.url_scanner;
}

module.exports = {
  generateScannerReport
};
