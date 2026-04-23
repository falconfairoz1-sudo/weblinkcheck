import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/scannotes.css';

export default function ScanNotes({ scanId }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!scanId) return;
    setLoading(true);
    api.get(`/advanced/scan-notes/${scanId}`)
      .then(res => setNotes(res.data.notes || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [scanId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSaving(true);
    try {
      const res = await api.post('/advanced/scan-notes', { scanId, note: text.trim() });
      setNotes(res.data.notes);
      setText('');
      window.showNotification?.('Note added', 'success');
    } catch (err) {
      window.showNotification?.(err.response?.data?.error || 'Failed to add note', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!scanId) return null;

  return (
    <div className="scan-notes">
      <div className="notes-header">
        <span>📝</span>
        <h3>My Notes</h3>
        <span className="notes-count">{notes.length}</span>
      </div>

      {loading ? (
        <div className="notes-loading">Loading notes...</div>
      ) : (
        <>
          {notes.length === 0 && (
            <p className="notes-empty">No notes yet. Add a note to remember something about this scan.</p>
          )}
          <div className="notes-list">
            {notes.map((note, i) => (
              <div key={i} className="note-item">
                <p className="note-text">{note.text}</p>
                <span className="note-date">{new Date(note.addedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {user ? (
            <form onSubmit={handleAdd} className="notes-form">
              <textarea
                className="notes-textarea"
                placeholder="Add a note about this scan..."
                value={text}
                onChange={e => setText(e.target.value)}
                rows={2}
                maxLength={500}
              />
              <div className="notes-form-footer">
                <span className="notes-char-count">{text.length}/500</span>
                <button type="submit" className="notes-save-btn" disabled={saving || !text.trim()}>
                  {saving ? <span className="btn-spinner"></span> : '💾 Save Note'}
                </button>
              </div>
            </form>
          ) : (
            <p className="notes-login">Login to add notes to this scan.</p>
          )}
        </>
      )}
    </div>
  );
}
