import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/monitor.css';

export default function Monitor() {
  const { user } = useAuth();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingMonitor, setAddingMonitor] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [checkInterval, setCheckInterval] = useState('daily');
  const [notifyOnChange, setNotifyOnChange] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchMonitors();
    }
  }, [user]);

  const fetchMonitors = async () => {
    try {
      const response = await api.get('/monitor');
      setMonitors(response.data.monitors);
    } catch (err) {
      setError('Failed to load monitors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMonitor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAddingMonitor(true);

    try {
      await api.post('/monitor', {
        url: newUrl,
        checkInterval,
        notifyOnChange
      });

      setSuccess('URL added to monitoring!');
      setNewUrl('');
      fetchMonitors();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add monitor');
    } finally {
      setAddingMonitor(false);
    }
  };

  const handleDeleteMonitor = async (id) => {
    if (!confirm('Remove this URL from monitoring?')) return;

    try {
      await api.delete(`/monitor/${id}`);
      setMonitors(monitors.filter(m => m._id !== id));
      setSuccess('Monitor removed');
    } catch (err) {
      setError('Failed to remove monitor');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#10b981';
      case 'suspicious': return '#f59e0b';
      case 'dangerous': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getIntervalLabel = (interval) => {
    switch (interval) {
      case 'hourly': return 'Every hour';
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      default: return interval;
    }
  };

  if (!user) {
    return (
      <div className="monitor-page">
        <div className="monitor-auth-required">
          <h2>🔒 Authentication Required</h2>
          <p>Please log in to use URL monitoring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitor-page">
      <div className="monitor-container">
        <div className="monitor-header">
          <h1>👁️ URL Monitoring</h1>
          <p>Get notified when monitored URLs change their security status</p>
        </div>

        <div className="add-monitor-section">
          <h2>Add New Monitor</h2>
          <form onSubmit={handleAddMonitor} className="add-monitor-form">
            <div className="form-group">
              <label>URL to Monitor</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                required
                disabled={addingMonitor}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Check Interval</label>
                <select
                  value={checkInterval}
                  onChange={(e) => setCheckInterval(e.target.value)}
                  disabled={addingMonitor}
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={notifyOnChange}
                    onChange={(e) => setNotifyOnChange(e.target.checked)}
                    disabled={addingMonitor}
                  />
                  <span>Email notifications</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={addingMonitor} className="btn-add-monitor">
              {addingMonitor ? 'Adding...' : '+ Add Monitor'}
            </button>
          </form>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>

        <div className="monitors-list-section">
          <h2>Active Monitors ({monitors.length})</h2>

          {loading ? (
            <div className="loading-state">Loading monitors...</div>
          ) : monitors.length === 0 ? (
            <div className="empty-state">
              <p>No active monitors yet</p>
              <span>Add a URL above to start monitoring</span>
            </div>
          ) : (
            <div className="monitors-grid">
              {monitors.map((monitor) => (
                <div key={monitor._id} className="monitor-card">
                  <div className="monitor-card-header">
                    <div
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(monitor.lastStatus) }}
                    ></div>
                    <span className="status-text">{monitor.lastStatus}</span>
                  </div>

                  <div className="monitor-url">
                    <a href={monitor.url} target="_blank" rel="noopener noreferrer">
                      {monitor.url}
                    </a>
                  </div>

                  <div className="monitor-stats">
                    <div className="stat">
                      <span className="stat-label">Risk Score</span>
                      <span className="stat-value" style={{ color: getStatusColor(monitor.lastStatus) }}>
                        {monitor.lastRiskScore}/100
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Checks</span>
                      <span className="stat-value">{monitor.checksPerformed}</span>
                    </div>
                  </div>

                  <div className="monitor-info">
                    <div className="info-row">
                      <span>🔄 {getIntervalLabel(monitor.checkInterval)}</span>
                      <span>📧 {monitor.notifyOnChange ? 'On' : 'Off'}</span>
                    </div>
                    <div className="info-row">
                      <span className="last-checked">
                        Last checked: {new Date(monitor.lastChecked).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {monitor.statusChanges?.length > 0 && (
                    <div className="status-changes">
                      <span className="changes-label">
                        ⚠️ {monitor.statusChanges.length} status change(s)
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteMonitor(monitor._id)}
                    className="btn-remove-monitor"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="monitor-info-section">
          <h3>How URL Monitoring Works</h3>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🔍</div>
              <h4>Automatic Checks</h4>
              <p>URLs are automatically rescanned based on your chosen interval</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h4>Instant Alerts</h4>
              <p>Get email notifications when a URL's status changes</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📊</div>
              <h4>History Tracking</h4>
              <p>View all status changes and risk score trends over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
