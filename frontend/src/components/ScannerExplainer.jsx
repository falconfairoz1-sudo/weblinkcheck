import React, { useState } from 'react';
import api from '../utils/api';
import ReportGenerator from './ReportGenerator';
import '../styles/scannerexplainer.css';

export default function ScannerExplainer({ url, scannerType }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scannerExplanations = {
    url_scanner: {
      title: '🔗 URL Scanner',
      description: 'Analyzes links for security threats',
      features: [
        'Checks against Google Safe Browsing database',
        'Scans with VirusTotal for malware detection',
        'AI heuristic analysis for phishing patterns',
        'Risk scoring from 0-100',
        'Detects shortened URLs and IP-based links',
        'Identifies suspicious keywords and domains'
      ],
      detects: [
        'Phishing attacks',
        'Malware distribution',
        'Fake websites',
        'Credential theft attempts',
        'Drive-by downloads',
        'Suspicious redirects'
      ],
      useCase: 'Use this when you receive a suspicious link via email, chat, or social media and want to verify if it\'s safe before clicking.'
    },
    qr_scanner: {
      title: '📷 QR Code Scanner',
      description: 'Scans and analyzes QR codes for hidden threats',
      features: [
        'Decodes QR code content',
        'Extracts hidden URLs from QR codes',
        'Analyzes decoded URLs for threats',
        'Detects malicious QR code patterns',
        'Works with camera or image upload',
        'Real-time scanning capability'
      ],
      detects: [
        'Malicious URLs hidden in QR codes',
        'Phishing QR codes',
        'Malware distribution QR codes',
        'Fake payment QR codes',
        'Credential harvesting attempts',
        'Suspicious redirects'
      ],
      useCase: 'Use this when you encounter a QR code in public places, advertisements, or messages and want to verify where it leads before scanning with your phone.'
    },
    content_scanner: {
      title: '🔍 Content Scanner',
      description: 'Analyzes text messages for scam indicators',
      features: [
        'Detects crypto fraud patterns',
        'Identifies job scams',
        'Recognizes general phishing attempts',
        'Analyzes urgency language',
        'Detects suspicious keywords',
        'Calculates scam probability'
      ],
      detects: [
        'Cryptocurrency investment scams',
        'Fake job offers',
        'Prize/reward scams',
        'Urgent action requests',
        'Personal data requests',
        'Financial fraud attempts'
      ],
      useCase: 'Use this when you receive suspicious messages, emails, or text content and want to know if it\'s a scam before responding or clicking links.'
    },
    monitor: {
      title: '👁️ Monitor',
      description: 'Continuously monitors URLs for threat changes',
      features: [
        'Real-time threat monitoring',
        'Automatic daily scans',
        'Alert notifications for changes',
        'Historical threat tracking',
        'Trend analysis',
        'Scheduled monitoring'
      ],
      detects: [
        'New threats on previously safe URLs',
        'Compromised websites',
        'Malware injection',
        'Phishing page updates',
        'Domain takeovers',
        'Content changes'
      ],
      useCase: 'Use this to continuously monitor important URLs like your business website, banking portal, or frequently visited sites for any security changes.'
    }
  };

  const handleGetExplanation = async () => {
    if (!url) {
      setError('Please provide a URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/content/scan', {
        content: `Explain what the ${scannerType} scanner would find when analyzing this URL: ${url}. Provide a detailed explanation of potential threats, what security checks would be performed, and recommendations.`
      });

      setExplanation(response.data);
    } catch (err) {
      setError('Failed to generate explanation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scannerInfo = scannerExplanations[scannerType] || scannerExplanations.url_scanner;

  return (
    <div className="scanner-explainer">
      <div className="explainer-card">
        {/* Header */}
        <div className="explainer-header">
          <h2>{scannerInfo.title}</h2>
          <p className="explainer-description">{scannerInfo.description}</p>
        </div>

        {/* Features */}
        <div className="explainer-section">
          <h3>✨ Key Features:</h3>
          <ul className="features-list">
            {scannerInfo.features.map((feature, idx) => (
              <li key={idx}>
                <span className="feature-icon">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What It Detects */}
        <div className="explainer-section">
          <h3>🚨 What It Detects:</h3>
          <div className="detects-grid">
            {scannerInfo.detects.map((threat, idx) => (
              <div key={idx} className="threat-badge">
                <span className="threat-icon">⚠️</span>
                <span>{threat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Use Case */}
        <div className="explainer-section use-case">
          <h3>💡 When to Use:</h3>
          <p>{scannerInfo.useCase}</p>
        </div>

        {/* AI Explanation */}
        {explanation && (
          <div className="explainer-section ai-explanation">
            <h3>🤖 AI Analysis:</h3>
            <div className="explanation-content">
              <p>{explanation.analysis}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Get Explanation Button */}
        {url && (
          <button 
            className="btn-get-explanation"
            onClick={handleGetExplanation}
            disabled={loading}
          >
            {loading ? '⏳ Generating...' : '🤖 Get AI Explanation for This URL'}
          </button>
        )}

        {/* Report Generator */}
        <ReportGenerator scannerType={scannerType} analysisData={explanation} />
      </div>
    </div>
  );
}
