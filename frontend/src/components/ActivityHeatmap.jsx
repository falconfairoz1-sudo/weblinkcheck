import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/activityheatmap.css';

export default function ActivityHeatmap() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/advanced/heatmap')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || loading || !data) return null;

  // Build a 52-week grid
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // start on Sunday

  const dateMap = {};
  data.heatmap.forEach(d => { dateMap[d.date] = d; });

  const weeks = [];
  let current = new Date(startDate);
  while (current <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split('T')[0];
      week.push({ date: dateStr, ...( dateMap[dateStr] || { count: 0 }) });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (!count) return 'var(--bg-input)';
    const intensity = Math.min(count / Math.max(data.maxCount, 1), 1);
    if (intensity < 0.25) return 'rgba(79,158,255,0.3)';
    if (intensity < 0.5) return 'rgba(79,158,255,0.55)';
    if (intensity < 0.75) return 'rgba(79,158,255,0.75)';
    return 'rgba(79,158,255,1)';
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="heatmap-widget">
      <div className="heatmap-header">
        <span>📅</span>
        <h3>Scan Activity</h3>
        <span className="heatmap-total">{data.totalScans} scans in the last year</span>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="heatmap-week">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="heatmap-cell"
                  style={{ background: getColor(day.count) }}
                  title={day.count ? `${day.date}: ${day.count} scan${day.count !== 1 ? 's' : ''}` : day.date}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <div key={i} className="legend-cell" style={{ background: getColor(v * data.maxCount) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
