import { useState } from 'react';
import api from '../utils/api';
import '../styles/subdomainfinder.css';

export default function SubdomainFinder() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFind = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/advanced/subdomains', { domain: domain.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subdomain-page">
      <div className="subdomain-header">
        <span className="subdomain-icon">🔎</span>
        <h1>Subdomain Finder</h1>
        <p>Discover active subdomains of any domain using DNS resolution</p>
      </div>

      <div className="subdomain-card">
        <form onSubmit={handleFind} className="subdomain-form">
          <div className="subdomain-input-wrap">
            <span>🌐</span>
            <input
              type="text"
              className="subdomain-input"
              placeholder="Enter domain (e.g. example.com)"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="subdomain-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Scanning {domain}...</> : '🔍 Find Subdomains'}
          </button>
        </form>

        {loading && (
          <div className="subdomain-progress">
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill"></div>
            </div>
            <p>Checking common subdomains via DNS...</p>
          </div>
        )}

        {error && <div className="subdomain-error">⚠️ {error}</div>}

        {result && (
          <div className="subdomain-result">
            <div className="subdomain-summary">
              <div className="summary-stat">
                <span className="summary-num">{result.found.length}</span>
                <span className="summary-label">Found</span>
              </div>
              <div className="summary-stat">
                <span className="summary-num">{result.checked}</span>
                <span className="summary-label">Checked</span>
              </div>
              <div className="summary-stat">
                <span className="summary-num">{result.domain}</span>
                <span className="summary-label">Domain</span>
              </div>
            </div>

            {result.found.length === 0 ? (
              <div className="subdomain-empty">
                <span>📭</span>
                <p>No common subdomains found for {result.domain}</p>
              </div>
            ) : (
              <div className="subdomain-list">
                {result.found.map((sub, i) => (
                  <div key={i} className="subdomain-item">
                    <span className="subdomain-status-dot"></span>
                    <div className="subdomain-info">
                      <span className="subdomain-name">{sub.subdomain}</span>
                      <span className="subdomain-ip">{sub.ip}</span>
                    </div>
                    <div className="subdomain-actions">
                      <a href={`https://${sub.subdomain}`} target="_blank" rel="noopener noreferrer" className="subdomain-visit">Visit →</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="subdomain-note">
        <span>ℹ️</span>
        <p>This tool checks common subdomain names via DNS resolution. It does not perform aggressive scanning and only identifies publicly accessible subdomains.</p>
      </div>
    </div>
  );
}
