import { useState } from 'react';
import api from '../utils/api';
import '../styles/urlexpander.css';

export default function UrlExpander() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExpand = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/tools/expand-url', { url: url.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to expand URL');
    } finally {
      setLoading(false);
    }
  };

  const handleScanFinal = () => {
    if (result?.finalUrl) {
      window.open(`/?url=${encodeURIComponent(result.finalUrl)}`, '_self');
    }
  };

  return (
    <div className="expander-page">
      <div className="expander-header">
        <div className="expander-icon">🔗</div>
        <h1>URL Expander</h1>
        <p>Reveal the real destination behind shortened or redirected links</p>
      </div>

      <div className="expander-card">
        <form onSubmit={handleExpand} className="expander-form">
          <div className="expander-input-wrap">
            <span className="expander-input-icon">🔗</span>
            <input
              type="url"
              className="expander-input"
              placeholder="Paste a shortened URL (bit.ly, t.co, tinyurl.com...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="expander-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Expanding...</> : '🔍 Expand URL'}
          </button>
        </form>

        {error && (
          <div className="expander-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {result && (
          <div className="expander-result">
            <div className="result-row">
              <div className="result-label">Original URL</div>
              <div className="result-value original">{result.originalUrl}</div>
            </div>

            <div className="result-arrow">↓</div>

            <div className="result-row final">
              <div className="result-label">Final Destination</div>
              <div className="result-value destination">
                <a href={result.finalUrl} target="_blank" rel="noopener noreferrer">
                  {result.finalUrl}
                </a>
              </div>
            </div>

            <div className="result-badges">
              <span className={`badge ${result.isShortened ? 'badge-warn' : 'badge-ok'}`}>
                {result.isShortened ? '⚠️ Shortened URL' : '✅ Direct URL'}
              </span>
              {result.statusCode && (
                <span className="badge badge-info">HTTP {result.statusCode}</span>
              )}
              {result.finalUrl !== result.originalUrl && (
                <span className="badge badge-warn">🔀 Redirected</span>
              )}
            </div>

            {result.finalUrl !== result.originalUrl && (
              <button className="scan-final-btn" onClick={handleScanFinal}>
                🛡️ Scan Final URL for Threats
              </button>
            )}
          </div>
        )}
      </div>

      <div className="expander-info">
        <h3>Why expand URLs?</h3>
        <div className="info-grid">
          <div className="info-item">
            <span>🎣</span>
            <p>Shortened URLs can hide phishing sites</p>
          </div>
          <div className="info-item">
            <span>🦠</span>
            <p>Malware links often use URL shorteners</p>
          </div>
          <div className="info-item">
            <span>🔍</span>
            <p>See the real domain before clicking</p>
          </div>
          <div className="info-item">
            <span>🛡️</span>
            <p>Scan the final URL for safety</p>
          </div>
        </div>
      </div>
    </div>
  );
}
