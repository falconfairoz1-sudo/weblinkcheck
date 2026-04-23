import { useState } from 'react';
import api from '../utils/api';
import '../styles/emailheader.css';

const SAMPLE = `From: "PayPal" <security@paypa1.com>
Reply-To: attacker@gmail.com
Return-Path: <bounce@spammer.net>
Received-SPF: fail (domain does not designate as permitted sender)
Subject: Your account has been limited
Date: Mon, 1 Jan 2024 10:00:00 +0000
Message-ID: <abc123@spammer.net>`;

export default function EmailHeaderAnalyzer() {
  const [headers, setHeaders] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!headers.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/advanced/email-headers', { headers });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const severityColor = { high: '#ef4444', medium: '#f59e0b', low: '#3b82f6' };
  const authColor = (v) => v === 'pass' ? '#10b981' : v === 'fail' ? '#ef4444' : '#6b7280';

  return (
    <div className="email-page">
      <div className="email-header-top">
        <span className="email-icon">📧</span>
        <h1>Email Header Analyzer</h1>
        <p>Paste raw email headers to detect spoofing, phishing, and authentication failures</p>
      </div>

      <div className="email-card">
        <form onSubmit={handleAnalyze} className="email-form">
          <div className="email-textarea-wrap">
            <label>Paste Email Headers</label>
            <textarea
              className="email-textarea"
              placeholder="Paste raw email headers here..."
              value={headers}
              onChange={e => setHeaders(e.target.value)}
              rows={8}
              required
            />
          </div>
          <div className="email-form-actions">
            <button type="button" className="email-sample-btn" onClick={() => setHeaders(SAMPLE)}>
              📋 Load Sample
            </button>
            <button type="submit" className="email-analyze-btn" disabled={loading}>
              {loading ? <><span className="btn-spinner"></span>Analyzing...</> : '🔍 Analyze Headers'}
            </button>
          </div>
        </form>

        {error && <div className="email-error">⚠️ {error}</div>}

        {result && (
          <div className="email-result">
            <div className={`email-verdict ${result.isSuspicious ? 'suspicious' : 'clean'}`}>
              <span>{result.isSuspicious ? '🚨' : '✅'}</span>
              <div>
                <strong>{result.isSuspicious ? 'Suspicious Email Detected' : 'No Major Issues Found'}</strong>
                <p>{result.summary}</p>
              </div>
              <div className="email-risk-score" style={{ color: result.riskScore >= 60 ? '#ef4444' : result.riskScore >= 30 ? '#f59e0b' : '#10b981' }}>
                {result.riskScore}/100
              </div>
            </div>

            <div className="email-auth-row">
              {['spf', 'dkim', 'dmarc'].map(k => (
                <div key={k} className="email-auth-badge" style={{ borderColor: authColor(result.authentication[k]) }}>
                  <span className="auth-name">{k.toUpperCase()}</span>
                  <span className="auth-val" style={{ color: authColor(result.authentication[k]) }}>
                    {result.authentication[k]}
                  </span>
                </div>
              ))}
            </div>

            <div className="email-fields">
              {result.from && <EmailField label="From" value={result.from} />}
              {result.replyTo && <EmailField label="Reply-To" value={result.replyTo} highlight={result.isSuspicious} />}
              {result.returnPath && <EmailField label="Return-Path" value={result.returnPath} />}
              {result.subject && <EmailField label="Subject" value={result.subject} />}
              {result.date && <EmailField label="Date" value={result.date} />}
            </div>

            {result.warnings.length > 0 && (
              <div className="email-warnings">
                <h3>⚠️ Issues Found</h3>
                {result.warnings.map((w, i) => (
                  <div key={i} className="email-warning-item" style={{ borderLeftColor: severityColor[w.severity] }}>
                    <span className="warn-severity" style={{ color: severityColor[w.severity] }}>{w.severity.toUpperCase()}</span>
                    <span className="warn-msg">{w.message}</span>
                  </div>
                ))}
              </div>
            )}

            {result.receivedHops.length > 0 && (
              <div className="email-hops">
                <h3>📡 Mail Server Hops ({result.receivedHops.length})</h3>
                {result.receivedHops.map((hop, i) => (
                  <div key={i} className="email-hop">
                    <span className="hop-num">{i + 1}</span>
                    <span className="hop-text">{hop.substring(0, 100)}{hop.length > 100 ? '...' : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmailField({ label, value, highlight }) {
  return (
    <div className={`email-field ${highlight ? 'highlighted' : ''}`}>
      <span className="email-field-label">{label}</span>
      <span className="email-field-value">{value}</span>
    </div>
  );
}
