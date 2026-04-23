import { useState } from 'react';
import api from '../utils/api';
import '../styles/leakedpassword.css';

export default function LeakedPasswordCheck() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true); setResult(null);
    try {
      const res = await api.post('/advanced/leaked-password', { password });
      setResult(res.data);
    } catch {
      window.showNotification?.('Check failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const severityColor = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#3b82f6', none: '#10b981' };

  return (
    <div className="leaked-page">
      <div className="leaked-header">
        <span className="leaked-icon">🔓</span>
        <h1>Leaked Password Check</h1>
        <p>Check if your password has appeared in known data breaches using k-anonymity (your password is never sent in full)</p>
      </div>

      <div className="leaked-privacy-note">
        <span>🛡️</span>
        <p>Only the first 5 characters of your password's SHA-1 hash are sent to the API. Your actual password never leaves your device.</p>
      </div>

      <div className="leaked-card">
        <form onSubmit={handleCheck} className="leaked-form">
          <div className="leaked-input-wrap">
            <span>🔒</span>
            <input
              type={show ? 'text' : 'password'}
              className="leaked-input"
              placeholder="Enter password to check..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button type="button" className="leaked-toggle" onClick={() => setShow(!show)}>
              {show ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="leaked-btn" disabled={loading || !password}>
            {loading ? <><span className="btn-spinner"></span>Checking...</> : '🔍 Check for Breaches'}
          </button>
        </form>

        {result && (
          <div className={`leaked-result ${result.isLeaked ? 'leaked' : 'safe'}`}>
            <div className="leaked-verdict">
              <span className="leaked-verdict-icon">{result.isLeaked ? '🚨' : '✅'}</span>
              <div>
                <strong>{result.isLeaked ? 'Password Found in Breaches!' : 'Password Not Found'}</strong>
                <p>{result.message}</p>
              </div>
              {result.isLeaked && (
                <div className="leaked-count-badge" style={{ background: severityColor[result.severity] }}>
                  {result.count.toLocaleString()} breaches
                </div>
              )}
            </div>

            <div className="leaked-severity" style={{ borderColor: severityColor[result.severity] }}>
              <span>Severity: </span>
              <strong style={{ color: severityColor[result.severity] }}>{result.severity.toUpperCase()}</strong>
            </div>

            <div className="leaked-recommendation">
              <span>💡</span>
              <p>{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="leaked-tips">
        <h3>🛡️ If Your Password Was Found</h3>
        <div className="leaked-tips-grid">
          <div className="leaked-tip"><span>1️⃣</span><p>Change it immediately on all sites where it's used</p></div>
          <div className="leaked-tip"><span>2️⃣</span><p>Use a unique password for every account</p></div>
          <div className="leaked-tip"><span>3️⃣</span><p>Enable two-factor authentication (2FA)</p></div>
          <div className="leaked-tip"><span>4️⃣</span><p>Use a password manager to generate strong passwords</p></div>
        </div>
      </div>
    </div>
  );
}
