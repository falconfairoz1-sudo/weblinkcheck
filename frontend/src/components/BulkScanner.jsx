import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { getStatusIcon, getStatusColor, getRiskColor } from '../utils/helpers';
import '../styles/bulkscanner.css';

export default function BulkScanner() {
  const [urlsText, setUrlsText] = useState('');
  const [results, setResults] = useState(null);
  const { bulkScan, scanning } = useScan();
  const [error, setError] = useState('');

  const handleBulkScan = async () => {
    const urls = urlsText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }
    if (urls.length > 10) {
      setError('Maximum 10 URLs allowed per bulk scan.');
      return;
    }

    setError('');
    try {
      const data = await bulkScan(urls);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bulk-scanner">
      <h3 className="bulk-title">📋 Bulk URL Scanner</h3>
      <p className="bulk-subtitle">Scan up to 10 URLs at once (one per line)</p>

      <textarea
        className="bulk-textarea"
        placeholder={`https://example.com\nhttps://another-site.com\nhttp://suspicious-site.tk`}
        value={urlsText}
        onChange={(e) => setUrlsText(e.target.value)}
        rows={6}
        disabled={scanning}
      />

      {error && <p className="bulk-error">⚠️ {error}</p>}

      <button
        className={`bulk-scan-btn ${scanning ? 'loading' : ''}`}
        onClick={handleBulkScan}
        disabled={scanning}
      >
        {scanning ? (
          <><span className="spinner"></span> Scanning...</>
        ) : (
          '🔍 Scan All URLs'
        )}
      </button>

      {results && (
        <div className="bulk-results">
          <h4>Results ({results.length} URLs)</h4>
          {results.map((r, i) => (
            <div key={i} className={`bulk-result-item ${getStatusColor(r.status)}`}>
              <span className="bulk-status-icon">{getStatusIcon(r.status)}</span>
              <div className="bulk-url-info">
                <span className="bulk-url" title={r.url}>{r.url.substring(0, 50)}{r.url.length > 50 ? '...' : ''}</span>
                {r.error && <span className="bulk-error-msg">{r.error}</span>}
              </div>
              {!r.error && (
                <div className="bulk-score" style={{ color: getRiskColor(r.riskScore) }}>
                  {r.riskScore}/100
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
