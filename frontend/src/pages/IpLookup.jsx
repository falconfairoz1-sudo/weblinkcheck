import { useState } from 'react';
import api from '../utils/api';
import '../styles/iplookup.css';

export default function IpLookup() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/tools/ip-lookup', { query: query.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const flagEmoji = (code) => {
    if (!code) return '🌐';
    return code.toUpperCase().replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt(0))
    );
  };

  return (
    <div className="iplookup-page">
      <div className="iplookup-header">
        <div className="iplookup-icon">🌍</div>
        <h1>IP & Domain Lookup</h1>
        <p>Get geolocation, ISP, and network info for any IP address or domain</p>
      </div>

      <div className="iplookup-card">
        <form onSubmit={handleLookup} className="iplookup-form">
          <div className="iplookup-input-wrap">
            <span className="iplookup-input-icon">🌐</span>
            <input
              type="text"
              className="iplookup-input"
              placeholder="Enter IP address or domain (e.g. 8.8.8.8 or google.com)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="iplookup-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Looking up...</> : '🔍 Lookup'}
          </button>
        </form>

        {error && <div className="iplookup-error"><span>⚠️</span> {error}</div>}

        {result && (
          <div className="iplookup-result">
            <div className="result-hero">
              <span className="result-flag">{flagEmoji(result.countryCode)}</span>
              <div>
                <div className="result-ip">{result.ip}</div>
                {result.hostname && <div className="result-hostname">{result.hostname}</div>}
              </div>
            </div>

            <div className="result-grid">
              <InfoRow icon="🗺️" label="Country" value={result.country || '—'} />
              <InfoRow icon="🏙️" label="City" value={result.city ? `${result.city}, ${result.region}` : '—'} />
              <InfoRow icon="📮" label="ZIP" value={result.zip || '—'} />
              <InfoRow icon="🕐" label="Timezone" value={result.timezone || '—'} />
              <InfoRow icon="📡" label="ISP" value={result.isp || '—'} />
              <InfoRow icon="🏢" label="Organization" value={result.org || '—'} />
              <InfoRow icon="🔢" label="AS Number" value={result.as || '—'} />
              {result.lat && result.lon && (
                <InfoRow icon="📍" label="Coordinates" value={`${result.lat}, ${result.lon}`} />
              )}
            </div>

            {result.lat && result.lon && (
              <a
                className="map-link"
                href={`https://www.openstreetmap.org/?mlat=${result.lat}&mlon=${result.lon}&zoom=10`}
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ View on Map
              </a>
            )}
          </div>
        )}
      </div>

      <div className="iplookup-examples">
        <h3>Try these examples</h3>
        <div className="example-chips">
          {['8.8.8.8', '1.1.1.1', 'google.com', 'github.com'].map(ex => (
            <button key={ex} className="example-chip" onClick={() => setQuery(ex)}>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <span className="info-icon">{icon}</span>
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}
