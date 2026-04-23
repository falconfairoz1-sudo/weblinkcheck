import { useState } from 'react';
import api from '../utils/api';
import '../styles/pingtool.css';

export default function PingTool() {
  const [host, setHost] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePing = async (e) => {
    e.preventDefault();
    if (!host.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/advanced/ping', { host: host.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Ping failed');
    } finally {
      setLoading(false);
    }
  };

  const latencyColor = (ms) => ms < 200 ? '#10b981' : ms < 500 ? '#f59e0b' : '#ef4444';

  return (
    <div className="ping-page">
      <div className="ping-header">
        <span className="ping-icon">📡</span>
        <h1>Network Ping Tool</h1>
        <p>Check if a domain or IP is reachable and measure response latency</p>
      </div>

      <div className="ping-card">
        <form onSubmit={handlePing} className="ping-form">
          <div className="ping-input-wrap">
            <span>🌐</span>
            <input
              type="text"
              className="ping-input"
              placeholder="Enter domain or IP (e.g. google.com or 8.8.8.8)"
              value={host}
              onChange={e => setHost(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="ping-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Pinging...</> : '📡 Ping Host'}
          </button>
        </form>

        {error && <div className="ping-error">⚠️ {error}</div>}

        {result && (
          <div className="ping-result">
            <div className={`ping-status-banner ${result.isReachable ? 'reachable' : 'unreachable'}`}>
              <span className="ping-status-icon">{result.isReachable ? '✅' : '❌'}</span>
              <div>
                <strong>{result.host}</strong>
                <p>{result.isReachable ? 'Host is reachable' : 'Host is unreachable'}</p>
              </div>
              {result.latency && (
                <div className="ping-latency" style={{ color: latencyColor(result.latency) }}>
                  {result.latency}ms
                </div>
              )}
            </div>

            <div className="ping-details">
              <PingRow label="IP Address" value={result.ipAddress || 'Could not resolve'} />
              <PingRow label="DNS Latency" value={result.dnsLatency ? `${result.dnsLatency}ms` : '—'} />
              <PingRow label="HTTP Status" value={result.httpStatus || '—'} />
              <PingRow label="Checked At" value={result.checkedAt ? new Date(result.checkedAt).toLocaleTimeString() : '—'} />
            </div>

            <div className="ping-protocols">
              <h3>Protocol Results</h3>
              {result.protocols?.map((p, i) => (
                <div key={i} className={`ping-protocol ${p.reachable ? 'ok' : 'fail'}`}>
                  <span className="protocol-name">{p.protocol.toUpperCase()}</span>
                  <span className="protocol-status">{p.reachable ? `✅ ${p.status}` : '❌ Unreachable'}</span>
                  <span className="protocol-latency">{p.latency}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ping-examples">
        <h3>Try these</h3>
        <div className="ping-chips">
          {['google.com', 'github.com', '8.8.8.8', 'cloudflare.com'].map(h => (
            <button key={h} className="ping-chip" onClick={() => setHost(h)}>{h}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PingRow({ label, value }) {
  return (
    <div className="ping-row">
      <span className="ping-row-label">{label}</span>
      <span className="ping-row-value">{value}</span>
    </div>
  );
}
