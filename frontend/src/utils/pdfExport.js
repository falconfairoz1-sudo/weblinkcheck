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
    padding: 25px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    color: #1a1a1a;
    line-height: 1.6;
  `;

  const scan = Array.isArray(data) ? data[0] : data;

  container.innerHTML = `
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4F9EFF 0%, #2563EB 100%); color: white; padding: 35px; border-radius: 15px; margin-bottom: 35px; text-align: center; box-shadow: 0 8px 25px rgba(79, 158, 255, 0.3);">
      <div style="font-size: 50px; margin-bottom: 15px;">🛡️</div>
      <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">LinkGuard Security Report</h1>
      <p style="margin: 0; font-size: 14px; opacity: 0.95;">Comprehensive URL Security Analysis</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.85;">Generated on ${new Date().toLocaleString()}</p>
    </div>

    <!-- Main Content -->
    <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
      
      <!-- URL Section -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #2563EB; font-size: 14px; margin: 0 0 12px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Scanned URL</h2>
        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4F9EFF; word-break: break-all; font-size: 12px; color: #4b5563;">
          ${scan.url || 'N/A'}
        </div>
      </div>

      <!-- Status & Risk Score -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <!-- Status -->
        <div>
          <h3 style="color: #2563EB; font-size: 12px; margin: 0 0 10px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Status</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
            <span style="padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block; ${
              scan.status === 'safe' 
                ? 'background: #10b981; color: white;' 
                : scan.status === 'suspicious'
                ? 'background: #f59e0b; color: white;'
                : 'background: #ef4444; color: white;'
            }">
              ${scan.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>

        <!-- Risk Score -->
        <div>
          <h3 style="color: #2563EB; font-size: 12px; margin: 0 0 10px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Risk Score</h3>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="flex: 1;">
                <div style="width: 100%; height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden;">
                  <div style="width: ${scan.riskScore || 0}%; height: 100%; background: linear-gradient(90deg, ${
                    scan.riskScore < 30 ? '#10b981' : scan.riskScore < 60 ? '#f59e0b' : '#ef4444'
                  }, ${
                    scan.riskScore < 30 ? '#059669' : scan.riskScore < 60 ? '#d97706' : '#dc2626'
                  });"></div>
                </div>
              </div>
              <span style="font-size: 16px; font-weight: 800; color: ${
                scan.riskScore < 30 ? '#10b981' : scan.riskScore < 60 ? '#f59e0b' : '#ef4444'
              }; min-width: 45px; text-align: right;">${scan.riskScore || 0}/100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Domain & Duration -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div>
          <h3 style="color: #2563EB; font-size: 12px; margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Domain</h3>
          <div style="background: white; padding: 12px; border-radius: 8px; font-size: 12px; color: #4b5563;">${scan.domain || 'N/A'}</div>
        </div>
        <div>
          <h3 style="color: #2563EB; font-size: 12px; margin: 0 0 8px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Scan Duration</h3>
          <div style="background: white; padding: 12px; border-radius: 8px; font-size: 12px; color: #4b5563;">${scan.scanDuration || 'N/A'}ms</div>
        </div>
      </div>
    </div>

    ${scan.warnings && scan.warnings.length > 0 ? `
      <!-- Warnings -->
      <div style="background: #fffbeb; border-left: 5px solid #f59e0b; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #d97706; font-size: 14px; margin: 0 0 15px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">⚠️ Warnings Detected (${scan.warnings.length})</h2>
        <div style="display: grid; gap: 10px;">
          ${scan.warnings.map(w => `
            <div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #f59e0b;">
              <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 12px; color: #92400e;">${w.type.replace(/_/g, ' ')}</p>
              <p style="margin: 0; font-size: 11px; color: #b45309;">${w.message}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${scan.heuristics ? `
      <!-- Heuristics -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #2563EB; font-size: 14px; margin: 0 0 15px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🔍 Security Checks</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: ${scan.heuristics.hasHttps ? '#ecfdf5' : '#fef2f2'}; padding: 12px; border-radius: 8px; border-left: 3px solid ${scan.heuristics.hasHttps ? '#10b981' : '#ef4444'};">
            <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 11px; color: ${scan.heuristics.hasHttps ? '#065f46' : '#7f1d1d'};">HTTPS Protocol</p>
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: ${scan.heuristics.hasHttps ? '#10b981' : '#ef4444'};">${scan.heuristics.hasHttps ? '✅ Yes' : '❌ No'}</p>
          </div>
          <div style="background: ${!scan.heuristics.isShortened ? '#ecfdf5' : '#fef2f2'}; padding: 12px; border-radius: 8px; border-left: 3px solid ${!scan.heuristics.isShortened ? '#10b981' : '#f59e0b'};">
            <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 11px; color: ${!scan.heuristics.isShortened ? '#065f46' : '#92400e'};">URL Shortened</p>
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: ${!scan.heuristics.isShortened ? '#10b981' : '#f59e0b'};">${!scan.heuristics.isShortened ? '✅ No' : '⚠️ Yes'}</p>
          </div>
          <div style="background: ${!scan.heuristics.isIpBased ? '#ecfdf5' : '#fef2f2'}; padding: 12px; border-radius: 8px; border-left: 3px solid ${!scan.heuristics.isIpBased ? '#10b981' : '#ef4444'};">
            <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 11px; color: ${!scan.heuristics.isIpBased ? '#065f46' : '#7f1d1d'};">IP-Based URL</p>
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: ${!scan.heuristics.isIpBased ? '#10b981' : '#ef4444'};">${!scan.heuristics.isIpBased ? '✅ No' : '❌ Yes'}</p>
          </div>
          <div style="background: ${!scan.heuristics.hasSubdomainAbuse ? '#ecfdf5' : '#fef2f2'}; padding: 12px; border-radius: 8px; border-left: 3px solid ${!scan.heuristics.hasSubdomainAbuse ? '#10b981' : '#ef4444'};">
            <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 11px; color: ${!scan.heuristics.hasSubdomainAbuse ? '#065f46' : '#7f1d1d'};">Subdomain Abuse</p>
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: ${!scan.heuristics.hasSubdomainAbuse ? '#10b981' : '#ef4444'};">${!scan.heuristics.hasSubdomainAbuse ? '✅ None' : '❌ Detected'}</p>
          </div>
        </div>
      </div>
    ` : ''}

    ${scan.googleSafeBrowsing || scan.virusTotal ? `
      <!-- API Results -->
      <div style="margin-bottom: 25px;">
        <h2 style="color: #2563EB; font-size: 14px; margin: 0 0 15px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🔌 API Security Checks</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          ${scan.googleSafeBrowsing ? `
            <div style="background: ${scan.googleSafeBrowsing.isSafe ? '#ecfdf5' : '#fef2f2'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${scan.googleSafeBrowsing.isSafe ? '#10b981' : '#ef4444'};">
              <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 12px; color: ${scan.googleSafeBrowsing.isSafe ? '#065f46' : '#7f1d1d'};">Google Safe Browsing</p>
              <p style="margin: 0; font-size: 11px; color: ${scan.googleSafeBrowsing.isSafe ? '#047857' : '#991b1b'};">
                ${scan.googleSafeBrowsing.isSafe ? '✅ No threats detected' : `❌ Threats: ${scan.googleSafeBrowsing.threats?.join(', ') || 'Unknown'}`}
              </p>
            </div>
          ` : ''}
          ${scan.virusTotal ? `
            <div style="background: ${scan.virusTotal.positives === 0 ? '#ecfdf5' : '#fef2f2'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${scan.virusTotal.positives === 0 ? '#10b981' : '#ef4444'};">
              <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 12px; color: ${scan.virusTotal.positives === 0 ? '#065f46' : '#7f1d1d'};">VirusTotal</p>
              <p style="margin: 0; font-size: 11px; color: ${scan.virusTotal.positives === 0 ? '#047857' : '#991b1b'};">
                ${scan.virusTotal.positives}/${scan.virusTotal.total} engines flagged
              </p>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    ${scan.aiAnalysis ? `
      <!-- AI Analysis -->
      <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #4F9EFF; margin-bottom: 25px;">
        <h2 style="color: #2563EB; font-size: 14px; margin: 0 0 15px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🧠 AI Analysis</h2>
        
        <div style="margin-bottom: 15px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 12px; color: #2563EB;">Phishing Probability</p>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="flex: 1;">
              <div style="width: 100%; height: 12px; background: #d1d5db; border-radius: 6px; overflow: hidden;">
                <div style="width: ${scan.aiAnalysis.phishingProbability || 0}%; height: 100%; background: linear-gradient(90deg, ${
                  scan.aiAnalysis.phishingProbability < 30 ? '#10b981' : 
                  scan.aiAnalysis.phishingProbability < 60 ? '#f59e0b' : '#ef4444'
                }, ${
                  scan.aiAnalysis.phishingProbability < 30 ? '#059669' : 
                  scan.aiAnalysis.phishingProbability < 60 ? '#d97706' : '#dc2626'
                });"></div>
              </div>
            </div>
            <span style="font-size: 14px; font-weight: 800; color: ${
              scan.aiAnalysis.phishingProbability < 30 ? '#10b981' : 
              scan.aiAnalysis.phishingProbability < 60 ? '#f59e0b' : '#ef4444'
            }; min-width: 50px; text-align: right;">${scan.aiAnalysis.phishingProbability || 0}%</span>
          </div>
        </div>

        ${scan.aiAnalysis.explanation && scan.aiAnalysis.explanation.length > 0 ? `
          <div>
            <p style="margin: 0 0 8px 0; font-weight: 700; font-size: 11px; color: #2563EB; text-transform: uppercase;">Findings:</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 11px; color: #4b5563;">
              ${scan.aiAnalysis.explanation.map(item => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <p style="margin: 12px 0 0 0; font-size: 10px; color: #6b7280;">
          <strong>Confidence:</strong> ${scan.aiAnalysis.confidence?.toUpperCase() || 'N/A'}
        </p>
      </div>
    ` : ''}

    <!-- Footer -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 10px; color: #9ca3af;">
      <p style="margin: 0 0 5px 0; font-weight: 600;">🛡️ LinkGuard Security Scanner</p>
      <p style="margin: 0;">This report contains confidential security information. Please handle with care.</p>
    </div>
  `;

  return container;
};
