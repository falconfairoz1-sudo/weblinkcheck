import React, { useState, useEffect } from 'react';
import '../styles/advancedanalytics.css';

export default function AdvancedAnalytics({ scanData }) {
  const [stats, setStats] = useState({
    totalScans: 0,
    safeCount: 0,
    suspiciousCount: 0,
    maliciousCount: 0,
    averageRiskScore: 0,
    threatTrend: []
  });

  useEffect(() => {
    if (scanData) {
      calculateStats();
    }
  }, [scanData]);

  const calculateStats = () => {
    const scans = Array.isArray(scanData) ? scanData : [scanData];
    const total = scans.length;
    const safe = scans.filter(s => s.status === 'safe').length;
    const suspicious = scans.filter(s => s.status === 'suspicious').length;
    const malicious = scans.filter(s => s.status === 'malicious').length;
    const avgRisk = scans.reduce((sum, s) => sum + (s.riskScore || 0), 0) / total;

    setStats({
      totalScans: total,
      safeCount: safe,
      suspiciousCount: suspicious,
      maliciousCount: malicious,
      averageRiskScore: Math.round(avgRisk),
      threatTrend: scans.slice(-7)
    });
  };

  const getSafePercentage = () => {
    if (stats.totalScans === 0) return 0;
    return Math.round((stats.safeCount / stats.totalScans) * 100);
  };

  return (
    <div className="advanced-analytics">
      <div className="analytics-header">
        <h3>📊 Advanced Analytics</h3>
        <span className="analytics-badge">Real-time</span>
      </div>

      <div className="analytics-grid">
        {/* Total Scans */}
        <div className="analytics-card">
          <div className="card-icon">🔍</div>
          <div className="card-content">
            <div className="card-label">Total Scans</div>
            <div className="card-value">{stats.totalScans}</div>
          </div>
          <div className="card-trend">↗ +12%</div>
        </div>

        {/* Safe Rate */}
        <div className="analytics-card safe">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <div className="card-label">Safe Rate</div>
            <div className="card-value">{getSafePercentage()}%</div>
          </div>
          <div className="card-trend positive">{stats.safeCount} safe</div>
        </div>

        {/* Threats Detected */}
        <div className="analytics-card warning">
          <div className="card-icon">⚠️</div>
          <div className="card-content">
            <div className="card-label">Threats Detected</div>
            <div className="card-value">{stats.suspiciousCount + stats.maliciousCount}</div>
          </div>
          <div className="card-trend negative">{stats.maliciousCount} critical</div>
        </div>

        {/* Avg Risk Score */}
        <div className="analytics-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-label">Avg Risk Score</div>
            <div className="card-value">{stats.averageRiskScore}</div>
          </div>
          <div className="card-trend">out of 100</div>
        </div>
      </div>

      {/* Threat Distribution */}
      <div className="threat-distribution">
        <h4>Threat Distribution</h4>
        <div className="distribution-bars">
          <div className="distribution-item">
            <div className="distribution-label">
              <span>Safe</span>
              <span className="distribution-count">{stats.safeCount}</span>
            </div>
            <div className="distribution-bar">
              <div 
                className="distribution-fill safe"
                style={{ width: `${(stats.safeCount / Math.max(stats.totalScans, 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="distribution-item">
            <div className="distribution-label">
              <span>Suspicious</span>
              <span className="distribution-count">{stats.suspiciousCount}</span>
            </div>
            <div className="distribution-bar">
              <div 
                className="distribution-fill suspicious"
                style={{ width: `${(stats.suspiciousCount / Math.max(stats.totalScans, 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="distribution-item">
            <div className="distribution-label">
              <span>Malicious</span>
              <span className="distribution-count">{stats.maliciousCount}</span>
            </div>
            <div className="distribution-bar">
              <div 
                className="distribution-fill malicious"
                style={{ width: `${(stats.maliciousCount / Math.max(stats.totalScans, 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-timeline">
          {stats.threatTrend.map((scan, idx) => (
            <div key={idx} className={`activity-item ${scan.status}`}>
              <div className="activity-dot"></div>
              <div className="activity-content">
                <span className="activity-status">{scan.status.toUpperCase()}</span>
                <span className="activity-time">Just now</span>
              </div>
              <span className="activity-score">{scan.riskScore || 0}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
