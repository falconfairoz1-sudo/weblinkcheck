import { useState } from 'react';
import api from '../utils/api';
import '../styles/bulkreputation.css';

export default function BulkDomainReputation() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    const domains = input.split('\n').map(d => d.trim()).filter(Boolean).slice(0, 20);
    if (domains.length === 0) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await api.post('/advanced/bulk-reputation', { domains });
      setResults(res.data.results);
    } catch (err) {
      setError(err.response?.data?.error || 'Check failed');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = { clean: '#10b981', caution: '#f59e0b', suspicious: '#ef4444' };
  const statusIcon = { clean: '✅', caution: '⚠️', suspicious: '❌' };

  return (
    <div className="bulkrep-page">
      <div className="bulkrep-header">
        <span className="bulkrep-icon">🏭</span>
        <h1>Bulk Domain Reputation</h1>
        <p>Check up to 20 domains at once for suspicious indicators</p>
      </div>

      <div className="bulkrep-card">
        <form onSubmit={handleCheck} className="bulkrep-form">
          <label className="bulkrep-label">Enter domains (one per line, max 20)</label>
          <textarea
            className="bulkrep-textarea"
            placeholder={'google.com\ngithub.com\nexample.com'}
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
            required
          />
          <button type="submit" className="bulkrep-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Checking...</> : '🔍 Check Domains'}
          </button>
        </form>

        {error && <div className="bulkrep-error">⚠️ {error}</div>}

        {results.length > 0 && (
          <div className="bulkrep-results">
            <div className="bulkrep-summary">
              <span className="summary-clean">✅ {results.filter(r => r.status === 'clean').length} Clean</span>
              <span className="summary-caution">⚠️ {results.filter(r => r.status === 'caution').length} Caution</span>
              <span className="summary-suspicious">❌ {results.filter(r => r.status === 'suspicious').length} Suspicious</span>
            </div>

            <div className="bulkrep-table">
              <div className="bulkrep-thead">
                <span>Domain</span><span>IP</span><span>TLD</span><span>Risk</span><span>Status</span>
              </div>
              {results.map((r, i) => (
                <div key={i} className={`bulkrep-row ${r.status}`}>
                  <span className="rep-domain">{r.domain}</span>
                  <span className="rep-ip">{r.ipAddress || '—'}</span>
                  <span className="rep-tld">.{r.tld || '?'}</span>
                  <span className="rep-risk" style={{ color: r.riskScore >= 60 ? '#ef4444' : r.riskScore >= 30 ? '#f59e0b' : '#10b981' }}>
                    {r.riskScore}/100
                  </span>
                  <span className="rep-status" style={{ color: statusColor[r.status] }}>
                    {statusIcon[r.status]} {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
