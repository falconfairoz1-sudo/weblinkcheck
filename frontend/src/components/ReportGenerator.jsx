import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/reportgenerator.css';

export default function ReportGenerator({ scannerType, analysisData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateReport = async () => {
    if (!scannerType) {
      setError('Scanner type is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/report/generate', {
        scannerType,
        analysisData: analysisData || {}
      }, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scanner-report-${scannerType}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess('Report downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Report generation error:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-generator">
      {error && (
        <div className="report-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="report-success">
          <span>✅</span>
          <p>{success}</p>
        </div>
      )}

      <button
        className="btn-generate-report"
        onClick={handleGenerateReport}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Generating Report...
          </>
        ) : (
          <>
            <span className="report-icon">📄</span>
            Download PDF Report
          </>
        )}
      </button>
    </div>
  );
}
