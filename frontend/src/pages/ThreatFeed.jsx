import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';
import '../styles/threatfeed.css';

export default function ThreatFeed() {
  const [feed, setFeed] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchFeed = async () => {
    try {
      const [feedRes, recentRes] = await Promise.all([
        api.get('/tools/threat-feed'),
        api.get('/tools/recent-scans')
      ]);
      setFeed(feedRes.data.feed || []);
      setRecentScans(recentRes.data.scans || []);
    } catch (err) {
      console.error('Feed fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchFeed, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    if (status === 'malicious') return '#ef4444';
    if (status === 'suspicious') return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (status) => {
    if (status === 'malicious') return '❌';
    if (status === 'suspicious') return '⚠️';
    return '✅';
  };

  return (
    <div className="threatfeed-page">
      <div className="threatfeed-header">
        <div>
          <div className="threatfeed-icon">📡</div>
          <h1>Live Threat Feed</h1>
          <p>Real-time feed of recently detected threats and scanned URLs</p>
        </div>
        <div className="feed-controls">
          <button
            className={`refresh-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '⏸ Pause' : '▶ Auto-Refresh'}
          </button>
          <button className="refresh-btn" onClick={fetchFeed}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {autoRefresh && (
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE — refreshing every 15 seconds
        </div>
      )}

      <div className="feed-layout">
        {/* Threat Feed */}
        <div className="feed-section">
          <h2>🚨 Recent Threats Detected</h2>
          {loading ? (
            <div className="feed-loading">
              {[...Array(5)].map((_, i) => <div key={i} className="feed-skeleton"></div>)}
            </div>
          ) : feed.length === 0 ? (
            <div className="feed-empty">
              <span>✅</span>
              <p>No threats detected recently</p>
            </div>
          ) : (
            <div className="feed-list">
              {feed.map((item) => (
                <div key={item.id} className="feed-item threat">
                  <div className="feed-item-left">
                    <span className="feed-status-icon">{getStatusIcon(item.status)}</span>
                    <div>
                      <div className="feed-domain">{item.domain}</div>
                      <div className="feed-warning">{item.topWarning}</div>
                    </div>
                  </div>
                  <div className="feed-item-right">
                    <span className="feed-score" style={{ color: getStatusColor(item.status) }}>
                      {item.riskScore}/100
                    </span>
                    <span className="feed-time">{formatDate(item.detectedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Scans */}
        <div className="feed-section">
          <h2>🔍 Recent Scans</h2>
          {loading ? (
            <div className="feed-loading">
              {[...Array(5)].map((_, i) => <div key={i} className="feed-skeleton"></div>)}
            </div>
          ) : recentScans.length === 0 ? (
            <div className="feed-empty">
              <span>📭</span>
              <p>No scans yet</p>
            </div>
          ) : (
            <div className="feed-list">
              {recentScans.map((scan) => (
                <div key={scan._id} className="feed-item">
                  <div className="feed-item-left">
                    <span className="feed-status-icon">{getStatusIcon(scan.status)}</span>
                    <div>
                      <div className="feed-domain">{scan.domain}</div>
                      <div className="feed-time">{formatDate(scan.createdAt)}</div>
                    </div>
                  </div>
                  <div className="feed-item-right">
                    <span className="feed-score" style={{ color: getStatusColor(scan.status) }}>
                      {scan.riskScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="feed-cta">
        <p>Found a suspicious link?</p>
        <Link to="/" className="cta-btn">🛡️ Scan It Now</Link>
      </div>
    </div>
  );
}
