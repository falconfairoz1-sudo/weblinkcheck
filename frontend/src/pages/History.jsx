import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import HistoryList from '../components/HistoryList';
import api from '../utils/api';
import '../styles/history.css';

export default function History() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchHistory = async (pageNum = 1, newFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20'
      });
      
      if (newFilters.status) params.append('status', newFilters.status);
      if (newFilters.search) params.append('search', newFilters.search);

      const res = await api.get(`/history?${params}`);
      setScans(res.data.scans);
      setTotalPages(res.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchHistory(1, newFilters);
  };

  const handleDelete = async (scanId) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;
    
    try {
      await api.delete(`/history/${scanId}`);
      setScans(scans.filter(s => s._id !== scanId));
    } catch (error) {
      alert('Failed to delete scan: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all your scan history? This cannot be undone.')) return;
    
    try {
      await api.delete('/history/clear');
      setScans([]);
    } catch (error) {
      alert('Failed to clear history: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePDFDownload = async () => {
    if (scans.length === 0) {
      window.showNotification?.('No scans to export', 'warning');
      return;
    }

    setPdfLoading(true);
    window.showNotification?.('Generating PDF...', 'info');

    try {
      // Load jsPDF dynamically if not already loaded
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load jsPDF'));
          document.head.appendChild(script);
        });
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      const checkPage = (needed = 10) => {
        if (y + needed > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
      };

      // ── Header ──────────────────────────────────────────────────────────────
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 44, 'F');
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('LinkGuard — Scan History Report', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}   |   Total scans: ${scans.length}`, pageWidth / 2, 32, { align: 'center' });
      if (user) {
        doc.text(`User: ${user.username}`, pageWidth / 2, 40, { align: 'center' });
      }
      y = 54;

      // ── Summary bar ─────────────────────────────────────────────────────────
      const safe = scans.filter(s => s.status === 'safe').length;
      const suspicious = scans.filter(s => s.status === 'suspicious').length;
      const malicious = scans.filter(s => s.status === 'malicious').length;
      const colW = (contentWidth - 6) / 3;

      const summaryBoxes = [
        { label: 'Safe', count: safe, color: [16, 185, 129] },
        { label: 'Suspicious', count: suspicious, color: [245, 158, 11] },
        { label: 'Malicious', count: malicious, color: [239, 68, 68] },
      ];
      summaryBoxes.forEach((box, i) => {
        const bx = margin + i * (colW + 3);
        doc.setFillColor(...box.color);
        doc.roundedRect(bx, y, colW, 22, 3, 3, 'F');
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(String(box.count), bx + colW / 2, y + 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(box.label, bx + colW / 2, y + 19, { align: 'center' });
      });
      y += 30;

      // ── Table header ────────────────────────────────────────────────────────
      const cols = { url: margin, status: margin + 90, risk: margin + 128, domain: margin + 152, date: margin + 118 };
      // Adjusted columns: URL(85), Status(30), Risk(22), Domain(40), Date(rest)
      const colWidths = [85, 30, 22, 40, contentWidth - 85 - 30 - 22 - 40 - 3];
      const colX = [margin, margin + 85 + 2, margin + 85 + 30 + 4, margin + 85 + 30 + 22 + 6, margin + 85 + 30 + 22 + 40 + 8];

      doc.setFillColor(37, 99, 235);
      doc.rect(margin, y, contentWidth, 9, 'F');
      doc.setFontSize(7.5);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(255, 255, 255);
      const headers = ['URL', 'Status', 'Risk', 'Domain', 'Scanned At'];
      headers.forEach((h, i) => doc.text(h, colX[i] + 1, y + 6));
      y += 11;

      // ── Table rows ──────────────────────────────────────────────────────────
      const statusColors = {
        safe: [16, 185, 129],
        suspicious: [245, 158, 11],
        malicious: [239, 68, 68],
      };

      scans.forEach((scan, idx) => {
        checkPage(10);

        // Alternating row background
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 1, contentWidth, 9, 'F');
        }

        doc.setFontSize(7);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(55, 65, 81);

        // URL — truncate to fit
        const urlText = (scan.url || '').length > 48 ? scan.url.substring(0, 45) + '...' : (scan.url || 'N/A');
        doc.text(urlText, colX[0] + 1, y + 5);

        // Status badge
        const sc = statusColors[scan.status] || [100, 100, 100];
        doc.setFillColor(...sc);
        doc.roundedRect(colX[1], y, 26, 7, 1.5, 1.5, 'F');
        doc.setFontSize(6.5);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text((scan.status || 'N/A').toUpperCase(), colX[1] + 13, y + 5, { align: 'center' });

        // Risk score
        doc.setFontSize(7);
        doc.setFont(undefined, 'bold');
        const riskColor = scan.riskScore >= 60 ? [239, 68, 68] : scan.riskScore >= 30 ? [245, 158, 11] : [16, 185, 129];
        doc.setTextColor(...riskColor);
        doc.text(`${scan.riskScore ?? 'N/A'}`, colX[2] + 1, y + 5);

        // Domain
        doc.setFont(undefined, 'normal');
        doc.setTextColor(55, 65, 81);
        const domainText = (scan.domain || '').length > 22 ? scan.domain.substring(0, 19) + '...' : (scan.domain || 'N/A');
        doc.text(domainText, colX[3] + 1, y + 5);

        // Date
        const dateStr = scan.createdAt ? new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
        doc.text(dateStr, colX[4] + 1, y + 5);

        y += 9;
      });

      // ── Footer ──────────────────────────────────────────────────────────────
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.4);
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
        doc.setFontSize(7.5);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(156, 163, 175);
        doc.text('🛡️ LinkGuard Security Scanner — Confidential', margin, pageHeight - 8);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
      }

      const today = new Date().toISOString().split('T')[0];
      doc.save(`linkguard-history-${today}.pdf`);
      window.showNotification?.('PDF downloaded successfully', 'success');

    } catch (error) {
      console.error('PDF generation error:', error);
      window.showNotification?.('Failed to generate PDF: ' + error.message, 'error');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>Scan History</h1>
          <p className="history-subtitle">
            {user ? 'Your personal scan history' : 'Recent public scans'}
          </p>
        </div>
        <div className="history-actions">
          {user && scans.length > 0 && (
            <>
              <button 
                className="btn-export-pdf"
                onClick={handlePDFDownload}
                disabled={loading || pdfLoading}
              >
                {pdfLoading ? '⏳ Generating...' : '📄 Download PDF'}
              </button>
              <button 
                className="btn-clear-history" 
                onClick={handleClearAll}
                disabled={loading}
              >
                🗑️ Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="safe">✅ Safe</option>
            <option value="suspicious">⚠️ Suspicious</option>
            <option value="malicious">❌ Malicious</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-filter">Search URLs:</label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search by URL or domain..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* History List */}
      <div className="history-content">
        <HistoryList 
          scans={scans} 
          onDelete={user ? handleDelete : null} 
          loading={loading} 
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => fetchHistory(page - 1)}
            disabled={page <= 1}
          >
            ← Previous
          </button>
          
          <div className="page-info">
            Page {page} of {totalPages}
          </div>
          
          <button
            className="page-btn"
            onClick={() => fetchHistory(page + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Empty State for Non-Users */}
      {!user && scans.length === 0 && !loading && (
        <div className="history-empty-guest">
          <span className="empty-icon">🔐</span>
          <h3>Create an Account to Save History</h3>
          <p>Sign up to keep track of all your URL scans and access advanced features.</p>
          <div className="guest-actions">
            <a href="/register" className="btn-primary">Sign Up Free</a>
            <a href="/login" className="btn-secondary">Login</a>
          </div>
        </div>
      )}
    </div>
  );
}