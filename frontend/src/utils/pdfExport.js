/**
 * Generate beautiful PDF from scan data using jsPDF
 */
export const generatePDFReport = async (scanData, filename) => {
  try {
    // Ensure jsPDF is loaded
    if (!window.jspdf) {
      await loadJsPDF();
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const scan = Array.isArray(scanData) ? scanData[0] : scanData;
    
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to add text with word wrap
    const addText = (text, x, y, maxWidth, fontSize = 10, color = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.5);
    };

    // Header with gradient effect (simulated with rectangles)
    doc.setFillColor(79, 158, 255);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Shield emoji and title
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.text('🛡️', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('LinkGuard Security Report', pageWidth / 2, 38, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Comprehensive URL Security Analysis', pageWidth / 2, 45, { align: 'center' });

    yPos = 60;

    // Generated date
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Scanned URL Section
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPos, contentWidth, 25, 'F');
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('SCANNED URL', margin + 5, yPos + 8);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    const urlLines = doc.splitTextToSize(scan.url || 'N/A', contentWidth - 10);
    doc.text(urlLines, margin + 5, yPos + 16);
    yPos += 35;

    // Status and Risk Score
    const boxWidth = (contentWidth - 10) / 2;
    
    // Status Box
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPos, boxWidth, 30, 'F');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('STATUS', margin + 5, yPos + 8);
    
    // Status badge
    const statusColors = {
      safe: [16, 185, 129],
      suspicious: [245, 158, 11],
      malicious: [239, 68, 68]
    };
    const statusColor = statusColors[scan.status] || [100, 100, 100];
    doc.setFillColor(...statusColor);
    doc.roundedRect(margin + 5, yPos + 12, boxWidth - 10, 12, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text((scan.status || 'UNKNOWN').toUpperCase(), margin + boxWidth / 2, yPos + 20, { align: 'center' });

    // Risk Score Box
    doc.setFillColor(248, 250, 252);
    doc.rect(margin + boxWidth + 10, yPos, boxWidth, 30, 'F');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('RISK SCORE', margin + boxWidth + 15, yPos + 8);
    
    // Risk score bar
    const riskScore = scan.riskScore || 0;
    const barWidth = boxWidth - 30;
    const barHeight = 8;
    
    doc.setFillColor(229, 231, 235);
    doc.roundedRect(margin + boxWidth + 15, yPos + 12, barWidth, barHeight, 2, 2, 'F');
    
    const riskColor = riskScore < 30 ? [16, 185, 129] : riskScore < 60 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(...riskColor);
    doc.roundedRect(margin + boxWidth + 15, yPos + 12, (barWidth * riskScore) / 100, barHeight, 2, 2, 'F');
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...riskColor);
    doc.text(`${riskScore}/100`, margin + boxWidth + 15 + barWidth + 5, yPos + 18);
    
    yPos += 40;

    // Domain and Scan Duration
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPos, boxWidth, 20, 'F');
    doc.rect(margin + boxWidth + 10, yPos, boxWidth, 20, 'F');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('DOMAIN', margin + 5, yPos + 8);
    doc.text('SCAN DURATION', margin + boxWidth + 15, yPos + 8);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(scan.domain || 'N/A', margin + 5, yPos + 15);
    doc.text(`${scan.scanDuration || 'N/A'}ms`, margin + boxWidth + 15, yPos + 15);
    
    yPos += 30;

    // Warnings
    if (scan.warnings && scan.warnings.length > 0) {
      doc.setFillColor(255, 251, 235);
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(2);
      doc.rect(margin, yPos, contentWidth, 10 + (scan.warnings.length * 12), 'FD');
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(217, 119, 6);
      doc.text(`⚠️ WARNINGS DETECTED (${scan.warnings.length})`, margin + 5, yPos + 7);
      
      yPos += 12;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(146, 64, 14);
      
      scan.warnings.forEach((warning, idx) => {
        doc.text(`• ${warning.type?.replace(/_/g, ' ') || 'Warning'}: ${warning.message}`, margin + 5, yPos + (idx * 12));
      });
      
      yPos += (scan.warnings.length * 12) + 10;
    }

    // Security Checks
    if (scan.heuristics) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('🔍 SECURITY CHECKS', margin, yPos);
      yPos += 10;
      
      const checks = [
        { label: 'HTTPS Protocol', value: scan.heuristics.hasHttps, good: true },
        { label: 'URL Shortened', value: scan.heuristics.isShortened, good: false },
        { label: 'IP-Based URL', value: scan.heuristics.isIpBased, good: false },
        { label: 'Subdomain Abuse', value: scan.heuristics.hasSubdomainAbuse, good: false }
      ];
      
      const checkBoxWidth = (contentWidth - 15) / 2;
      let checkX = margin;
      let checkY = yPos;
      
      checks.forEach((check, idx) => {
        const isGood = check.good ? check.value : !check.value;
        const bgColor = isGood ? [236, 253, 245] : [254, 242, 242];
        const textColor = isGood ? [6, 95, 70] : [127, 29, 29];
        
        doc.setFillColor(...bgColor);
        doc.rect(checkX, checkY, checkBoxWidth, 15, 'F');
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...textColor);
        doc.text(check.label, checkX + 3, checkY + 6);
        
        doc.setFontSize(9);
        doc.text(isGood ? '✅ Pass' : '❌ Fail', checkX + 3, checkY + 12);
        
        if (idx % 2 === 0) {
          checkX += checkBoxWidth + 5;
        } else {
          checkX = margin;
          checkY += 18;
        }
      });
      
      yPos = checkY + (checks.length % 2 === 0 ? 0 : 18) + 10;
    }

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // API Results
    if (scan.googleSafeBrowsing || scan.virusTotal) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('🔌 API SECURITY CHECKS', margin, yPos);
      yPos += 10;
      
      if (scan.googleSafeBrowsing) {
        const isSafe = scan.googleSafeBrowsing.isSafe;
        doc.setFillColor(isSafe ? 236 : 254, isSafe ? 253 : 242, isSafe ? 245 : 242);
        doc.rect(margin, yPos, contentWidth, 15, 'F');
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(isSafe ? 6 : 127, isSafe ? 95 : 29, isSafe ? 70 : 29);
        doc.text('Google Safe Browsing', margin + 3, yPos + 6);
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.text(isSafe ? '✅ No threats detected' : '❌ Threats detected', margin + 3, yPos + 12);
        yPos += 18;
      }
      
      if (scan.virusTotal) {
        const isSafe = scan.virusTotal.positives === 0;
        doc.setFillColor(isSafe ? 236 : 254, isSafe ? 253 : 242, isSafe ? 245 : 242);
        doc.rect(margin, yPos, contentWidth, 15, 'F');
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(isSafe ? 6 : 127, isSafe ? 95 : 29, isSafe ? 70 : 29);
        doc.text('VirusTotal', margin + 3, yPos + 6);
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.text(`${scan.virusTotal.positives}/${scan.virusTotal.total} engines flagged`, margin + 3, yPos + 12);
        yPos += 18;
      }
      
      yPos += 5;
    }

    // AI Analysis
    if (scan.aiAnalysis) {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFillColor(240, 247, 255);
      doc.setDrawColor(79, 158, 255);
      doc.setLineWidth(1);
      doc.rect(margin, yPos, contentWidth, 40, 'FD');
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('🧠 AI ANALYSIS', margin + 5, yPos + 7);
      
      yPos += 12;
      
      // Phishing probability
      doc.setFontSize(9);
      doc.text('Phishing Probability:', margin + 5, yPos);
      
      const phishingProb = scan.aiAnalysis.phishingProbability || 0;
      const probBarWidth = contentWidth - 50;
      
      doc.setFillColor(209, 213, 219);
      doc.roundedRect(margin + 5, yPos + 3, probBarWidth, 6, 2, 2, 'F');
      
      const probColor = phishingProb < 30 ? [16, 185, 129] : phishingProb < 60 ? [245, 158, 11] : [239, 68, 68];
      doc.setFillColor(...probColor);
      doc.roundedRect(margin + 5, yPos + 3, (probBarWidth * phishingProb) / 100, 6, 2, 2, 'F');
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...probColor);
      doc.text(`${phishingProb}%`, margin + probBarWidth + 10, yPos + 7);
      
      yPos += 12;
      
      if (scan.aiAnalysis.explanation && scan.aiAnalysis.explanation.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        doc.setTextColor(37, 99, 235);
        doc.text('Findings:', margin + 5, yPos);
        yPos += 5;
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(75, 85, 99);
        scan.aiAnalysis.explanation.slice(0, 3).forEach((item, idx) => {
          const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 15);
          doc.text(lines, margin + 8, yPos);
          yPos += lines.length * 4;
        });
      }
      
      yPos += 10;
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(156, 163, 175);
    doc.text('🛡️ LinkGuard Security Scanner', pageWidth / 2, footerY + 5, { align: 'center' });
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('This report contains confidential security information. Please handle with care.', pageWidth / 2, footerY + 10, { align: 'center' });

    // Save the PDF
    doc.save(`${filename}.pdf`);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

/**
 * Load jsPDF library dynamically
 */
const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(script);
  });
};
