import { useState } from 'react';
import api from '../utils/api';
import '../styles/urlcomparison.css';

export default function UrlComparison() {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!url1.trim() || !url2.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/tools/compare', { url1: url1.trim(), url2: url2.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 60) return '#ef4444';
    if (score >= 30) return '#f59e0b';
    return '#10b981';
  };

  const getStatusBadge = (status) => {
    const map = { safe: '✅ Safe', suspicious: '⚠️ Suspicious', malicious: '❌ Malicious' };
    return map[status] || status;
  };

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <div className="comparison-icon">⚖️</div>
        <h1>URL Comparison</h1>
        <p>Compare two URLs side-by-side to see which is safer</p>
      </div>

      <div className="comparison-card">
        <form onSubmit={handleCompare} className="comparison-form">
          <div className="url-inputs">
            <div className="url-input-group">
              <label>URL 1</label>
              <input
                type="url"
                className="comparison-input"
                placeholder="https://example.com"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
                required
              />
            </div>
            <div className="vs-divider">VS</div>
            <div className="url-input-group">
              <label>URL 2</label>
              <input
                type="url"
                className="comparison-input"
                placeholder="https://another.com"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="compare-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Comparing...</> : '⚖️ Compare URLs'}
          </button>
        </form>

        {error && <div className="comparison-error"><span>⚠️</span> {error}</div>}

        {result && (
          <div className="comparison-result">
            <div className="winner-banner" style={{ background: result.safer === 'url1' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)' }}>
              <span className="winner-icon">🏆</span>
              <span className="winner-text">{result.summary}</span>
            </div>

            <div className="side-by-side">
              <UrlPanel
                label="URL 1"
                data={result.url1}
                isWinner={result.safer === 'url1'}
                getRiskColor={getRiskColor}
                getStatusBadge={getStatusBadge}
              />
              <UrlPanel
                label="URL 2"
                data={result.url2}
                isWinner={result.safer === 'url2'}
                getRiskColor={getRiskColor}
                getStatusBadge={getStatusBadge}
              />
            </div>

            <div className="comparison-metrics">
              <h3>Comparison Metrics</h3>
              <MetricRow label="HTTPS" v1={result.url1.heuristics.hasHttps} v2={result.url2.heuristics.hasHttps} type="bool" />
              <MetricRow label="Shortened URL" v1={result.url1.heuristics.isShortened} v2={result.url2.heuristics.isShortened} type="bool-bad" />
              <MetricRow label="IP-based URL" v1={result.url1.heuristics.isIpBased} v2={result.url2.heuristics.isIpBased} type="bool-bad" />
              <MetricRow label="Suspicious Keywords" v1={result.url1.heuristics.hasSuspiciousKeywords} v2={result.url2.heuristics.hasSuspiciousKeywords} type="bool-bad" />
              <MetricRow label="Suspicious TLD" v1={result.url1.heuristics.hasSuspiciousTLD} v2={result.url2.heuristics.hasSuspiciousTLD} type="bool-bad" />
              <MetricRow label="Risk Score" v1={result.url1.riskScore} v2={result.url2.riskScore} type="score" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UrlPanel({ label, data, isWinner, getRiskColor, getStatusBadge }) {
  return (
    <div className={`url-panel ${isWinner ? 'winner' : ''}`}>
      {isWinner && <div className="winner-tag">🏆 Safer</div>}
      <div className="panel-label">{label}</div>
      <div className="panel-domain">{data.domain}</div>
      <div className="panel-score" style={{ color: getRiskColor(data.riskScore) }}>
        {data.riskScore}<span>/100</span>
      </div>
      <div className="panel-status">{getStatusBadge(data.status)}</div>
      {data.warnings?.length > 0 && (
        <ul className="panel-warnings">
          {data.warnings.slice(0, 3).map((w, i) => (
            <li key={i}>⚠️ {w.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MetricRow({ label, v1, v2, type }) {
  const fmt = (v) => {
    if (type === 'bool') return v ? <span className="metric-good">✅</span> : <span className="metric-bad">❌</span>;
    if (type === 'bool-bad') return v ? <span className="metric-bad">⚠️ Yes</span> : <span className="metric-good">✅ No</span>;
    if (type === 'score') return <span style={{ color: v >= 60 ? '#ef4444' : v >= 30 ? '#f59e0b' : '#10b981' }}>{v}</span>;
    return v;
  };
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <span className="metric-v1">{fmt(v1)}</span>
      <span className="metric-v2">{fmt(v2)}</span>
    </div>
  );
}
