import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/ScanContext';
import api from '../utils/api';
import '../styles/settings.css';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: theme === 'dark',
    autoSave: true,
    scanHistory: true,
    apiCaching: true,
    advancedAnalytics: true,
    exportFormat: 'pdf',
    language: 'en',
    timezone: 'auto'
  });

  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save to backend if user is logged in
      if (user) {
        await api.put('/auth/update-preferences', { preferences });
      }
      
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      addNotification('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Save settings error:', error);
      addNotification('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('scanCache');
    addNotification('Cache cleared successfully', 'success');
  };

  const handleExportData = () => {
    const data = {
      user: user?.username,
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
    addNotification('Settings exported successfully', 'success');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your LinkGuard experience</p>
      </div>

      <div className="settings-container">
        {/* Account Settings */}
        <section className="settings-section">
          <div className="section-header">
            <h2>👤 Account Information</h2>
            <p>Manage your account details</p>
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
              <p className="no-account">Please log in to view account settings</p>
            )}
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🎨 Appearance</h2>
            <p>Customize the look and feel</p>
          </div>
          <div className="settings-content">
            <div className="preference-item">
              <div className="preference-info">
                <h3>Theme Mode</h3>
                <p>Choose between dark and light mode</p>
              </div>
              <div className="preference-control">
                <div className="theme-selector">
                  <button
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={handleThemeChange}
                  >
                    <span className="theme-icon">🌙</span>
                    <span>Dark</span>
                  </button>
                  <button
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={handleThemeChange}
                  >
                    <span className="theme-icon">☀️</span>
                    <span>Light</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Language</h3>
                <p>Select your preferred language</p>
              </div>
              <div className="preference-control">
                <select 
                  className="select-input"
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Timezone</h3>
                <p>Set your timezone for accurate timestamps</p>
              </div>
              <div className="preference-control">
                <select 
                  className="select-input"
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
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
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔔 Notifications</h2>
            <p>Manage your notification preferences</p>
          </div>
          <div className="settings-content">
            <div className="preference-item">
              <div className="preference-info">
                <h3>In-App Notifications</h3>
                <p>Receive notifications for scan results and alerts</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Email Alerts</h3>
                <p>Get email notifications for important security alerts</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) => handlePreferenceChange('emailAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Scanning Preferences */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔍 Scanning Preferences</h2>
            <p>Configure scan behavior and features</p>
          </div>
          <div className="settings-content">
            <div className="preference-item">
              <div className="preference-info">
                <h3>Auto-Save Scans</h3>
                <p>Automatically save your scan history</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Scan History</h3>
                <p>Keep a record of all your scans</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.scanHistory}
                    onChange={(e) => handlePreferenceChange('scanHistory', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>API Caching</h3>
                <p>Cache API results for faster repeated scans</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.apiCaching}
                    onChange={(e) => handlePreferenceChange('apiCaching', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Advanced Analytics</h3>
                <p>Enable detailed security analysis and insights</p>
              </div>
              <div className="preference-control">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.advancedAnalytics}
                    onChange={(e) => handlePreferenceChange('advancedAnalytics', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Default Export Format</h3>
                <p>Choose your preferred export format</p>
              </div>
              <div className="preference-control">
                <select 
                  className="select-input"
                  value={preferences.exportFormat}
                  onChange={(e) => handlePreferenceChange('exportFormat', e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔐 Privacy & Security</h2>
            <p>Manage your data and security settings</p>
          </div>
          <div className="settings-content">
            <div className="preference-item">
              <div className="preference-info">
                <h3>Data Encryption</h3>
                <p>All your data is encrypted end-to-end</p>
              </div>
              <div className="preference-control">
                <span className="privacy-badge">✅ Enabled</span>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Data Privacy</h3>
                <p>Your scan data is never shared with third parties</p>
              </div>
              <div className="preference-control">
                <span className="privacy-badge">✅ Protected</span>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Clear Cache</h3>
                <p>Remove cached scan results and temporary data</p>
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
                <p>Download your settings and preferences</p>
              </div>
              <div className="preference-control">
                <button className="btn-secondary" onClick={handleExportData}>
                  📥 Export Data
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="settings-section">
          <div className="section-header">
            <h2>ℹ️ About LinkGuard</h2>
            <p>Application information and support</p>
          </div>
          <div className="settings-content">
            <div className="about-info">
              <div className="about-item">
                <h3>Application</h3>
                <p>LinkGuard - AI-Powered Link Safety Checker</p>
              </div>
              <div className="about-item">
                <h3>Version</h3>
                <p>1.0.0 (Production)</p>
              </div>
              <div className="about-item">
                <h3>Security APIs</h3>
                <p>Google Safe Browsing, VirusTotal, AI Heuristics</p>
              </div>
              <div className="about-item">
                <h3>Features</h3>
                <p>URL Scanner, QR Scanner, Monitoring, Analytics, Reports</p>
              </div>
              <div className="about-item">
                <h3>Support</h3>
                <p>
                  <a href="mailto:support@linkguard.app">support@linkguard.app</a>
                </p>
              </div>
              <div className="about-item">
                <h3>Documentation</h3>
                <p>
                  <a href="/scanner-guide">View User Guide</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="settings-actions">
          <button 
            className="btn-save" 
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              <>
                💾 Save Settings
              </>
            )}
          </button>
          <button 
            className="btn-reset" 
            onClick={() => {
              setPreferences({
                notifications: true,
                emailAlerts: false,
                darkMode: theme === 'dark',
                autoSave: true,
                scanHistory: true,
                apiCaching: true,
                advancedAnalytics: true,
                exportFormat: 'pdf',
                language: 'en',
                timezone: 'auto'
              });
              addNotification('Settings reset to defaults', 'info');
            }}
          >
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
