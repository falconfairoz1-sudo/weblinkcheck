import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import ResultCard from '../components/ResultCard';
import BulkScanner from '../components/BulkScanner';
import { useScan } from '../context/ScanContext';
import '../styles/home.css';

export default function Home() {
  const { currentScan, scanning, error, clearScan } = useScan();
  const [showBulk, setShowBulk] = useState(false);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          AI-Powered Security Scanner
        </div>
        <h1 className="hero-title">
          Is This Link <span className="gradient-text">Safe?</span>
        </h1>
        <p className="hero-subtitle">
          Instantly detect phishing attacks, malware links, and fake websites
          using Google Safe Browsing, VirusTotal, and AI-powered heuristic analysis.
        </p>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">🛡️</span>
            <span className="stat-text">2 Security APIs</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">🧠</span>
            <span className="stat-text">AI Heuristics</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">Real-time Analysis</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <span className="stat-text">Risk Scoring</span>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="scanner-section">
        <div className="scanner-card">
          <InputBox onResult={() => {}} />

          {/* Toggle Bulk Scanner */}
          <div className="bulk-toggle">
            <button
              className="bulk-toggle-btn"
              onClick={() => setShowBulk(!showBulk)}
            >
              {showBulk ? '▲ Hide Bulk Scanner' : '▼ Bulk Scan (up to 10 URLs)'}
            </button>
          </div>

          {showBulk && <BulkScanner />}
        </div>
      </section>

      {/* Scanning Animation */}
      {scanning && (
        <section className="scanning-section">
          <div className="scanning-animation">
            <div className="scan-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
              <span className="scan-center-icon">🔍</span>
            </div>
            <div className="scanning-steps">
              <ScanStep icon="🔵" label="Google Safe Browsing" delay={0} />
              <ScanStep icon="🟢" label="VirusTotal" delay={0.3} />
              <ScanStep icon="🧠" label="AI Heuristics" delay={0.6} />
            </div>
          </div>
        </section>
      )}

      {/* Error Display */}
      {error && !scanning && (
        <section className="error-section">
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Scan Error</strong>
              <p>{error}</p>
            </div>
            <button className="error-dismiss" onClick={clearScan}>✕</button>
          </div>
        </section>
      )}

      {/* Result */}
      {currentScan && !scanning && (
        <section className="result-section">
          <ResultCard result={currentScan} />
        </section>
      )}

      {/* How It Works */}
      {!currentScan && !scanning && (
        <section className="how-it-works">
          <h2 className="section-heading">How It Works</h2>
          <div className="steps-grid">
            <StepCard
              step="1"
              icon="🔗"
              title="Paste URL"
              desc="Enter any suspicious link you want to verify"
            />
            <StepCard
              step="2"
              icon="🔍"
              title="Dual-Layer Scan"
              desc="We check against Google Safe Browsing, VirusTotal & AI heuristics"
            />
            <StepCard
              step="3"
              icon="📊"
              title="Risk Score"
              desc="Get a 0-100 risk score with detailed threat breakdown"
            />
            <StepCard
              step="4"
              icon="🛡️"
              title="Stay Safe"
              desc="Know exactly why a link is dangerous before clicking"
            />
          </div>
        </section>
      )}

      {/* Threat Types */}
      {!currentScan && !scanning && (
        <section className="threat-types">
          <h2 className="section-heading">What We Detect</h2>
          <div className="threat-grid">
            <ThreatCard icon="🎣" title="Phishing" desc="Fake login pages stealing credentials" color="#ef4444" />
            <ThreatCard icon="🦠" title="Malware" desc="Links that download malicious software" color="#f97316" />
            <ThreatCard icon="🔗" title="Shortened URLs" desc="Hidden destinations behind short links" color="#f59e0b" />
            <ThreatCard icon="🌐" title="Fake Domains" desc="Impersonating trusted brands" color="#8b5cf6" />
            <ThreatCard icon="🔓" title="No HTTPS" desc="Unencrypted connections" color="#06b6d4" />
            <ThreatCard icon="🆕" title="New Domains" desc="Recently registered suspicious sites" color="#10b981" />
          </div>
        </section>
      )}
    </div>
  );
}

function ScanStep({ icon, label, delay }) {
  return (
    <div className="scan-step" style={{ animationDelay: `${delay}s` }}>
      <span className="step-icon">{icon}</span>
      <span className="step-label">{label}</span>
      <span className="step-spinner"></span>
    </div>
  );
}

function StepCard({ step, icon, title, desc }) {
  return (
    <div className="step-card">
      <div className="step-number">{step}</div>
      <div className="step-icon-large">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function ThreatCard({ icon, title, desc, color }) {
  return (
    <div className="threat-card" style={{ '--threat-color': color }}>
      <span className="threat-icon">{icon}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}
