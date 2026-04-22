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
    try {
      console.log('Starting PDF download...');
      
      const response = await api.get('/report/pdf-history', {
        responseType: 'blob',
        timeout: 60000 // 60 seconds timeout
      });
      
      console.log('PDF response received');
      
      // Create blob from response
      const blob = new Blob([response.data], { 
        type: 'application/pdf' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0];
      link.download = `linkguard-scan-history-${today}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download completed');
      
    } catch (error) {
      console.error('PDF download error:', error);
      
      let errorMessage = 'Failed to download PDF report';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No scan history found to export';
        } else if (error.response.status === 401) {
          errorMessage = 'Please login to download your scan history';
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please try again';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
                disabled={loading}
              >
                📄 Download PDF
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