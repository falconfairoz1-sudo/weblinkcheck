import { useState } from 'react';
import api from '../utils/api';
import '../styles/domaininfo.css';

export default function DomainInfo() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/tools/domain-info', { domain: domain.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="domaininfo-page">
      <div className="domaininfo-header">
        <div className="domaininfo-icon">🌐</div>
        <h1>Domain Info</h1>
        <p>Get DNS records, IP address, mail servers, and security info for any domain</p>
      </div>

      <div className="domaininfo-card">
        <form onSubmit={handleLookup} className="domaininfo-form">
          <div className="domaininfo-input-wrap">
            <span className="domaininfo-input-icon">🌐</span>
            <input
              type="text"
              className="domaininfo-input"
              placeholder="Enter domain (e.g. google.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="domaininfo-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Looking up...</> : '🔍 Lookup Domain'}
          </button>
        </form>

        {error && <div className="domaininfo-error"><span>⚠️</span> {error}</div>}

        {result && (
          <div className="domaininfo-result">
            <div className="domain-hero">
              <span className="domain-globe">🌐</span>
              <div>
                <h2>{result.domain}</h2>
                <span className={`tld-badge ${result.isSuspiciousTLD ? 'tld-bad' : 'tld-ok'}`}>
                  .{result.tld} {result.isSuspiciousTLD ? '⚠️ Suspicious TLD' : '✅ Common TLD'}
                </span>
              </div>
            </div>

            <div className="dns-sections">
              <DnsSection
                title="🖥️ IP Address"
                items={result.ipAddress ? [result.ipAddress] : []}
                empty="No A record found"
              />
              <DnsSection
                title="📧 Mail Servers (MX)"
                items={result.mxRecords}
                empty="No MX records found"
              />
              <DnsSection
                title="🔢 Name Servers (NS)"
                items={result.nsRecords}
                empty="No NS records found"
              />
              <DnsSection
                title="📝 TXT Records"
                items={result.txtRecords}
                empty="No TXT records found"
                mono
              />
            </div>

            <div className="domain-stats">
              <div className="domain-stat">
                <span className="stat-icon">📏</span>
                <span className="stat-label">Domain Length</span>
                <span className="stat-val">{result.domainLength} chars</span>
              </div>
              <div className="domain-stat">
                <span className="stat-icon">🔒</span>
                <span className="stat-label">SSL</span>
                <span className="stat-val">{result.hasSSL ? '✅ Yes' : '❌ No'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DnsSection({ title, items, empty, mono }) {
  return (
    <div className="dns-section">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="dns-empty">{empty}</p>
      ) : (
        <ul className="dns-list">
          {items.map((item, i) => (
            <li key={i} className={mono ? 'mono' : ''}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
