import React, { useState, useEffect } from 'react';
import { getRiskColor, getStatusIcon } from '../utils/helpers';
import '../styles/linkpreview.css';

export default function LinkPreview({ url, status, riskScore, metadata }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Fetch preview metadata from backend
        const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch preview');
        }

        const data = await response.json();
        setPreview(data);
      } catch (err) {
        console.error('Preview error:', err);
        setError('Could not load preview');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (!url) return null;

  const getRiskBadgeClass = () => {
    if (status === 'safe') return 'badge-safe';
    if (status === 'suspicious') return 'badge-suspicious';
    return 'badge-dangerous';
  };

  const getRiskBadgeText = () => {
    if (status === 'safe') return '✅ Safe';
    if (status === 'suspicious') return '⚠️ Suspicious';
    return '❌ Dangerous';
  };

  return (
    <div className="link-preview-container">
      <div className={`link-preview ${getRiskBadgeClass()}`}>
        {/* Risk Badge */}
        <div className="preview-risk-badge">
          <span className="risk-icon">{getStatusIcon(status)}</span>
          <div className="risk-info">
            <span className="risk-text">{getRiskBadgeText()}</span>
            <span className="risk-score">Risk: {riskScore}/100</span>
          </div>
        </div>

        {/* Screenshot Section */}
        {loading ? (
          <div className="preview-screenshot loading">
            <div className="skeleton-loader"></div>
            <p>Loading preview...</p>
          </div>
        ) : error ? (
          <div className="preview-screenshot error">
            <span className="error-icon">📷</span>
            <p>{error}</p>
          </div>
        ) : preview?.screenshot ? (
          <div className="preview-screenshot">
            <img 
              src={preview.screenshot} 
              alt="Website preview"
              className="preview-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('no-image');
              }}
            />
            <div className="preview-overlay">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="preview-link-btn"
              >
                🔗 Visit Site
              </a>
            </div>
          </div>
        ) : (
          <div className="preview-screenshot no-image">
            <span className="no-image-icon">🌐</span>
            <p>Preview not available</p>
          </div>
        )}

        {/* Metadata Section */}
        <div className="preview-metadata">
          {/* Title */}
          {preview?.title ? (
            <div className="metadata-item">
              <h3 className="preview-title">{preview.title}</h3>
            </div>
          ) : (
            <div className="metadata-item">
              <h3 className="preview-title placeholder">No title available</h3>
            </div>
          )}

          {/* Description */}
          {preview?.description ? (
            <div className="metadata-item">
              <p className="preview-description">{preview.description}</p>
            </div>
          ) : (
            <div className="metadata-item">
              <p className="preview-description placeholder">No description available</p>
            </div>
          )}

          {/* URL and Domain */}
          <div className="metadata-item url-info">
            <span className="url-label">Domain:</span>
            <span className="url-domain">{preview?.domain || new URL(url).hostname}</span>
          </div>

          {/* Additional Info */}
          {preview?.favicon && (
            <div className="metadata-item favicon-info">
              <img 
                src={preview.favicon} 
                alt="Site favicon"
                className="preview-favicon"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        {/* Risk Details */}
        <div className="preview-risk-details">
          <div className="risk-detail-item">
            <span className="detail-label">Status:</span>
            <span className={`detail-value status-${status}`}>{status.toUpperCase()}</span>
          </div>
          <div className="risk-detail-item">
            <span className="detail-label">Risk Score:</span>
            <span 
              className="detail-value risk-score-value"
              style={{ color: getRiskColor(riskScore) }}
            >
              {riskScore}/100
            </span>
          </div>
          {metadata?.threats && metadata.threats.length > 0 && (
            <div className="risk-detail-item threats">
              <span className="detail-label">Threats:</span>
              <div className="threat-tags">
                {metadata.threats.map((threat, idx) => (
                  <span key={idx} className="threat-tag">{threat}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
