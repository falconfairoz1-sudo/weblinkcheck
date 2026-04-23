import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import ScanStreak from '../components/ScanStreak';
import { getStatusColor, getStatusIcon, formatDate } from '../utils/helpers';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get('/scan/stats'),
          api.get('/history?limit=5')
        ]);
        setStats(statsRes.data);
        setRecentScans(historyRes.data.scans);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="auth-required">
          <span className="auth-icon">🔐</span>
          <h2>Login Required</h2>
          <p>Please log in to view your dashboard.</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user.username}! 👋</h1>
          <p className="dashboard-subtitle">Your security scanning dashboard</p>
        </div>
        <Link to="/" className="btn-scan-new">
          <span>🔍</span>
          Scan New URL
        </Link>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <StatCard icon="📊" title="Total Scans" value={stats?.total || 0} color="#3b82f6" />
            <StatCard icon="✅" title="Safe URLs" value={stats?.safe || 0} color="#10b981" />
            <StatCard icon="⚠️" title="Suspicious" value={stats?.suspicious || 0} color="#f59e0b" />
            <StatCard icon="❌" title="Malicious" value={stats?.malicious || 0} color="#ef4444" />
          </div>

          {/* Scan Streak */}
          <div className="dashboard-section">
            <ScanStreak />
          </div>

          {/* Advanced Analytics */}
          {recentScans.length > 0 && (
            <div className="dashboard-section">
              <AdvancedAnalytics scanData={recentScans} />
            </div>
          )}

          {/* Recent Activity */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Scans</h2>
              <Link to="/history" className="view-all-link">View All →</Link>
            </div>

            {recentScans.length > 0 ? (
              <div className="recent-scans">
                {recentScans.map((scan) => (
                  <RecentScanItem key={scan._id} scan={scan} />
                ))}
              </div>
            ) : (
              <div className="no-scans">
                <span className="no-scans-icon">📭</span>
                <p>No scans yet. <Link to="/">Scan your first URL</Link></p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <ActionCard
                icon="🔍"
                title="Scan URL"
                desc="Check if a link is safe"
                to="/"
              />
              <ActionCard
                icon="📋"
                title="Bulk Scan"
                desc="Scan multiple URLs at once"
                to="/?bulk=true"
              />
              <ActionCard
                icon="📁"
                title="View History"
                desc="See all your past scans"
                to="/history"
              />
            </div>
          </div>

          {/* Security Tips */}
          <div className="dashboard-section">
            <h2>Security Tips</h2>
            <div className="security-tips">
              <TipCard
                icon="🎣"
                title="Phishing Warning Signs"
                tips={[
                  "Urgent language (act now, limited time)",
                  "Requests for personal information",
                  "Suspicious sender or domain",
                  "Poor grammar and spelling"
                ]}
              />
              <TipCard
                icon="🔗"
                title="Link Safety Best Practices"
                tips={[
                  "Always check URLs before clicking",
                  "Look for HTTPS (secure connection)",
                  "Be wary of shortened URLs",
                  "Verify sender authenticity"
                ]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value.toLocaleString()}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
}

function RecentScanItem({ scan }) {
  const statusClass = getStatusColor(scan.status);
  const statusIcon = getStatusIcon(scan.status);

  return (
    <Link to={`/scan/${scan._id}`} className={`recent-scan-item ${statusClass}`}>
      <span className="scan-status-icon">{statusIcon}</span>
      <div className="scan-info">
        <div className="scan-url" title={scan.url}>
          {scan.url.length > 50 ? scan.url.substring(0, 50) + '...' : scan.url}
        </div>
        <div className="scan-meta">
          <span className="scan-domain">{scan.domain}</span>
          <span className="scan-date">{formatDate(scan.createdAt)}</span>
        </div>
      </div>
      <div className="scan-risk" style={{ color: scan.riskScore >= 60 ? '#ef4444' : scan.riskScore >= 30 ? '#f59e0b' : '#10b981' }}>
        {scan.riskScore}/100
      </div>
    </Link>
  );
}

function ActionCard({ icon, title, desc, to }) {
  return (
    <Link to={to} className="action-card">
      <span className="action-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </Link>
  );
}

function TipCard({ icon, title, tips }) {
  return (
    <div className="tip-card">
      <div className="tip-header">
        <span className="tip-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <ul className="tip-list">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}