import { useState } from 'react';
import api from '../utils/api';
import '../styles/sslchecker.css';

export default function SSLChecker() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/advanced/ssl-check', { domain: domain.trim() });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'SSL check failed');
    } finally {
      setLoading(false);
    }
  };

  const gradeColor = { A: '#10b981', B: '#f59e0b', C: '#f97316', F: '#ef4444' };

  return (
    <div className="ssl-page">
      <div className="ssl-header">
        <span className="ssl-icon">🔒</span>
        <h1>SSL Certificate Checker</h1>
        <p>Inspect SSL/TLS certificate details, expiry, and security grade for any domain</p>
      </div>

      <div className="ssl-card">
        <form onSubmit={handleCheck} className="ssl-form">
          <div className="ssl-input-wrap">
            <span>🌐</span>
            <input
              type="text"
              className="ssl-input"
              placeholder="Enter domain (e.g. google.com)"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="ssl-btn" disabled={loading}>
            {loading ? <><span className="btn-spinner"></span>Checking...</> : '🔍 Check SSL'}
          </button>
        </form>

        {error && <div className="ssl-error">⚠️ {error}</div>}

        {result && !result.error && (
          <div className="ssl-result">
            <div className="ssl-grade-row">
              <div className="ssl-grade" style={{ color: gradeColor[result.grade] || '#6b7280' }}>
                {result.grade}
              </div>
              <div>
                <div className="ssl-domain-name">{result.domain}</div>
                <div className={`ssl-status ${result.isValid ? 'valid' : 'invalid'}`}>
                  {result.isValid ? '✅ Valid Certificate' : result.isExpired ? '❌ Expired' : '⚠️ Not Trusted'}
                </div>
              </div>
            </div>

            <div className="ssl-grid">
              <SslRow label="Issued To" value={result.subject} />
              <SslRow label="Organization" value={result.subjectOrg || '—'} />
              <SslRow label="Issuer" value={result.issuer} />
              <SslRow label="Valid From" value={result.validFrom ? new Date(result.validFrom).toLocaleDateString() : '—'} />
              <SslRow label="Valid Until" value={result.validTo ? new Date(result.validTo).toLocaleDateString() : '—'} />
              <SslRow
                label="Days Remaining"
                value={result.daysLeft !== undefined ? `${result.daysLeft} days` : '—'}
                highlight={result.daysLeft < 30 ? 'warn' : result.daysLeft < 0 ? 'danger' : 'ok'}
              />
              <SslRow label="Protocol" value={result.protocol || '—'} />
              <SslRow label="Cipher" value={result.cipher || '—'} />
            </div>

            {result.altNames?.length > 0 && (
              <div className="ssl-altnames">
                <div className="ssl-altnames-label">Subject Alternative Names</div>
                <div className="ssl-altnames-list">
                  {result.altNames.map((n, i) => <span key={i} className="ssl-altname">{n}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div className="ssl-error">⚠️ {result.error}</div>
        )}
      </div>

      <div className="ssl-info-grid">
        <InfoCard icon="🔒" title="What is SSL?" desc="SSL/TLS encrypts data between your browser and the server, protecting it from interception." />
        <InfoCard icon="📅" title="Certificate Expiry" desc="Expired certificates cause browser warnings and leave connections unencrypted." />
        <InfoCard icon="🏆" title="Grade A" desc="Grade A means a valid, trusted certificate with strong encryption and plenty of days remaining." />
        <InfoCard icon="⚠️" title="Grade F" desc="Grade F means the certificate is expired, self-signed, or the domain has no SSL at all." />
      </div>
    </div>
  );
}

function SslRow({ label, value, highlight }) {
  const cls = highlight === 'warn' ? 'ssl-val-warn' : highlight === 'danger' ? 'ssl-val-danger' : highlight === 'ok' ? 'ssl-val-ok' : '';
  return (
    <div className="ssl-row">
      <span className="ssl-row-label">{label}</span>
      <span className={`ssl-row-value ${cls}`}>{value}</span>
    </div>
  );
}

function InfoCard({ icon, title, desc }) {
  return (
    <div className="ssl-info-card">
      <span className="ssl-info-icon">{icon}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}
