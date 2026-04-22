import React, { useState } from 'react';
import { getRiskColor, getStatusIcon } from '../utils/helpers';
import api from '../utils/api';
import '../styles/contentscanner.css';

export default function ContentScanner() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter content to scan');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/content/scan', {
        content: content.trim()
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan content');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setResult(null);
    setError('');
  };

  const getScamTypeLabel = (type) => {
    const labels = {
      'crypto_fraud': '💰 Crypto Fraud',
      'job_scam': '💼 Job Scam',
      'general_scam': '⚠️ General Scam',
      'none': '✅ No Scam Detected'
    };
    return labels[type] || 'Unknown';
  };

  const getScamTypeIcon = (type) => {
    const icons = {
      'crypto_fraud': '💰',
      'job_scam': '💼',
      'general_scam': '⚠️',
      'none': '✅'
    };
    return icons[type] || '❓';
  };

  return (
    <div className="content-scanner-container">
      <div className="scanner-card">
        <div className="scanner-header">
          <h2>🔍 AI Content Scanner</h2>
          <p>Detect scam messages, crypto fraud, and job scams</p>
        </div>

        <form onSubmit={handleScan} className="scanner-form">
          <div className="input-group">
            <label htmlFor="content">Paste Content to Scan:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste suspicious message, email, or text here..."
              className="content-input"
              rows="6"
              disabled={loading}
              maxLength="10000"
            />
            <div className="char-count">
              {content.length} / 10000 characters
            </div>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn-scan"
              disabled={loading || !content.trim()}
            >
              {loading ? '⏳ Scanning...' : '🔍 Scan Content'}
            </button>
            <button 
              type="button" 
              className="btn-clear"
              onClick={handleClear}
              disabled={loading}
            >
              🗑️ Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className={`result-container result-${result.status}`}>
            {/* Status Badge */}
            <div className="result-header">
              <div className="status-badge">
                <span className="status-icon">{getStatusIcon(result.status)}</span>
                <div className="status-info">
                  <span className="status-text">
                    {result.status === 'safe' ? 'Safe' : result.status === 'suspicious' ? 'Suspicious' : 'Malicious'}
                  </span>
                  <span className="risk-score">Risk: {result.riskScore}/100</span>
                </div>
              </div>
            </div>

            {/* Scam Type */}
            {result.scamType !== 'none' && (
              <div className="scam-type">
                <span className="scam-icon">{getScamTypeIcon(result.scamType)}</span>
                <span className="scam-label">{getScamTypeLabel(result.scamType)}</span>
              </div>
            )}

            {/* Risk Score Bar */}
            <div className="risk-bar-section">
              <div className="risk-bar-wrapper">
                <div
                  className="risk-bar"
                  style={{
                    width: `${result.riskScore}%`,
                    background: getRiskColor(result.riskScore)
                  }}
                />
              </div>
              <div className="risk-labels">
                <span>Safe</span>
                <span style={{ color: getRiskColor(result.riskScore) }}>
                  {result.riskScore}%
                </span>
                <span>Dangerous</span>
              </div>
            </div>

            {/* Indicators */}
            {result.indicators && result.indicators.length > 0 && (
              <div className="indicators-section">
                <h3>🚩 Detected Indicators:</h3>
                <div className="indicators-list">
                  {result.indicators.map((indicator, idx) => (
                    <div key={idx} className="indicator-item">
                      <span className="indicator-icon">⚠️</span>
                      <span className="indicator-text">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence */}
            <div className="confidence-section">
              <span className="confidence-label">Analysis Confidence:</span>
              <span className="confidence-value">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>

            {/* Recommendations */}
            <div className="recommendations">
              <h3>💡 Recommendations:</h3>
              {result.status === 'safe' ? (
                <p>This content appears to be safe. However, always exercise caution with unsolicited messages.</p>
              ) : result.status === 'suspicious' ? (
                <ul>
                  <li>Be cautious with this content</li>
                  <li>Do not click suspicious links</li>
                  <li>Do not share personal information</li>
                  <li>Verify with official sources</li>
                </ul>
              ) : (
                <ul>
                  <li>⛔ This content is likely a scam</li>
                  <li>Do NOT click any links</li>
                  <li>Do NOT share personal or financial information</li>
                  <li>Report to relevant authorities</li>
                  <li>Delete the message</li>
                </ul>
              )}
            </div>

            {/* Details */}
            <div className="details-section">
              <h3>📊 Analysis Details:</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Content Length:</span>
                  <span className="detail-value">{result.contentLength} characters</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Scam Type:</span>
                  <span className="detail-value">{getScamTypeLabel(result.scamType)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Risk Level:</span>
                  <span className={`detail-value risk-${result.status}`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Indicators Found:</span>
                  <span className="detail-value">{result.indicators.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
