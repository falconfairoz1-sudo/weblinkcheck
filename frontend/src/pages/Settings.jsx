import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/settings.css';

const DEFAULTS = {
  notifications: true,
  emailAlerts: false,
  autoSave: true,
  scanHistory: true,
  apiCaching: true,
  advancedAnalytics: true,
  exportFormat: 'pdf',
  language: 'en',
  timezone: 'auto'
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, updateUser, refreshUser } = useAuth();
  const notify = (msg, type) => window.showNotification?.(msg, type);

  const [loading, setLoading] = useState(false);

  // Fetch fresh user data on mount so totalScans is always current
  useEffect(() => {
    if (user) refreshUser();
  }, []);
  const [preferences, setPreferences] = useState(() => {
    // Load saved preferences from localStorage on first render
    try {
      const saved = localStorage.getItem('userPreferences');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  });

  const set = (key, value) => setPreferences(prev => ({ ...prev, [key]: value }));

  const handleSaveSettings = () => {
    setLoading(true);
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      notify('Settings saved successfully', 'success');
    } catch {
      notify('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('scanCache');
    notify('Cache cleared successfully', 'success');
  };

  const handleExportData = () => {
    const data = {
      user: user?.username || 'guest',
      preferences,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkguard-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Settings exported successfully', 'success');
  };

  const handleReset = () => {
    setPreferences({ ...DEFAULTS });
    localStorage.removeItem('userPreferences');
    notify('Settings reset to defaults', 'info');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your LinkGuard experience</p>
      </div>

      <div className="settings-container">

        {/* ── Account Information ─────────────────────────────────────────── */}
        <section className="settings-section">
          <div className="section-header">
            <h2>👤 Account Information</h2>
            <p>Your account details</p>
          </div>
          <div className="settings-content">
            {user ? (
              <div className="account-info">
                <div className="info-item">
                  <label>Username</label>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span className="info-value">{user.email || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Account Type</label>
                  <span className="info-value">
                    <span className="badge badge-premium">Premium</span>
                  </span>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <span className="info-value">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-item">
                  <label>Total Scans</label>
                  <span className="info-value">{user.totalScans || 0}</span>
                </div>
              </div>
            ) : (
              <p className="no-account">Please log in to view account details</p>
            )}
          </div>
        </section>

        {/* ── Appearance ──────────────────────────────────────────────────── */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🎨 Appearance</h2>
            <p>Customize the look and feel</p>
          </div>
          <div className="settings-content">

            {/* Theme */}
            <div className="preference-item">
              <div className="preference-info">
                <h3>Theme Mode</h3>
                <p>Choose between dark and light mode</p>
              </div>
              <div className="preference-control">
                <div className="theme-selector">
                  <button
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <span className="theme-icon">🌙</span>
                    <span>Dark</span>
                  </button>
                  <button
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <span className="theme-icon">☀️</span>
                    <span>Light</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="preference-item">
              <div className="preference-info">
                <h3>Language</h3>
                <p>Select your preferred language</p>
              </div>
              <div className="preference-control">
                <select
                  className="select-input"
                  value={preferences.language}
                  onChange={(e) => set('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>

            {/* Timezone */}
            <div className="preference-item">
              <div className="preference-info">
                <h3>Timezone</h3>
                <p>Set your timezone for accurate timestamps</p>
              </div>
              <div className="preference-control">
                <select
                  className="select-input"
                  value={preferences.timezone}
                  onChange={(e) => set('timezone', e.target.value)}
                >
                  <option value="auto">Auto Detect</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="Asia/Singapore">Singapore</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>
            </div>

          </div>
        </section>

        {/* ── Notifications ───────────────────────────────────────────────── */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔔 Notifications</h2>
            <p>Manage your notification preferences</p>
          </div>
          <div className="settings-content">

            <div className="preference-item">
              <div className="preference-info">
                <h3>In-App Notifications</h3>
                <p>Show toast notifications for scan results and alerts</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => set('notifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Email Alerts</h3>
                <p>Receive email alerts when a monitored URL becomes dangerous</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) => set('emailAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

          </div>
        </section>

        {/* ── Scanning Preferences ────────────────────────────────────────── */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔍 Scanning Preferences</h2>
            <p>Configure scan behaviour and features</p>
          </div>
          <div className="settings-content">

            <div className="preference-item">
              <div className="preference-info">
                <h3>Auto-Save Scans</h3>
                <p>Automatically save scan results to your history</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => set('autoSave', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Scan History</h3>
                <p>Keep a record of all your past scans</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.scanHistory}
                    onChange={(e) => set('scanHistory', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>API Result Caching</h3>
                <p>Cache scan results for 1 hour to speed up repeated scans</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.apiCaching}
                    onChange={(e) => set('apiCaching', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Advanced Analytics</h3>
                <p>Show detailed charts and threat breakdowns after each scan</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.advancedAnalytics}
                    onChange={(e) => set('advancedAnalytics', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Default Export Format</h3>
                <p>Format used when exporting scan results</p>
              </div>
              <div className="preference-control">
                <select
                  className="select-input"
                  value={preferences.exportFormat}
                  onChange={(e) => set('exportFormat', e.target.value)}
                >
                  <option value="pdf">PDF — Professional report</option>
                  <option value="json">JSON — Structured data</option>
                  <option value="csv">CSV — Spreadsheet</option>
                  <option value="txt">TXT — Plain text</option>
                </select>
              </div>
            </div>

          </div>
        </section>

        {/* ── Privacy & Security ──────────────────────────────────────────── */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔐 Privacy & Security</h2>
            <p>Manage your data and security settings</p>
          </div>
          <div className="settings-content">

            <div className="preference-item">
              <div className="preference-info">
                <h3>Data Encryption</h3>
                <p>All data is encrypted in transit via HTTPS</p>
              </div>
              <div className="preference-control">
                <span className="privacy-badge">✅ Enabled</span>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Data Privacy</h3>
                <p>Your scan data is never sold or shared with third parties</p>
              </div>
              <div className="preference-control">
                <span className="privacy-badge">✅ Protected</span>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Clear Cache</h3>
                <p>Remove locally cached scan results and temporary data</p>
              </div>
              <div className="preference-control">
                <button className="btn-secondary" onClick={handleClearCache}>
                  🗑️ Clear Cache
                </button>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Export Settings</h3>
                <p>Download your current preferences as a JSON file</p>
              </div>
              <div className="preference-control">
                <button className="btn-secondary" onClick={handleExportData}>
                  📥 Export Data
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ── About ───────────────────────────────────────────────────────── */}
        <section className="settings-section">
          <div className="section-header">
            <h2>ℹ️ About LinkGuard</h2>
            <p>Application information</p>
          </div>
          <div className="settings-content">
            <div className="about-info">
              <div className="about-item">
                <h3>Application</h3>
                <p>LinkGuard — AI-Powered Link Safety Checker</p>
              </div>
              <div className="about-item">
                <h3>Version</h3>
                <p>1.0.0 (Production)</p>
              </div>
              <div className="about-item">
                <h3>Security APIs</h3>
                <p>Google Safe Browsing · VirusTotal · AI Heuristics</p>
              </div>
              <div className="about-item">
                <h3>Features</h3>
                <p>URL Scanner · QR Scanner · Monitor · Analytics · 7 Tools</p>
              </div>
              <div className="about-item">
                <h3>Support</h3>
                <p><a href="mailto:support@linkguard.app">support@linkguard.app</a></p>
              </div>
              <div className="about-item">
                <h3>Documentation</h3>
                <p><a href="/scanner-guide">View User Guide →</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Save / Reset ────────────────────────────────────────────────── */}
        <div className="settings-actions">
          <button
            className="btn-save"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading
              ? <><span className="spinner"></span>Saving...</>
              : '💾 Save Settings'
            }
          </button>
          <button className="btn-reset" onClick={handleReset}>
            🔄 Reset to Defaults
          </button>
        </div>

      </div>
    </div>
  );
}
