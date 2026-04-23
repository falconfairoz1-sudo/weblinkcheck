import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStatusColor, getStatusIcon, getStatusLabel, getRiskColor, getSeverityColor, formatDate, truncateUrl } from '../utils/helpers';
import RiskGauge from './RiskGauge';
import CommunityVotes from './CommunityVotes';
import '../styles/resultcard.css';

export default function ResultCard({ result }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) return null;

  const {
    url, domain, status, riskScore, scanDuration,
    googleSafeBrowsing, virusTotal,
    heuristics, sslInfo, warnings, aiAnalysis, scannedAt, scanId
  } = result;

  const statusClass = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  const statusLabel = getStatusLabel(status);

  const tabs = ['overview', 'apis', 'heuristics', 'ai-analysis'];

  return (
    <div className={`result-card ${statusClass}`} role="region" aria-label="Scan Result">
      {/* Header */}
      <div className="result-header">
        <div className="result-status-badge">
          <span className="status-icon-large">{statusIcon}</span>
          <div>
            <div className={`status-label ${statusClass}`}>{statusLabel}</div>
            <div className="result-domain">{domain}</div>
          </div>
        </div>
        <div className="result-meta">
          <span className="scan-time">⏱ {scanDuration}ms</span>
          <span className="scan-date">{formatDate(scannedAt)}</span>
          {scanId && (
            <Link to={`/scan/${scanId}`} className="detail-link">View Details →</Link>
          )}
        </div>
      </div>

      {/* URL Display */}
      <div className="result-url">
        <span className="url-label">Scanned URL:</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="url-value" title={url}>
          {truncateUrl(url, 80)}
        </a>
      </div>

      {/* Risk Gauge */}
      <div className="risk-section">
        <RiskGauge score={riskScore} />
        <div className="risk-info">
          <div className="risk-score-display" style={{ color: getRiskColor(riskScore) }}>
            {riskScore}<span className="risk-max">/100</span>
          </div>
          <div className="risk-label">Risk Score</div>
          <div className="confidence-badge">
            Confidence: <strong>{aiAnalysis?.confidence || 'N/A'}</strong>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="warnings-section">
          <h3 className="section-title">⚠️ Warnings ({warnings.length})</h3>
          <div className="warnings-list">
            {warnings.map((w, i) => (
              <div key={i} className={`warning-item severity-${w.severity}`}>
                <span
                  className="severity-dot"
                  style={{ background: getSeverityColor(w.severity) }}
                ></span>
                <div>
                  <span className="warning-type">{w.type.replace(/_/g, ' ')}</span>
                  <p className="warning-message">{w.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="result-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'apis' && '🔌 API Checks'}
            {tab === 'heuristics' && '🔍 Heuristics'}
            {tab === 'ai-analysis' && '🧠 AI Analysis'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <CheckItem label="HTTPS" value={heuristics?.hasHttps} />
            <CheckItem label="SSL Certificate" value={sslInfo?.hasSSL} />
            <CheckItem label="Safe Domain" value={status === 'safe'} />
            <CheckItem label="Not Shortened" value={!heuristics?.isShortened} />
            <CheckItem label="Not IP-Based" value={!heuristics?.isIpBased} />
            <CheckItem label="Clean Keywords" value={!heuristics?.hasSuspiciousKeywords} />
            <CheckItem label="No Subdomain Abuse" value={!heuristics?.hasSubdomainAbuse} />
            <CheckItem label="Normal TLD" value={!heuristics?.hasSuspiciousTLD} />
          </div>
        )}

        {/* API Checks Tab */}
        {activeTab === 'apis' && (
          <div className="api-checks">
            <ApiCheck
              name="Google Safe Browsing"
              icon="🔵"
              checked={googleSafeBrowsing?.checked}
              safe={googleSafeBrowsing?.isSafe}
              detail={googleSafeBrowsing?.threats?.length > 0
                ? `Threats: ${googleSafeBrowsing.threats.join(', ')}`
                : googleSafeBrowsing?.error || 'No threats detected'}
            />
            <ApiCheck
              name="VirusTotal"
              icon="🟢"
              checked={virusTotal?.checked}
              safe={virusTotal?.positives === 0}
              detail={virusTotal?.checked
                ? `${virusTotal.positives}/${virusTotal.total} engines flagged`
                : virusTotal?.error || 'Not checked'}
            />
            <div className="api-note">
              <p><strong>Note:</strong> PhishTank and WHOIS APIs removed for simplicity. The current setup provides comprehensive threat detection using Google Safe Browsing + VirusTotal + AI Heuristics.</p>
            </div>
          </div>
        )}

        {/* Heuristics Tab */}
        {activeTab === 'heuristics' && (
          <div className="heuristics-grid">
            <HeuristicItem label="Protocol" value={heuristics?.hasHttps ? 'HTTPS ✅' : 'HTTP ⚠️'} />
            <HeuristicItem label="URL Shortened" value={heuristics?.isShortened ? 'Yes ⚠️' : 'No ✅'} />
            <HeuristicItem label="IP-Based URL" value={heuristics?.isIpBased ? 'Yes ❌' : 'No ✅'} />
            <HeuristicItem label="Subdomain Abuse" value={heuristics?.hasSubdomainAbuse ? 'Detected ❌' : 'None ✅'} />
            <HeuristicItem label="Suspicious TLD" value={heuristics?.hasSuspiciousTLD ? `Yes (${heuristics.tld}) ⚠️` : 'No ✅'} />
            <HeuristicItem label="Special Chars" value={heuristics?.hasSpecialChars ? 'Found ⚠️' : 'None ✅'} />
            <HeuristicItem label="Domain Length" value={`${heuristics?.domainLength || 0} chars`} />
            <HeuristicItem label="URL Length" value={`${heuristics?.urlLength || 0} chars`} />
            <HeuristicItem label="Path Depth" value={`${heuristics?.pathDepth || 0} levels`} />
            <HeuristicItem label="TLD" value={heuristics?.tld || 'N/A'} />
            {heuristics?.suspiciousKeywordsFound?.length > 0 && (
              <div className="keywords-found">
                <span className="heuristic-label">Suspicious Keywords:</span>
                <div className="keyword-tags">
                  {heuristics.suspiciousKeywordsFound.map((kw) => (
                    <span key={kw} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Analysis Tab */}
        {activeTab === 'ai-analysis' && (
          <div className="ai-analysis">
            <div className="phishing-probability">
              <div className="prob-label">Phishing Probability</div>
              <div className="prob-bar-wrapper">
                <div
                  className="prob-bar"
                  style={{
                    width: `${aiAnalysis?.phishingProbability || 0}%`,
                    background: getRiskColor(aiAnalysis?.phishingProbability || 0)
                  }}
                ></div>
              </div>
              <div className="prob-value" style={{ color: getRiskColor(aiAnalysis?.phishingProbability || 0) }}>
                {aiAnalysis?.phishingProbability || 0}%
              </div>
            </div>

            <div className="ai-explanation">
              <h4>Analysis Findings:</h4>
              {aiAnalysis?.explanation?.length > 0 ? (
                <ul className="explanation-list">
                  {aiAnalysis.explanation.map((item, i) => (
                    <li key={i} className="explanation-item">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-findings">No significant threats detected.</p>
              )}
            </div>

            <div className="confidence-info">
              <span className={`confidence-badge-large confidence-${aiAnalysis?.confidence}`}>
                Analysis Confidence: {aiAnalysis?.confidence?.toUpperCase() || 'N/A'}
              </span>
              <p className="confidence-note">
                {aiAnalysis?.confidence === 'high'
                  ? 'Multiple API sources confirmed this result.'
                  : aiAnalysis?.confidence === 'medium'
                  ? 'One API source used. Heuristics applied.'
                  : 'Based on heuristic analysis only. API keys may not be configured.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Community Votes */}
      {scanId && <CommunityVotes scanId={scanId} />}
    </div>
  );
}

// Sub-components
function CheckItem({ label, value }) {
  return (
    <div className={`check-item ${value ? 'pass' : 'fail'}`}>
      <span className="check-icon">{value ? '✅' : '❌'}</span>
      <span className="check-label">{label}</span>
    </div>
  );
}

function ApiCheck({ name, icon, checked, safe, detail }) {
  return (
    <div className={`api-check-item ${!checked ? 'unchecked' : safe ? 'safe' : 'unsafe'}`}>
      <div className="api-check-header">
        <span className="api-icon">{icon}</span>
        <span className="api-name">{name}</span>
        <span className={`api-status ${!checked ? 'status-skip' : safe ? 'status-safe' : 'status-danger'}`}>
          {!checked ? 'Skipped' : safe ? 'Clean' : 'Flagged'}
        </span>
      </div>
      <p className="api-detail">{detail}</p>
    </div>
  );
}

function HeuristicItem({ label, value }) {
  return (
    <div className="heuristic-item">
      <span className="heuristic-label">{label}</span>
      <span className="heuristic-value">{value}</span>
    </div>
  );
}
