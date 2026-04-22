import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ResultCard from '../components/ResultCard';
import '../styles/scandetail.css';

export default function ScanDetail() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await api.get(`/history/${id}`);
        setScan(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load scan details');
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  if (loading) {
    return (
      <div className="scan-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading scan details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scan-detail-page">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h2>Scan Not Found</h2>
          <p>{error}</p>
          <Link to="/history" className="btn-back">← Back to History</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-detail-page">
      <div className="scan-detail-header">
        <Link to="/history" className="back-link">
          ← Back to History
        </Link>
        <div className="scan-detail-meta">
          <h1>Scan Details</h1>
          <p>Detailed analysis for scan ID: {id}</p>
        </div>
      </div>

      <div className="scan-detail-content">
        <ResultCard result={scan} />
        
        {/* Additional Technical Details */}
        <div className="technical-details">
          <h2>Technical Information</h2>
          <div className="tech-grid">
            <TechItem label="Scan ID" value={scan._id} />
            <TechItem label="Scanned At" value={new Date(scan.createdAt).toLocaleString()} />
            <TechItem label="Scan Duration" value={`${scan.scanDuration}ms`} />
            <TechItem label="User Agent" value="LinkGuard Scanner v1.0" />
            <TechItem label="IP Address" value={scan.ipAddress || 'N/A'} />
            <TechItem label="From Cache" value={scan.fromCache ? 'Yes' : 'No'} />
          </div>
        </div>

        {/* Raw API Responses */}
        <div className="api-responses">
          <h2>API Response Details</h2>
          
          <div className="api-response-section">
            <h3>🔵 Google Safe Browsing</h3>
            <pre className="api-response-code">
              {JSON.stringify(scan.googleSafeBrowsing, null, 2)}
            </pre>
          </div>

          <div className="api-response-section">
            <h3>🟢 VirusTotal</h3>
            <pre className="api-response-code">
              {JSON.stringify(scan.virusTotal, null, 2)}
            </pre>
          </div>

          <div className="api-note">
            <p><strong>Note:</strong> PhishTank and WHOIS APIs have been removed for simplicity. The current setup provides comprehensive threat detection using Google Safe Browsing + VirusTotal + AI Heuristics.</p>
          </div>
        </div>

        {/* Share/Export Options */}
        <div className="scan-actions">
          <h2>Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              📋 Copy Link
            </button>
            <button 
              className="action-btn"
              onClick={() => {
                const data = JSON.stringify(scan, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `scan-${scan._id}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              💾 Export JSON
            </button>
            <button 
              className="action-btn"
              onClick={() => window.print()}
            >
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechItem({ label, value }) {
  return (
    <div className="tech-item">
      <span className="tech-label">{label}:</span>
      <span className="tech-value">{value}</span>
    </div>
  );
}