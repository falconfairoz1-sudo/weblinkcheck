/**
 * Generate beautiful PDF from scan data
 */
export const generatePDFReport = async (scanData, filename) => {
  try {
    // Load html2pdf library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    
    script.onload = () => {
      const element = createPDFContent(scanData);
      const opt = {
        margin: 10,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      
      window.html2pdf().set(opt).from(element).save();
      document.body.removeChild(element);
    };
    
    document.head.appendChild(script);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

/**
 * Create beautiful PDF content structure
 */
const createPDFContent = (data) => {
  const container = document.createElement('div');
  container.style.cssText = `
    width: 210mm;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    color: #333;
  `;

  const scan = Array.isArray(data) ? data[0] : data;

  container.innerHTML = `
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4F9EFF; padding-bottom: 20px;">
      <div style="font-size: 40px; margin-bottom: 10px;">🛡️</div>
      <h1 style="margin: 0; color: #4F9EFF; font-size: 28px; font-weight: 700;">LinkGuard Scan Report</h1>
      <p style="margin: 5px 0; color: #666; font-size: 12px;">Security Analysis Report</p>
    </div>

    <!-- Scan Summary -->
    <div style="margin-bottom: 25px;">
      <h2 style="color: #4F9EFF; font-size: 16px; margin-bottom: 15px; border-left: 4px solid #4F9EFF; padding-left: 10px; font-weight: 700;">Scan Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f5f5f5;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600; width: 30%;">URL Scanned</td>
          <td style="padding: 12px; border: 1px solid #ddd; word-break: break-all; font-size: 11px;">${scan.url || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600;">Domain</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${scan.domain || 'N/A'}</td>
        </tr>
        <tr style="background: #f5f5f5;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600;">Status</td>
          <td style="padding: 12px; border: 1px solid #ddd;">
            <span style="padding: 4px 12px; border-radius: 4px; font-weight: 600; ${
              scan.status === 'safe' 
                ? 'background: #4CAF50; color: white;' 
                : scan.status === 'suspicious'
                ? 'background: #FFC107; color: #333;'
                : 'background: #F44336; color: white;'
            }">
              ${scan.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600;">Risk Score</td>
          <td style="padding: 12px; border: 1px solid #ddd;">
            <span style="font-size: 18px; font-weight: 700; color: ${
              scan.riskScore < 30 ? '#4CAF50' : scan.riskScore < 60 ? '#FFC107' : '#F44336'
            };">${scan.riskScore || 0}/100</span>
          </td>
        </tr>
        <tr style="background: #f5f5f5;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600;">Scan Duration</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${scan.scanDuration || 'N/A'}ms</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600;">Scanned At</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${new Date(scan.scannedAt).toLocaleString() || 'N/A'}</td>
        </tr>
      </table>
    </div>

    ${scan.warnings && scan.warnings.length > 0 ? `
      <!-- Warnings Section -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #FFC107; font-size: 16px; margin-bottom: 15px; border-left: 4px solid #FFC107; padding-left: 10px; font-weight: 700;">⚠️ Warnings (${scan.warnings.length})</h2>
        <div style="background: #fff3cd; border-left: 4px solid #FFC107; padding: 15px; border-radius: 4px;">
          ${scan.warnings.map(w => `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ffc10766;">
              <strong style="color: #856404;">${w.type.replace(/_/g, ' ')}</strong>
              <p style="margin: 5px 0 0 0; color: #856404; font-size: 12px;">${w.message}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${scan.heuristics ? `
      <!-- Heuristics Analysis -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #4F9EFF; font-size: 16px; margin-bottom: 15px; border-left: 4px solid #4F9EFF; padding-left: 10px; font-weight: 700;">🔍 Heuristics Analysis</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: 600; width: 50%;">Check</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: 600;">Result</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">HTTPS Protocol</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.hasHttps ? '✅ Yes' : '❌ No'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;">URL Shortened</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.isShortened ? '⚠️ Yes' : '✅ No'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">IP-Based URL</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.isIpBased ? '❌ Yes' : '✅ No'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;">Subdomain Abuse</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.hasSubdomainAbuse ? '❌ Detected' : '✅ None'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">Suspicious TLD</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.hasSuspiciousTLD ? '⚠️ Yes' : '✅ No'}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;">Domain Length</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.domainLength || 0} characters</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">URL Length</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${scan.heuristics.urlLength || 0} characters</td>
          </tr>
        </table>
      </div>
    ` : ''}

    ${scan.googleSafeBrowsing || scan.virusTotal ? `
      <!-- API Checks -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #4F9EFF; font-size: 16px; margin-bottom: 15px; border-left: 4px solid #4F9EFF; padding-left: 10px; font-weight: 700;">🔌 API Security Checks</h2>
        ${scan.googleSafeBrowsing ? `
          <div style="margin-bottom: 12px; padding: 12px; background: ${scan.googleSafeBrowsing.isSafe ? '#e8f5e9' : '#ffebee'}; border-left: 4px solid ${scan.googleSafeBrowsing.isSafe ? '#4CAF50' : '#F44336'}; border-radius: 4px;">
            <strong style="color: ${scan.googleSafeBrowsing.isSafe ? '#2e7d32' : '#c62828'};">Google Safe Browsing</strong>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: ${scan.googleSafeBrowsing.isSafe ? '#2e7d32' : '#c62828'};">
              ${scan.googleSafeBrowsing.isSafe ? '✅ No threats detected' : `❌ Threats: ${scan.googleSafeBrowsing.threats?.join(', ') || 'Unknown'}`}
            </p>
          </div>
        ` : ''}
        ${scan.virusTotal ? `
          <div style="padding: 12px; background: ${scan.virusTotal.positives === 0 ? '#e8f5e9' : '#ffebee'}; border-left: 4px solid ${scan.virusTotal.positives === 0 ? '#4CAF50' : '#F44336'}; border-radius: 4px;">
            <strong style="color: ${scan.virusTotal.positives === 0 ? '#2e7d32' : '#c62828'};">VirusTotal</strong>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: ${scan.virusTotal.positives === 0 ? '#2e7d32' : '#c62828'};">
              ${scan.virusTotal.positives}/${scan.virusTotal.total} engines flagged
            </p>
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${scan.aiAnalysis ? `
      <!-- AI Analysis -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #4F9EFF; font-size: 16px; margin-bottom: 15px; border-left: 4px solid #4F9EFF; padding-left: 10px; font-weight: 700;">🧠 AI Analysis</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 12px;">
          <p style="margin: 0 0 10px 0; font-weight: 600;">Phishing Probability: <span style="color: ${
            scan.aiAnalysis.phishingProbability < 30 ? '#4CAF50' : 
            scan.aiAnalysis.phishingProbability < 60 ? '#FFC107' : '#F44336'
          }; font-size: 16px;">${scan.aiAnalysis.phishingProbability || 0}%</span></p>
          <div style="width: 100%; height: 8px; background: #ddd; border-radius: 4px; overflow: hidden;">
            <div style="width: ${scan.aiAnalysis.phishingProbability || 0}%; height: 100%; background: ${
              scan.aiAnalysis.phishingProbability < 30 ? '#4CAF50' : 
              scan.aiAnalysis.phishingProbability < 60 ? '#FFC107' : '#F44336'
            };"></div>
          </div>
        </div>
        ${scan.aiAnalysis.explanation && scan.aiAnalysis.explanation.length > 0 ? `
          <div>
            <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 12px;">Analysis Findings:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 11px;">
              ${scan.aiAnalysis.explanation.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <p style="margin: 10px 0 0 0; font-size: 11px; color: #666;">
          <strong>Confidence:</strong> ${scan.aiAnalysis.confidence?.toUpperCase() || 'N/A'}
        </p>
      </div>
    ` : ''}

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #4F9EFF; text-align: center; font-size: 10px; color: #999;">
      <p style="margin: 0;">Generated by LinkGuard Security Scanner</p>
      <p style="margin: 5px 0 0 0;">${new Date().toLocaleString()}</p>
    </div>
  `;

  return container;
};
