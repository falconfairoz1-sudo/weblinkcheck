import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/scanstreak.css';

export default function ScanStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/tools/streak')
      .then(res => setStreak(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || loading || !streak) return null;

  const getStreakEmoji = (n) => {
    if (n >= 30) return '🏆';
    if (n >= 14) return '🔥';
    if (n >= 7) return '⚡';
    if (n >= 3) return '✨';
    return '🌱';
  };

  const getStreakMessage = (n) => {
    if (n >= 30) return 'Legendary streak!';
    if (n >= 14) return 'On fire! Keep it up!';
    if (n >= 7) return 'One week strong!';
    if (n >= 3) return 'Building momentum!';
    if (n === 1) return 'Great start!';
    return 'Start scanning daily!';
  };

  return (
    <div className="scan-streak">
      <div className="streak-main">
        <span className="streak-emoji">{getStreakEmoji(streak.streak)}</span>
        <div className="streak-info">
          <div className="streak-number">{streak.streak}</div>
          <div className="streak-label">Day Streak</div>
        </div>
      </div>
      <div className="streak-message">{getStreakMessage(streak.streak)}</div>
      <div className="streak-stats">
        <div className="streak-stat">
          <span className="streak-stat-val">{streak.longestStreak}</span>
          <span className="streak-stat-label">Best</span>
        </div>
        <div className="streak-divider"></div>
        <div className="streak-stat">
          <span className="streak-stat-val">{streak.totalDays}</span>
          <span className="streak-stat-label">Total Days</span>
        </div>
      </div>
    </div>
  );
}
