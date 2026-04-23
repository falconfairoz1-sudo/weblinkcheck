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
    padding: 30px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    color: #1a1a1a;
    line-height: 1.6;
  `;

  const scan = Array.isArray(data) ? data[0] : data;

  container.innerHTML = `
    <!-- Header with Gradient Background -->
    <div style="background: linear-gradient(135deg, #4F9EFF 0%, #2563EB 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; box-shadow: 0 4px 15px rgba(79, 158, 255, 0.3);">
      <div style="font-size: 48px; margin-bottom: 15px;">🛡️</div>
      <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">LinkGuard Security Report</h1>
      <p style="margin: 0; font-size: 14px; opacity: 0.95;">Comprehensive URL Security Analysis</p>
    </div>

    <!-- Scan Summary -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #2563EB; font-size: 18px; margin: 0 0 15px 0; font-weight: 700; border-bottom: 3px solid #4F9EFF; padding-bottom: 10px;">📋 Scan Summary</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background: #f0f7ff;">
          <td style="padding: 14px; border: 1px solid #d0e4ff; font-weight: 700; width: 35%; color: #2563EB;">URL Scanned</td>
          <td style="padding: 14px; border: 1px solid #d0e4ff; word-break: break-all; font-size: 12px;">${scan.url || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 14px; border: 1px solid #d0e4ff; font-weight: 700; color: #2563EB;">Domain</td>
          <td style="padding: 14px; border: 1px solid #d0e4ff;">${scan.domain || 'N/A'}</td>
        </tr>
        <tr style="background: #f0f7ff;">
          <td style="padding: 14px; border: 1px solid #d0e4ff; font-weight: 700; color: #2563EB;">Status</td>
          <td style="padding: 14px; border: 1px solid #d0e4ff;">
            <span style="padding: 6px 14px; border-radius: 6px; font-weight: 700; display: inline-block; ${
              scan.status === 'safe' 
                ? 'background: #10b981; color: white;' 
                : scan.status === 'suspicious'
                ? 'background: #f59e0b; color: white;'
                : 'background: #ef4444; color: white;'
            }">
              ${scan.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px; border: 1px solid #d0e4ff; font-weight: 700; color: #2563EB;">Risk Score</td>
          <td style="padding: 14px; border: 1px solid #d0e4ff;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 150px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                <div style="width: ${scan.riskScore || 0}%; height: 100%; background: ${
                  scan.riskScore < 30 ? '#10b981' : scan.riskScore < 60 ? '#f59e0b' : '#ef4444'
                };"></div>
              </div>
              <span style="font-size: 16px; font-weight: 800; color: ${
                scan.riskScore < 30 ? '#10b981' : scan.riskScore < 60 ? '#f59e0b' : '#ef4444'
              };">${scan.riskScore || 0}/100</span>
            </div>
          </td>
        </tr>
        <tr style="background: #f0f7ff;">
          <td style="padding: 14px; border: 1px solid #d0e4ff; font-weight: 700; color: #2563EB;">Scan Duration</td>
          <td style="padding: 14px; border: 1px solid #d0e4ff;">${scan.scanDuration || 'N/A'}ms</td>
        </tr>
        <tr>
          <td style="padding: 14px; border: 1px solid #d0e4ff; font-weight: 700; color: #2563EB;">Scanned At</td>
          <td style="padding: 14px; border: 1px solid #d0e4ff;">${new Date(scan.scannedAt).toLocaleString() || 'N/A'}</td>
        </tr>
      </table>
    </div>

    ${scan.warnings && scan.warnings.length > 0 ? `
      <!-- Warnings Section -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #d97706; font-size: 18px; margin: 0 0 15px 0; font-weight: 700; border-bottom: 3px solid #fbbf24; padding-bottom: 10px;">⚠️ Warnings (${scan.warnings.length})</h2>
        <div style="background: #fffbeb; border-left: 5px solid #f59e0b; padding: 20px; border-radius: 8px;">
          ${scan.warnings.map(w => `
            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #fcd34d;">
              <strong style="color: #92400e; font-size: 13px;">${w.type.replace(/_/g, ' ')}</strong>
              <p style="margin: 6px 0 0 0; color: #b45309; font-size: 12px;">${w.message}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${scan.heuristics ? `
      <!-- Heuristics Analysis -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #2563EB; font-size: 18px; margin: 0 0 15px 0; font-weight: 700; border-bottom: 3px solid #4F9EFF; padding-bottom: 10px;">🔍 Heuristics Analysis</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background: #f0f7ff;">
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 700; width: 50%; color: #2563EB;">Check</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 700; color: #2563EB;">Result</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #d0e4ff;">HTTPS Protocol</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 600;">${scan.heuristics.hasHttps ? '✅ Yes' : '❌ No'}</td>
          </tr>
          <tr style="background: #f0f7ff;">
            <td style="padding: 12px; border: 1px solid #d0e4ff;">URL Shortened</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 600;">${scan.heuristics.isShortened ? '⚠️ Yes' : '✅ No'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #d0e4ff;">IP-Based URL</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 600;">${scan.heuristics.isIpBased ? '❌ Yes' : '✅ No'}</td>
          </tr>
          <tr style="background: #f0f7ff;">
            <td style="padding: 12px; border: 1px solid #d0e4ff;">Subdomain Abuse</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 600;">${scan.heuristics.hasSubdomainAbuse ? '❌ Detected' : '✅ None'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #d0e4ff;">Suspicious TLD</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff; font-weight: 600;">${scan.heuristics.hasSuspiciousTLD ? '⚠️ Yes' : '✅ No'}</td>
          </tr>
          <tr style="background: #f0f7ff;">
            <td style="padding: 12px; border: 1px solid #d0e4ff;">Domain Length</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff;">${scan.heuristics.domainLength || 0} characters</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #d0e4ff;">URL Length</td>
            <td style="padding: 12px; border: 1px solid #d0e4ff;">${scan.heuristics.urlLength || 0} characters</td>
          </tr>
        </table>
      </div>
    ` : ''}

    ${scan.googleSafeBrowsing || scan.virusTotal ? `
      <!-- API Checks -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #2563EB; font-size: 18px; margin: 0 0 15px 0; font-weight: 700; border-bottom: 3px solid #4F9EFF; padding-bottom: 10px;">🔌 API Security Checks</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          ${scan.googleSafeBrowsing ? `
            <div style="padding: 15px; background: ${scan.googleSafeBrowsing.isSafe ? '#ecfdf5' : '#fef2f2'}; border-left: 5px solid ${scan.googleSafeBrowsing.isSafe ? '#10b981' : '#ef4444'}; border-radius: 8px;">
              <strong style="color: ${scan.googleSafeBrowsing.isSafe ? '#065f46' : '#7f1d1d'}; font-size: 13px;">Google Safe Browsing</strong>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: ${scan.googleSafeBrowsing.isSafe ? '#047857' : '#991b1b'};">
                ${scan.googleSafeBrowsing.isSafe ? '✅ No threats detected' : `❌ Threats: ${scan.googleSafeBrowsing.threats?.join(', ') || 'Unknown'}`}
              </p>
            </div>
          ` : ''}
          ${scan.virusTotal ? `
            <div style="padding: 15px; background: ${scan.virusTotal.positives === 0 ? '#ecfdf5' : '#fef2f2'}; border-left: 5px solid ${scan.virusTotal.positives === 0 ? '#10b981' : '#ef4444'}; border-radius: 8px;">
              <strong style="color: ${scan.virusTotal.positives === 0 ? '#065f46' : '#7f1d1d'}; font-size: 13px;">VirusTotal</strong>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: ${scan.virusTotal.positives === 0 ? '#047857' : '#991b1b'};">
                ${scan.virusTotal.positives}/${scan.virusTotal.total} engines flagged
              </p>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    ${scan.aiAnalysis ? `
      <!-- AI Analysis -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #2563EB; font-size: 18px; margin: 0 0 15px 0; font-weight: 700; border-bottom: 3px solid #4F9EFF; padding-bottom: 10px;">🧠 AI Analysis</h2>
        <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin-top: 15px;">
          <p style="margin: 0 0 12px 0; font-weight: 700; font-size: 13px; color: #2563EB;">Phishing Probability</p>
          <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin-bottom: 10px;">
            <div style="width: ${scan.aiAnalysis.phishingProbability || 0}%; height: 100%; background: linear-gradient(90deg, ${
              scan.aiAnalysis.phishingProbability < 30 ? '#10b981' : 
              scan.aiAnalysis.phishingProbability < 60 ? '#f59e0b' : '#ef4444'
            }, ${
              scan.aiAnalysis.phishingProbability < 30 ? '#059669' : 
              scan.aiAnalysis.phishingProbability < 60 ? '#d97706' : '#dc2626'
            });"></div>
          </div>
          <p style="margin: 0; font-size: 14px; font-weight: 800; color: ${
            scan.aiAnalysis.phishingProbability < 30 ? '#10b981' : 
            scan.aiAnalysis.phishingProbability < 60 ? '#f59e0b' : '#ef4444'
          };">${scan.aiAnalysis.phishingProbability || 0}%</p>
        </div>
        ${scan.aiAnalysis.explanation && scan.aiAnalysis.explanation.length > 0 ? `
          <div style="margin-top: 15px;">
            <p style="margin: 0 0 10px 0; font-weight: 700; font-size: 13px; color: #2563EB;">Analysis Findings:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #4b5563;">
              ${scan.aiAnalysis.explanation.map(item => `<li style="margin-bottom: 6px;">${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <p style="margin: 15px 0 0 0; font-size: 12px; color: #6b7280;">
          <strong>Confidence:</strong> ${scan.aiAnalysis.confidence?.toUpperCase() || 'N/A'}
        </p>
      </div>
    ` : ''}

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #d0e4ff; text-align: center; font-size: 11px; color: #9ca3af;">
      <p style="margin: 0 0 5px 0; font-weight: 600;">🛡️ LinkGuard Security Scanner</p>
      <p style="margin: 0;">Generated on ${new Date().toLocaleString()}</p>
      <p style="margin: 8px 0 0 0; font-size: 10px; color: #d1d5db;">This report contains confidential security information. Please handle with care.</p>
    </div>
  `;

  return container;
};
