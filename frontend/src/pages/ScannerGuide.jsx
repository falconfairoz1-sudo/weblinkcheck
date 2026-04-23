import React, { useState } from 'react';
import ScannerExplainer from '../components/ScannerExplainer';
import ReportGenerator from '../components/ReportGenerator';
import '../styles/scannerguide.css';

export default function ScannerGuide() {
  const [selectedScanner, setSelectedScanner] = useState('url_scanner');
  const [urlInput, setUrlInput] = useState('');

  const scanners = [
    {
      id: 'url_scanner',
      name: '🔗 URL Scanner',
      icon: '🔗',
      description: 'Analyzes links for security threats'
    },
    {
      id: 'qr_scanner',
      name: '📷 QR Code Scanner',
      icon: '📷',
      description: 'Scans QR codes for hidden threats'
    },
    {
      id: 'monitor',
      name: '👁️ Monitor',
      icon: '👁️',
      description: 'Monitors URLs for threat changes'
    }
  ];

  return (
    <div className="scanner-guide-page">
      {/* Header */}
      <div className="page-header">
        <h1>🛡️ Scanner Guide</h1>
        <p>Learn about each scanner and how they protect you</p>
      </div>

      {/* Scanner Selection */}
      <section className="scanner-selection">
        <div className="container">
          <h2>Choose a Scanner</h2>
          <div className="scanner-buttons">
            {scanners.map((scanner) => (
              <button
                key={scanner.id}
                className={`scanner-btn ${selectedScanner === scanner.id ? 'active' : ''}`}
                onClick={() => setSelectedScanner(scanner.id)}
              >
                <span className="scanner-btn-icon">{scanner.icon}</span>
                <span className="scanner-btn-name">{scanner.name}</span>
                <span className="scanner-btn-desc">{scanner.description}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* URL Input */}
      <section className="url-input-section">
        <div className="container">
          <div className="input-wrapper">
            <label htmlFor="url-input">Enter a URL to get AI explanation:</label>
            <div className="input-group">
              <input
                id="url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="url-input"
              />
              <button className="btn-clear-input" onClick={() => setUrlInput('')}>
                ✕
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scanner Explainer */}
      <section className="explainer-section">
        <div className="container">
          <ScannerExplainer url={urlInput} scannerType={selectedScanner} />
        </div>
      </section>

      {/* Report Generator */}
      <section className="report-section">
        <div className="container">
          <div className="report-wrapper">
            <h2>📄 Generate Report</h2>
            <p>Download a comprehensive PDF report for this scanner</p>
            <ReportGenerator scannerType={selectedScanner} />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-section">
        <div className="container">
          <h2>Scanner & Tools Comparison</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>URL Scanner</th>
                  <th>QR Scanner</th>
                  <th>Monitor</th>
                  <th>URL Expander</th>
                  <th>IP Lookup</th>
                  <th>Domain Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Real-time Scanning</td>
                  <td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td>
                </tr>
                <tr>
                  <td>Malware Detection</td>
                  <td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td>
                </tr>
                <tr>
                  <td>Phishing Detection</td>
                  <td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td>
                </tr>
                <tr>
                  <td>Continuous Monitoring</td>
                  <td>❌</td><td>❌</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td>
                </tr>
                <tr>
                  <td>Redirect Tracing</td>
                  <td>❌</td><td>❌</td><td>❌</td><td>✅</td><td>❌</td><td>❌</td>
                </tr>
                <tr>
                  <td>Geolocation Info</td>
                  <td>❌</td><td>❌</td><td>❌</td><td>❌</td><td>✅</td><td>✅</td>
                </tr>
                <tr>
                  <td>DNS Records</td>
                  <td>❌</td><td>❌</td><td>❌</td><td>❌</td><td>❌</td><td>✅</td>
                </tr>
                <tr>
                  <td>Risk Scoring</td>
                  <td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td>
                </tr>
                <tr>
                  <td>Login Required</td>
                  <td>❌</td><td>❌</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security Tools */}
      <section className="tools-section" id="tools">
        <div className="container">
          <h2>🛠️ Security Tools</h2>
          <p className="tools-intro">14 powerful tools to enhance your security analysis — no account needed for most</p>

          {/* Category 1 */}
          <div className="tools-category-label">
            <span>🔗</span> URL &amp; Domain Tools
          </div>
          <div className="tools-grid">

            <ToolCard
              icon="🔗" title="URL Expander" path="/tools/url-expander"
              desc="Reveal the true destination hidden behind shortened or redirected links before you click."
              features={['Follows all HTTP redirects automatically','Detects bit.ly, t.co, tinyurl and 10+ shorteners','Shows HTTP status code of final destination','One-click scan of the expanded URL for threats']}
              howto={['Paste any shortened or suspicious URL','Click Expand URL','See the real destination revealed','Click Scan Final URL to check for threats']}
              useCase="Received a bit.ly link in an email or chat? Expand it first to see where it actually leads before clicking."
              loginRequired={false}
            />

            <ToolCard
              icon="⚖️" title="URL Comparison" path="/tools/compare"
              desc="Compare two URLs side-by-side with a full risk analysis to instantly see which is safer."
              features={['Parallel heuristic analysis of both URLs','Risk score comparison with winner verdict','Checks HTTPS, shortened, IP-based, suspicious TLD','Detailed metric table for each URL']}
              howto={['Enter URL 1 in the left field','Enter URL 2 in the right field','Click Compare URLs','Review the winner badge and metric table']}
              useCase="Received two similar-looking links and unsure which is legitimate? Compare them to spot the fake."
              loginRequired={false}
            />

            <ToolCard
              icon="🌍" title="IP & Domain Lookup" path="/tools/ip-lookup"
              desc="Get geolocation, ISP, organization, and network details for any IP address or domain name."
              features={['Resolves domain names to IP addresses','Country, city, region, and ZIP code','ISP, organization, and AS number','Timezone, coordinates, and map link']}
              howto={['Enter an IP address (e.g. 8.8.8.8) or domain (e.g. google.com)','Click Lookup','View location, ISP, and network info','Click View on Map for geographic context']}
              useCase="Want to know where a suspicious server is hosted or which company owns an IP address?"
              loginRequired={false}
            />

            <ToolCard
              icon="🌐" title="Domain Info" path="/tools/domain-info"
              desc="Perform live DNS lookups to inspect all DNS records and security indicators for any domain."
              features={['A records — IP address of the domain','MX records — mail servers handling email','NS records — authoritative name servers','TXT records — SPF, DKIM, verification tokens','TLD safety check for suspicious extensions']}
              howto={['Enter a domain name (without http://)','Click Lookup Domain','Review all DNS record sections','Check TLD badge for suspicious extension warning']}
              useCase="Investigating a domain for legitimacy? DNS records reveal who hosts it, where email goes, and whether it has proper security records."
              loginRequired={false}
            />

            <ToolCard
              icon="🔒" title="SSL Certificate Checker" path="/tools/ssl-checker"
              desc="Inspect the full SSL/TLS certificate of any domain — issuer, expiry, cipher, and security grade."
              features={['Certificate validity and expiry date','Days remaining before expiration','Issuer and certificate authority (CA)','Cipher suite and TLS protocol version','Subject Alternative Names (SANs)','Security grade: A (secure) to F (expired/invalid)']}
              howto={['Enter a domain name','Click Check SSL','Review the grade (A = secure, F = problem)','Check days remaining — under 14 days needs renewal','Review issuer to confirm it is a trusted CA']}
              useCase="Before trusting a website with sensitive data, verify its SSL certificate is valid, not expired, and issued by a trusted authority."
              loginRequired={false}
            />

            <ToolCard
              icon="🔎" title="Subdomain Finder" path="/tools/subdomains"
              desc="Discover active subdomains of any domain by checking 30+ common subdomain names via DNS."
              features={['Checks 30 common subdomains (www, mail, api, admin, dev, staging...)','DNS resolution to confirm each is active','Shows IP address of each found subdomain','Direct visit link for each result']}
              howto={['Enter a root domain (e.g. example.com)','Click Find Subdomains','Wait for DNS checks to complete','Review active subdomains and their IPs']}
              useCase="Security researchers and admins use subdomain enumeration to map an organization\'s attack surface and find forgotten or exposed services."
              loginRequired={false}
            />

            <ToolCard
              icon="📡" title="Ping Tool" path="/tools/ping"
              desc="Check if any domain or IP address is reachable and measure HTTP/HTTPS response latency."
              features={['Tests both HTTP and HTTPS protocols','Measures response latency in milliseconds','DNS resolution time measurement','Shows HTTP status code returned','Color-coded latency (green < 200ms, red > 500ms)']}
              howto={['Enter a domain or IP address','Click Ping Host','See reachability status and latency','Review per-protocol results (HTTP vs HTTPS)']}
              useCase="Checking if a website is down, measuring server response time, or verifying a domain resolves correctly."
              loginRequired={false}
            />

            <ToolCard
              icon="🏭" title="Bulk Domain Reputation" path="/tools/bulk-reputation"
              desc="Check up to 20 domains at once for suspicious indicators, TLD safety, and reachability."
              features={['Process up to 20 domains simultaneously','Risk score for each domain','Suspicious TLD detection','Reachability and IP resolution check','Clean / Caution / Suspicious status per domain']}
              howto={['Enter up to 20 domains, one per line','Click Check Domains','Review the results table','Red rows = suspicious, yellow = caution, green = clean']}
              useCase="Security teams vetting a list of domains from a threat report, or checking multiple vendor domains before allowing them through a firewall."
              loginRequired={false}
            />

          </div>

          {/* Category 2 */}
          <div className="tools-category-label" style={{ marginTop: '2.5rem' }}>
            <span>🔐</span> Security &amp; Privacy Tools
          </div>
          <div className="tools-grid">

            <ToolCard
              icon="📡" title="Live Threat Feed" path="/tools/threat-feed"
              desc="Real-time feed of the most recently detected malicious and suspicious URLs across all scans."
              features={['Live feed of malicious and suspicious URLs','Auto-refresh every 15 seconds','Top warning reason for each threat','Risk score and detection timestamp','Recent public scans feed alongside threats']}
              howto={['Open the Threat Feed page','Enable Auto-Refresh for live updates','Review the threats detected column','Click Scan It Now to check a URL yourself']}
              useCase="Stay aware of active threats being detected in real time. Useful for security teams monitoring the current threat landscape."
              loginRequired={false}
            />

            <ToolCard
              icon="🔑" title="Password Strength Checker" path="/tools/password-checker"
              desc="Test how strong a password is with an 8-point security analysis. Nothing is stored."
              features={['8 security checks: length, uppercase, lowercase, numbers, symbols, common words, repeating chars, 16+ chars','Strength rating: Very Weak to Very Strong','Percentage score and color indicator','Specific improvement suggestions','Best practices guide included']}
              howto={['Type or paste a password to test','Click Check Strength','Review which checks pass (✅) and fail (❌)','Follow the suggestions to improve it']}
              useCase="Before setting a new password, verify it meets strong security standards. The password is analyzed locally and never stored."
              loginRequired={false}
            />

            <ToolCard
              icon="🔓" title="Leaked Password Check" path="/tools/leaked-password"
              desc="Check if a password has appeared in known data breaches using k-anonymity — your password never leaves your device in full."
              features={['Uses Have I Been Pwned breach database','k-anonymity: only first 5 chars of SHA-1 hash sent','Shows exact breach count if found','Severity rating: None / Low / Medium / High / Critical','Your actual password is never transmitted']}
              howto={['Enter the password to check','Click Check for Breaches','If found: change it immediately on all sites','If not found: still consider using a password manager']}
              useCase="Checking if a password you use (or plan to use) has been exposed in any known data breach. Safe to use — the full password is never sent."
              loginRequired={false}
            />

            <ToolCard
              icon="📧" title="Email Header Analyzer" path="/tools/email-headers"
              desc="Paste raw email headers to detect spoofing, phishing, authentication failures, and suspicious routing."
              features={['SPF, DKIM, and DMARC authentication check','Reply-To vs From domain mismatch detection','Return-Path spoofing detection','Full mail server hop chain analysis','Risk score with severity-rated warnings','Load sample headers to try it instantly']}
              howto={['Open a suspicious email in your email client','Find "View Source" or "Show Original" option','Copy all the raw headers','Paste them into the analyzer and click Analyze']}
              useCase="Received a suspicious email claiming to be from your bank or a known company? Analyze the headers to detect spoofing and authentication failures."
              loginRequired={false}
            />

            <ToolCard
              icon="🎯" title="Phishing Awareness Quiz" path="/tools/phishing-quiz"
              desc="Test your ability to spot phishing attacks with an interactive 5-question quiz. Get graded and learn from explanations."
              features={['5 randomized questions from a pool of 8','Topics: URL spoofing, urgency tactics, QR codes, passwords, shortened URLs','Instant grading with A–F score','Detailed explanation for every answer','Retry with new random questions']}
              howto={['Click Start Quiz','Answer each question by selecting an option','Navigate with Previous / Next buttons','Submit when all questions are answered','Review your score and read the explanations']}
              useCase="Train yourself or your team to recognize phishing attempts. Regular practice significantly reduces the chance of falling for social engineering attacks."
              loginRequired={false}
            />

            <ToolCard
              icon="🔖" title="Bookmarks" path="/tools/bookmarks"
              desc="Save URLs to a personal watchlist for quick access, scanning, and monitoring."
              features={['Save any URL with a custom label','One-click scan directly from the bookmark','One-click visit in a new tab','Manage and delete bookmarks anytime','Synced to your account across devices']}
              howto={['Click + Add Bookmark','Paste the URL and add an optional label','Click Save','Use the Scan button to check it anytime','Use the Visit button to open it safely']}
              useCase="Keep a list of URLs you regularly scan — vendor sites, competitor domains, or URLs you are monitoring for changes."
              loginRequired={true}
            />

          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="best-practices">
        <div className="container">
          <h2>🛡️ Best Practices</h2>
          <div className="practices-grid">
            <div className="practice-card">
              <span className="practice-icon">1️⃣</span>
              <h3>Always Verify Before Clicking</h3>
              <p>Use the URL Scanner to check any suspicious links before clicking them</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">2️⃣</span>
              <h3>Scan QR Codes First</h3>
              <p>Use the QR Scanner to see where QR codes lead before scanning with your phone</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">3️⃣</span>
              <h3>Monitor Important Sites</h3>
              <p>Use Monitor to continuously track your business or frequently visited websites</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">4️⃣</span>
              <h3>Trust Your Instincts</h3>
              <p>If something feels off, use a scanner to verify. Better safe than sorry</p>
            </div>

            <div className="practice-card">
              <span className="practice-icon">5️⃣</span>
              <h3>Report Threats</h3>
              <p>Report malicious URLs and scams to help protect the community</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2>❓ Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How accurate are the scanners?</h3>
              <p>Our scanners use multiple security APIs (Google Safe Browsing, VirusTotal) combined with AI heuristics for high accuracy. Confidence levels are shown for each scan.</p>
            </div>

            <div className="faq-item">
              <h3>Is my data private?</h3>
              <p>Yes. We don't store your personal data. Scans are processed securely and deleted after analysis.</p>
            </div>

            <div className="faq-item">
              <h3>Can I use these scanners offline?</h3>
              <p>No, our scanners require internet connection to access security databases and APIs.</p>
            </div>

            <div className="faq-item">
              <h3>What if a scanner says a link is safe but I'm still unsure?</h3>
              <p>Trust your instincts. If something feels suspicious, avoid it. Our scanners are tools to help, not absolute guarantees.</p>
            </div>

            <div className="faq-item">
              <h3>How often are threat databases updated?</h3>
              <p>Our threat databases are updated in real-time through Google Safe Browsing and VirusTotal APIs.</p>
            </div>

            <div className="faq-item">
              <h3>Can I scan multiple URLs at once?</h3>
              <p>Yes! Use the Bulk Scanner feature in the URL Scanner to scan up to 10 URLs at once.</p>
            </div>

            <div className="faq-item">
              <h3>What does the URL Expander do?</h3>
              <p>It follows all redirects behind shortened links (bit.ly, t.co, etc.) and shows you the real final destination before you click. You can then scan that URL for threats.</p>
            </div>

            <div className="faq-item">
              <h3>Is the Password Checker safe to use?</h3>
              <p>Yes, completely. The password is sent to our server only to calculate its strength score — it is never stored, logged, or shared. The analysis happens instantly and is discarded.</p>
            </div>

            <div className="faq-item">
              <h3>What information does the Domain Info tool show?</h3>
              <p>It performs live DNS lookups to show A records (IP address), MX records (mail servers), NS records (name servers), TXT records, and flags suspicious TLDs.</p>
            </div>

            <div className="faq-item">
              <h3>Is the Leaked Password Check safe?</h3>
              <p>Yes. It uses k-anonymity — only the first 5 characters of your password's SHA-1 hash are sent to the API. Your actual password never leaves your device. This is the same method used by major browsers.</p>
            </div>

            <div className="faq-item">
              <h3>What does the SSL Checker grade mean?</h3>
              <p>Grade A = valid certificate with strong encryption and plenty of days remaining. Grade B = minor issues like expiring soon. Grade C = not trusted by browsers. Grade F = expired or no SSL at all.</p>
            </div>

            <div className="faq-item">
              <h3>How does the Email Header Analyzer detect spoofing?</h3>
              <p>It checks SPF (sender authorization), DKIM (email signature), and DMARC (policy enforcement). It also detects when the Reply-To or Return-Path domain differs from the From domain — a classic spoofing sign.</p>
            </div>

            <div className="faq-item">
              <h3>What does the Subdomain Finder check?</h3>
              <p>It tests 30 common subdomain names (www, mail, api, admin, dev, staging, etc.) via DNS resolution. Only subdomains that actually resolve to an IP are shown as active.</p>
            </div>

            <div className="faq-item">
              <h3>How many domains can I check with Bulk Reputation?</h3>
              <p>Up to 20 domains per request. Enter one domain per line. Results show risk score, IP address, TLD safety, and a Clean / Caution / Suspicious status for each.</p>
            </div>

            <div className="faq-item">
              <h3>Which tools require a login?</h3>
              <p>Only Bookmarks requires a login (to save your list). All other tools — URL Expander, IP Lookup, SSL Checker, Email Headers, Password Checker, Leaked Password, Subdomain Finder, Ping, Bulk Reputation, Phishing Quiz, URL Comparison, Domain Info, and Threat Feed — work without an account.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ToolCard Component ────────────────────────────────────────────────────────
function ToolCard({ icon, title, path, desc, features, howto, useCase, loginRequired }) {
  return (
    <div className="tool-card-detailed">
      <div className="tool-card-header">
        <span className="tool-card-icon">{icon}</span>
        <div className="tool-card-title-wrap">
          <h3 className="tool-card-title">{title}</h3>
          {loginRequired && <span className="tool-login-badge">🔐 Login required</span>}
        </div>
        <a href={path} className="tool-card-try">Try it →</a>
      </div>

      <p className="tool-card-desc">{desc}</p>

      <div className="tool-card-body">
        <div className="tool-card-section">
          <div className="tool-section-label">✨ Features</div>
          <ul className="tool-feature-list">
            {features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>

        <div className="tool-card-section">
          <div className="tool-section-label">📋 How to use</div>
          <ol className="tool-howto-list">
            {howto.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      </div>

      <div className="tool-use-case">
        <span>💡</span>
        <p><strong>When to use:</strong> {useCase}</p>
      </div>
    </div>
  );
}
