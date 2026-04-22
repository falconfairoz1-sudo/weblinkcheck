import React from 'react';
import { Link } from 'react-router-dom';
import { getStatusColor, getStatusIcon, getStatusLabel, getRiskColor, formatDate, truncateUrl } from '../utils/helpers';
import '../styles/historylist.css';

export default function HistoryList({ scans, onDelete, loading }) {
  if (loading) {
    return (
      <div className="history-loading">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-row"></div>
        ))}
      </div>
    );
  }

  if (!scans || scans.length === 0) {
    return (
      <div className="history-empty">
        <span className="empty-icon">📭</span>
        <p>No scan history found.</p>
        <Link to="/" className="scan-now-link">Scan a URL now →</Link>
      </div>
    );
  }

  return (
    <div className="history-list">
      {scans.map((scan) => (
        <HistoryItem key={scan._id} scan={scan} onDelete={onDelete} />
      ))}
    </div>
  );
}

function HistoryItem({ scan, onDelete }) {
  const statusClass = getStatusColor(scan.status);
  const statusIcon = getStatusIcon(scan.status);
  const riskColor = getRiskColor(scan.riskScore);

  return (
    <div className={`history-item ${statusClass}`}>
      <div className="history-item-left">
        <span className="history-status-icon">{statusIcon}</span>
        <div className="history-url-info">
          <a
            href={scan.url}
            target="_blank"
            rel="noopener noreferrer"
            className="history-url"
            title={scan.url}
          >
            {truncateUrl(scan.url, 55)}
          </a>
          <span className="history-domain">{scan.domain}</span>
        </div>
      </div>

      <div className="history-item-right">
        <div className="history-risk" style={{ color: riskColor }}>
          <span className="risk-num">{scan.riskScore}</span>
          <span className="risk-label-sm">risk</span>
        </div>
        <span className={`history-badge ${statusClass}`}>{getStatusLabel(scan.status)}</span>
        <span className="history-date">{formatDate(scan.createdAt)}</span>
        <div className="history-actions">
          <Link to={`/scan/${scan._id}`} className="action-btn view-btn" title="View details">
            👁
          </Link>
          {onDelete && (
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(scan._id)}
              title="Delete scan"
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
