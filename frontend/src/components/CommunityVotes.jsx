import { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/communityvotes.css';

export default function CommunityVotes({ scanId }) {
  const [votes, setVotes] = useState({ safe: 0, unsafe: 0 });
  const [voted, setVoted] = useState(null); // 'safe' | 'unsafe'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scanId) return;
    const stored = localStorage.getItem(`vote_${scanId}`);
    if (stored) setVoted(stored);
    fetchVotes();
  }, [scanId]);

  const fetchVotes = async () => {
    try {
      const res = await api.get(`/tools/votes/${scanId}`);
      setVotes(res.data.votes || { safe: 0, unsafe: 0 });
    } catch {}
  };

  const handleVote = async (vote) => {
    if (voted || loading) return;
    setLoading(true);
    try {
      const res = await api.post('/tools/vote', { scanId, vote });
      setVotes(res.data.votes);
      setVoted(vote);
      localStorage.setItem(`vote_${scanId}`, vote);
      window.showNotification?.('Thanks for your vote!', 'success');
    } catch {
      window.showNotification?.('Failed to record vote', 'error');
    } finally {
      setLoading(false);
    }
  };

  const total = votes.safe + votes.unsafe;
  const safePercent = total > 0 ? Math.round((votes.safe / total) * 100) : 50;
  const unsafePercent = 100 - safePercent;

  return (
    <div className="community-votes">
      <div className="votes-header">
        <span className="votes-icon">👥</span>
        <h3>Community Safety Votes</h3>
        <span className="votes-total">{total} vote{total !== 1 ? 's' : ''}</span>
      </div>

      <div className="votes-bar">
        <div className="votes-bar-safe" style={{ width: `${safePercent}%` }}></div>
        <div className="votes-bar-unsafe" style={{ width: `${unsafePercent}%` }}></div>
      </div>

      <div className="votes-labels">
        <span className="votes-label-safe">✅ Safe {safePercent}%</span>
        <span className="votes-label-unsafe">❌ Unsafe {unsafePercent}%</span>
      </div>

      {!voted ? (
        <div className="votes-actions">
          <p className="votes-prompt">What do you think?</p>
          <div className="vote-buttons">
            <button
              className="vote-btn vote-safe"
              onClick={() => handleVote('safe')}
              disabled={loading}
            >
              👍 Looks Safe
            </button>
            <button
              className="vote-btn vote-unsafe"
              onClick={() => handleVote('unsafe')}
              disabled={loading}
            >
              👎 Looks Unsafe
            </button>
          </div>
        </div>
      ) : (
        <div className="votes-thankyou">
          <span>{voted === 'safe' ? '👍' : '👎'}</span>
          You voted this as <strong>{voted}</strong>
        </div>
      )}
    </div>
  );
}
