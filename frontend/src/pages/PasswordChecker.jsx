import { useState } from 'react';
import api from '../utils/api';
import '../styles/passwordchecker.css';

export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await api.post('/tools/password-strength', { password });
      setResult(res.data);
    } catch (err) {
      window.showNotification?.(err.response?.data?.error || 'Check failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
    setResult(null);
  };

  return (
    <div className="pwchecker-page">
      <div className="pwchecker-header">
        <div className="pwchecker-icon">🔑</div>
        <h1>Password Strength Checker</h1>
        <p>Test how strong your password is — nothing is stored or sent to any server</p>
      </div>

      <div className="pwchecker-card">
        <form onSubmit={handleCheck} className="pwchecker-form">
          <div className="pw-input-wrap">
            <span className="pw-input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="pw-input"
              placeholder="Enter a password to test..."
              value={password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" className="pw-check-btn" disabled={loading || !password}>
            {loading ? <><span className="btn-spinner"></span>Checking...</> : '🔍 Check Strength'}
          </button>
        </form>

        {result && (
          <div className="pw-result">
            <div className="strength-display">
              <div className="strength-label" style={{ color: result.color }}>
                {result.strength}
              </div>
              <div className="strength-bar-wrap">
                <div
                  className="strength-bar-fill"
                  style={{ width: `${result.percentage}%`, background: result.color }}
                ></div>
              </div>
              <div className="strength-score">{result.score}/{result.maxScore} checks passed</div>
            </div>

            <div className="checks-grid">
              {Object.entries(result.checks).map(([key, passed]) => (
                <div key={key} className={`check-item ${passed ? 'passed' : 'failed'}`}>
                  <span>{passed ? '✅' : '❌'}</span>
                  <span>{formatCheckLabel(key)}</span>
                </div>
              ))}
            </div>

            {result.suggestions.length > 0 && (
              <div className="pw-suggestions">
                <h3>💡 Suggestions</h3>
                <ul>
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pw-tips">
        <h3>🛡️ Password Best Practices</h3>
        <div className="tips-grid">
          <TipCard icon="📏" title="Length Matters" desc="Use at least 16 characters for strong security" />
          <TipCard icon="🎲" title="Use a Passphrase" desc="Combine 4+ random words for memorable security" />
          <TipCard icon="🔄" title="Unique Passwords" desc="Never reuse passwords across different sites" />
          <TipCard icon="🔐" title="Password Manager" desc="Use a password manager to store complex passwords" />
        </div>
      </div>
    </div>
  );
}

function formatCheckLabel(key) {
  const labels = {
    length: 'At least 12 characters',
    uppercase: 'Contains uppercase letters',
    lowercase: 'Contains lowercase letters',
    numbers: 'Contains numbers',
    symbols: 'Contains special characters',
    noCommon: 'Not a common password',
    noRepeating: 'No repeating characters',
    longEnough: 'At least 16 characters'
  };
  return labels[key] || key;
}

function TipCard({ icon, title, desc }) {
  return (
    <div className="pw-tip-card">
      <span className="tip-icon">{icon}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}
