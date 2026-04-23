import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/bookmarks.css';

export default function Bookmarks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/tools/bookmarks');
      setBookmarks(res.data.bookmarks || []);
    } catch (err) {
      console.error('Fetch bookmarks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setAdding(true);
    try {
      const res = await api.post('/tools/bookmarks', { url: newUrl.trim(), label: newLabel.trim() || newUrl.trim() });
      setBookmarks(res.data.bookmarks);
      setNewUrl('');
      setNewLabel('');
      setShowForm(false);
      window.showNotification?.('Bookmark added', 'success');
    } catch (err) {
      window.showNotification?.(err.response?.data?.error || 'Failed to add bookmark', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (url) => {
    try {
      const res = await api.delete('/tools/bookmarks', { data: { url } });
      setBookmarks(res.data.bookmarks);
      window.showNotification?.('Bookmark removed', 'info');
    } catch {
      window.showNotification?.('Failed to remove bookmark', 'error');
    }
  };

  const handleScan = (url) => {
    navigate(`/?scan=${encodeURIComponent(url)}`);
  };

  if (!user) {
    return (
      <div className="bookmarks-page">
        <div className="bookmarks-auth">
          <span>🔐</span>
          <h2>Login Required</h2>
          <p>Please log in to manage your bookmarks.</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-header">
        <div>
          <div className="bookmarks-icon">🔖</div>
          <h1>Bookmarks</h1>
          <p>Save URLs to your watchlist for quick scanning</p>
        </div>
        <button className="add-bookmark-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Bookmark'}
        </button>
      </div>

      {showForm && (
        <div className="bookmark-form-card">
          <form onSubmit={handleAdd} className="bookmark-form">
            <div className="form-row">
              <input
                type="url"
                className="bookmark-input"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
              />
              <input
                type="text"
                className="bookmark-input"
                placeholder="Label (optional)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <button type="submit" className="bookmark-save-btn" disabled={adding}>
                {adding ? <span className="btn-spinner"></span> : '💾 Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="bookmarks-loading">
          {[...Array(4)].map((_, i) => <div key={i} className="bookmark-skeleton"></div>)}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bookmarks-empty">
          <span className="empty-icon">🔖</span>
          <h3>No bookmarks yet</h3>
          <p>Save URLs you want to monitor or scan regularly</p>
          <button className="add-bookmark-btn" onClick={() => setShowForm(true)}>
            + Add Your First Bookmark
          </button>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((bm, i) => (
            <div key={i} className="bookmark-card">
              <div className="bookmark-card-top">
                <span className="bookmark-card-icon">🔖</span>
                <div className="bookmark-card-info">
                  <div className="bookmark-label">{bm.label}</div>
                  <div className="bookmark-url">{bm.url}</div>
                </div>
              </div>
              <div className="bookmark-card-date">
                Added {new Date(bm.addedAt).toLocaleDateString()}
              </div>
              <div className="bookmark-card-actions">
                <button className="bm-scan-btn" onClick={() => handleScan(bm.url)}>
                  🛡️ Scan
                </button>
                <a className="bm-visit-btn" href={bm.url} target="_blank" rel="noopener noreferrer">
                  🔗 Visit
                </a>
                <button className="bm-remove-btn" onClick={() => handleRemove(bm.url)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
