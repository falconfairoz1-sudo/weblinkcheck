import React, { useState } from 'react';
import ScannerExplainer from '../components/ScannerExplainer';
import ReportGenerator from '../components/ReportGenerator';
import '../styles/scannerguide.css';

export default function ScannerGuide() {
  const [selectedScanner, setSelectedScanner] = useState('url_scanner');
  const [urlInput, setUrlInput] = useState('');

  const scanners = [
    {
      id: 'url_scanner',
      name: '🔗 URL Scanner',
      icon: '🔗',
      description: 'Analyzes links for security threats'
    },
    {
      id: 'qr_scanner',
      name: '📷 QR Code Scanner',
      icon: '📷',
      description: 'Scans QR codes for hidden threats'
    },
    {
      id: 'monitor',
      name: '👁️ Monitor',
      icon: '👁️',
      description: 'Monitors URLs for threat changes'
    }
  ];

  return (
    <div className="scanner-guide-page">
      {/* Header */}
      <div className="page-header">
        <h1>🛡️ Scanner Guide</h1>
        <p>Learn about each scanner and how they protect you</p>
      </div>

      {/* Scanner Selection */}
      <section className="scanner-selection">
        <div className="container">
          <h2>Choose a Scanner</h2>
          <div className="scanner-buttons">
            {scanners.map((scanner) => (
              <button
                key={scanner.id}
                className={`scanner-btn ${selectedScanner === scanner.id ? 'active' : ''}`}
                onClick={() => setSelectedScanner(scanner.id)}
              >
                <span className="scanner-btn-icon">{scanner.icon}</span>
                <span className="scanner-btn-name">{scanner.name}</span>
                <span className="scanner-btn-desc">{scanner.description}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* URL Input */}
      <section className="url-input-section">
        <div className="container">
          <div className="input-wrapper">
            <label htmlFor="url-input">Enter a URL to get AI explanation:</label>
            <div className="input-group">
              <input
                id="url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="url-input"
              />
              <button className="btn-clear-input" onClick={() => setUrlInput('')}>
                ✕
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scanner Explainer */}
      <section className="explainer-section">
        <div className="container">
          <ScannerExplainer url={urlInput} scannerType={selectedScanner} />
        </div>
      </section>

      {/* Report Generator */}
      <section className="report-section">
        <div className="container">
          <div className="report-wrapper">
            <h2>📄 Generate Report</h2>
            <p>Download a comprehensive PDF report for this scanner</p>
            <ReportGenerator scannerType={selectedScanner} />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-section">
        <div className="container">
          <h2>Scanner Comparison</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>URL Scanner</th>
                  <th>QR Scanner</th>
                  <th>Monitor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Real-time Scanning</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Malware Detection</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Phishing Detection</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Scam Detection</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Continuous Monitoring</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Alerts & Notifications</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Risk Scoring</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>API Integration</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="best-practices">
        <div className="container">
          <h2>🛡️ Best Practices</h2>
          <div className="practices-grid">
            <div className="practice-card">
              <span className="practice-icon">1️⃣</span>
              <h3>Always Verify Before Clicking</h3>
              <p>Use the URL Scanner to check any suspicious links before clicking them</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">2️⃣</span>
              <h3>Scan QR Codes First</h3>
              <p>Use the QR Scanner to see where QR codes lead before scanning with your phone</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">3️⃣</span>
              <h3>Monitor Important Sites</h3>
              <p>Use Monitor to continuously track your business or frequently visited websites</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">4️⃣</span>
              <h3>Trust Your Instincts</h3>
              <p>If something feels off, use a scanner to verify. Better safe than sorry</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">5️⃣</span>
              <h3>Report Threats</h3>
              <p>Report malicious URLs and scams to help protect the community</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2>❓ Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How accurate are the scanners?</h3>
              <p>Our scanners use multiple security APIs (Google Safe Browsing, VirusTotal) combined with AI heuristics for high accuracy. Confidence levels are shown for each scan.</p>
            </div>

            <div className="faq-item">
              <h3>Is my data private?</h3>
              <p>Yes. We don't store your personal data. Scans are processed securely and deleted after analysis.</p>
            </div>

            <div className="faq-item">
              <h3>Can I use these scanners offline?</h3>
              <p>No, our scanners require internet connection to access security databases and APIs.</p>
            </div>

            <div className="faq-item">
              <h3>What if a scanner says a link is safe but I'm still unsure?</h3>
              <p>Trust your instincts. If something feels suspicious, avoid it. Our scanners are tools to help, not absolute guarantees.</p>
            </div>

            <div className="faq-item">
              <h3>How often are threat databases updated?</h3>
              <p>Our threat databases are updated in real-time through Google Safe Browsing and VirusTotal APIs.</p>
            </div>

            <div className="faq-item">
              <h3>Can I scan multiple URLs at once?</h3>
              <p>Yes! Use the Bulk Scanner feature in the URL Scanner to scan up to 10 URLs at once.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
