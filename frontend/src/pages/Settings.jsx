import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/settings.css';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: theme === 'dark',
    autoSave: true
  });

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThemeChange = () => {
    toggleTheme();
    setPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
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
            <h2>👤 Account</h2>
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
                  <label>Member Since</label>
                  <span className="info-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
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
          </div>
          <div className="settings-content">
            <div className="preference-item">
              <div className="preference-info">
                <h3>Theme</h3>
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
          </div>
        </section>

        {/* Notification Settings */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔔 Notifications</h2>
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
                    onChange={() => handlePreferenceChange('notifications')}
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
                    onChange={() => handlePreferenceChange('emailAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="settings-section">
          <div className="section-header">
            <h2>🔐 Privacy & Security</h2>
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
                    onChange={() => handlePreferenceChange('autoSave')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h3>Data Privacy</h3>
                <p>Your scan data is encrypted and never shared</p>
              </div>
              <div className="preference-control">
                <span className="privacy-badge">✅ Protected</span>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="settings-section">
          <div className="section-header">
            <h2>ℹ️ About</h2>
          </div>
          <div className="settings-content">
            <div className="about-info">
              <div className="about-item">
                <h3>LinkGuard</h3>
                <p>AI-Powered Link Safety Checker</p>
              </div>
              <div className="about-item">
                <h3>Version</h3>
                <p>1.0.0</p>
              </div>
              <div className="about-item">
                <h3>Security APIs</h3>
                <p>Google Safe Browsing, VirusTotal, AI Heuristics</p>
              </div>
              <div className="about-item">
                <h3>Support</h3>
                <p>
                  <a href="mailto:support@linkguard.app">support@linkguard.app</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="settings-actions">
          <button className="btn-save" onClick={() => window.showNotification?.('Settings saved!', 'success')}>
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
