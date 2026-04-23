import React, { useState } from 'react';
import { generatePDFReport } from '../utils/pdfExport';
import '../styles/exportdata.css';

export default function ExportData({ scanData }) {
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let content = '';
      let filename = `scan-export-${Date.now()}`;
      let mimeType = 'application/json';

      if (exportFormat === 'json') {
        content = JSON.stringify(scanData, null, 2);
        filename += '.json';
      } else if (exportFormat === 'csv') {
        content = convertToCSV(scanData);
        filename += '.csv';
        mimeType = 'text/csv';
      } else if (exportFormat === 'txt') {
        content = convertToTXT(scanData);
        filename += '.txt';
        mimeType = 'text/plain';
      } else if (exportFormat === 'pdf') {
        await generatePDFReport(scanData, filename);
        setIsExporting(false);
        return;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setTimeout(() => setIsExporting(false), 500);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  const convertToCSV = (data) => {
    const scans = Array.isArray(data) ? data : [data];
    const headers = ['URL', 'Status', 'Risk Score', 'Timestamp', 'Threats'];
    const rows = scans.map(scan => [
      scan.url || 'N/A',
      scan.status || 'N/A',
      scan.riskScore || 0,
      new Date().toISOString(),
      (scan.indicators || []).join('; ')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  };

  const convertToTXT = (data) => {
    const scans = Array.isArray(data) ? data : [data];
    let txt = 'SCAN EXPORT REPORT\n';
    txt += '='.repeat(50) + '\n\n';

    scans.forEach((scan, idx) => {
      txt += `Scan #${idx + 1}\n`;
      txt += '-'.repeat(50) + '\n';
      txt += `URL: ${scan.url || 'N/A'}\n`;
      txt += `Status: ${scan.status || 'N/A'}\n`;
      txt += `Risk Score: ${scan.riskScore || 0}/100\n`;
      txt += `Timestamp: ${new Date().toISOString()}\n`;
      if (scan.indicators && scan.indicators.length > 0) {
        txt += `Threats: ${scan.indicators.join(', ')}\n`;
      }
      txt += '\n';
    });

    return txt;
  };

  return (
    <div className="export-data">
      <div className="export-header">
        <h4>📥 Export Data</h4>
        <p>Download your scan results in multiple formats</p>
      </div>

      <div className="export-options">
        <label className="export-option">
          <input
            type="radio"
            name="format"
            value="json"
            checked={exportFormat === 'json'}
            onChange={(e) => setExportFormat(e.target.value)}
          />
          <span className="option-label">
            <span className="option-icon">📄</span>
            <span className="option-text">
              <span className="option-name">JSON</span>
              <span className="option-desc">Structured data format</span>
            </span>
          </span>
        </label>

        <label className="export-option">
          <input
            type="radio"
            name="format"
            value="csv"
            checked={exportFormat === 'csv'}
            onChange={(e) => setExportFormat(e.target.value)}
          />
          <span className="option-label">
            <span className="option-icon">📊</span>
            <span className="option-text">
              <span className="option-name">CSV</span>
              <span className="option-desc">Spreadsheet format</span>
            </span>
          </span>
        </label>

        <label className="export-option">
          <input
            type="radio"
            name="format"
            value="txt"
            checked={exportFormat === 'txt'}
            onChange={(e) => setExportFormat(e.target.value)}
          />
          <span className="option-label">
            <span className="option-icon">📝</span>
            <span className="option-text">
              <span className="option-name">TXT</span>
              <span className="option-desc">Plain text format</span>
            </span>
          </span>
        </label>

        <label className="export-option">
          <input
            type="radio"
            name="format"
            value="pdf"
            checked={exportFormat === 'pdf'}
            onChange={(e) => setExportFormat(e.target.value)}
          />
          <span className="option-label">
            <span className="option-icon">📕</span>
            <span className="option-text">
              <span className="option-name">PDF</span>
              <span className="option-desc">Professional report</span>
            </span>
          </span>
        </label>
      </div>

      <button
        className="btn-export"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <span className="spinner"></span>
            Exporting...
          </>
        ) : (
          <>
            <span className="export-icon">⬇️</span>
            Export as {exportFormat.toUpperCase()}
          </>
        )}
      </button>
    </div>
  );
}
