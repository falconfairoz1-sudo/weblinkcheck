import React from 'react';
import '../styles/gauge.css';

export default function RiskGauge({ score }) {
  const clampedScore = Math.min(100, Math.max(0, score || 0));

  // SVG arc parameters
  const radius = 54;
  const cx = 70;
  const cy = 70;
  const circumference = Math.PI * radius; // half circle
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Color based on score
  const getColor = (s) => {
    if (s < 30) return '#00d4aa';
    if (s < 60) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor(clampedScore);

  // Needle rotation: -90deg = 0%, 90deg = 100%
  const needleRotation = -90 + (clampedScore / 100) * 180;

  return (
    <div className="gauge-wrapper" aria-label={`Risk score: ${clampedScore} out of 100`}>
      <svg viewBox="0 0 140 80" className="gauge-svg">
        {/* Background arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Colored arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />

        {/* Needle */}
        <g transform={`rotate(${needleRotation}, ${cx}, ${cy})`} style={{ transition: 'transform 1s ease' }}>
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - radius + 8}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="4" fill={color} />
        </g>

        {/* Zone labels */}
        <text x="18" y="78" className="gauge-label" fill="#00d4aa">Safe</text>
        <text x="55" y="22" className="gauge-label" fill="#f59e0b" textAnchor="middle">Risk</text>
        <text x="108" y="78" className="gauge-label" fill="#ef4444" textAnchor="end">Danger</text>
      </svg>
    </div>
  );
}
