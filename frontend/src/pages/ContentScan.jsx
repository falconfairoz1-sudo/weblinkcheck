import React from 'react';
import ContentScanner from '../components/ContentScanner';
import '../styles/contentscan.css';

export default function ContentScan() {
  return (
    <div className="content-scan-page">
      <div className="page-header">
        <h1>🔍 AI Content Scanner</h1>
        <p>Detect scam messages, crypto fraud, and job scams in real-time</p>
      </div>

      <ContentScanner />

      {/* Info Section */}
      <section className="info-section">
        <div className="info-container">
          <h2>What We Detect</h2>
          <div className="detection-grid">
            <div className="detection-card">
              <span className="detection-icon">💰</span>
              <h3>Crypto Fraud</h3>
              <p>Detects cryptocurrency scams, fake investment schemes, and wallet theft attempts</p>
              <ul>
                <li>Guaranteed returns promises</li>
                <li>Private key requests</li>
                <li>Wallet verification scams</li>
                <li>Fake exchange offers</li>
              </ul>
            </div>

            <div className="detection-card">
              <span className="detection-icon">💼</span>
              <h3>Job Scams</h3>
              <p>Identifies fraudulent job offers and employment-related scams</p>
              <ul>
                <li>Unrealistic job offers</li>
                <li>Upfront payment requirements</li>
                <li>Starter kit purchases</li>
                <li>No experience needed claims</li>
              </ul>
            </div>

            <div className="detection-card">
              <span className="detection-icon">⚠️</span>
              <h3>General Scams</h3>
              <p>Detects common phishing and social engineering attempts</p>
              <ul>
                <li>Prize/reward claims</li>
                <li>Urgent action requests</li>
                <li>Personal data requests</li>
                <li>Fake verification links</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="info-container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Paste Content</h3>
              <p>Copy and paste the suspicious message or text</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI analyzes the content for scam indicators</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Results</h3>
              <p>Receive detailed analysis with risk score and recommendations</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Stay Safe</h3>
              <p>Follow recommendations to protect yourself</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="safety-tips-section">
        <div className="info-container">
          <h2>🛡️ Safety Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">🚫</span>
              <h3>Never Share Personal Info</h3>
              <p>Legitimate companies never ask for passwords, SSN, or credit card details via message</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">⏰</span>
              <h3>Beware of Urgency</h3>
              <p>Scammers create pressure with urgent deadlines. Take time to verify</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">💰</span>
              <h3>No Easy Money</h3>
              <p>If it sounds too good to be true, it probably is. Real opportunities require effort</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">🔗</span>
              <h3>Verify Links</h3>
              <p>Hover over links to see the actual URL. Don't click suspicious links</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">📞</span>
              <h3>Contact Directly</h3>
              <p>If unsure, contact the company directly using official contact information</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">📢</span>
              <h3>Report Scams</h3>
              <p>Report suspicious messages to the platform and relevant authorities</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
