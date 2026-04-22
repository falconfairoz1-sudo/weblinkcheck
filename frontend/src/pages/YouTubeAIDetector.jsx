import React, { useState } from 'react';
import '../styles/youtube-detector.css';

const YouTubeAIDetector = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/youtube/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to analyze video');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Network error. Please check if the backend is running.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'var(--color-malicious)';
      case 'medium': return 'var(--color-suspicious)';
      case 'low': return 'var(--color-safe)';
      default: return 'var(--text-muted)';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 60) return 'var(--color-malicious)';
    if (probability >= 35) return 'var(--color-suspicious)';
    if (probability >= 20) return 'var(--color-safe)';
    return 'var(--text-muted)';
  };

  return (
    <div className="youtube-detector-page">
      <div className="detector-container">
        {/* Header */}
        <div className="detector-header">
          <div className="header-icon">🤖</div>
          <h1>YouTube AI Content Detector</h1>
          <p className="header-subtitle">
            Analyze YouTube videos to detect if they're AI-generated
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="detector-form">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
              className="youtube-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary analyze-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🔍</span>
                  Analyze Video
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-animation">
              <div className="scan-ring ring-1"></div>
              <div className="scan-ring ring-2"></div>
              <div className="scan-ring ring-3"></div>
              <div className="scan-center">🎥</div>
            </div>
            <p>Analyzing video content...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="results-container">
            {/* Video Info Card */}
            <div className="video-info-card glass">
              <div className="video-thumbnail">
                <img src={result.thumbnail} alt={result.videoTitle} />
              </div>
              <div className="video-details">
                <h3>{result.videoTitle}</h3>
                <p className="channel-name">📺 {result.channelTitle}</p>
                <div className="video-stats">
                  <span>👁️ {parseInt(result.statistics.views).toLocaleString()} views</span>
                  <span>👍 {parseInt(result.statistics.likes).toLocaleString()} likes</span>
                  <span>💬 {parseInt(result.statistics.comments).toLocaleString()} comments</span>
                </div>
              </div>
            </div>

            {/* AI Detection Result */}
            <div className={`detection-result glass ${result.isAIGenerated ? 'ai-detected' : 'human-content'}`}>
              <div className="result-header">
                <div className="result-icon">
                  {result.isAIGenerated ? '🤖' : '👤'}
                </div>
                <div className="result-status">
                  <h2>
                    {result.isAIGenerated ? 'AI-Generated Content Detected' : 'Likely Human-Created'}
                  </h2>
                  <p style={{ color: getConfidenceColor(result.confidence) }}>
                    Confidence: <strong>{result.confidence.toUpperCase()}</strong>
                  </p>
                </div>
              </div>

              {/* Probability Gauge */}
              <div className="probability-section">
                <div className="probability-label">
                  <span>AI Probability</span>
                  <span className="probability-value" style={{ color: getProbabilityColor(result.aiProbability) }}>
                    {result.aiProbability}%
                  </span>
                </div>
                <div className="probability-bar">
                  <div 
                    className="probability-fill"
                    style={{ 
                      width: `${result.aiProbability}%`,
                      background: getProbabilityColor(result.aiProbability)
                    }}
                  ></div>
                </div>
              </div>

              {/* Analysis Breakdown */}
              <div className="analysis-breakdown">
                <h3>Analysis Breakdown</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-item">
                    <span className="breakdown-label">Title Analysis</span>
                    <span className="breakdown-score">{result.analysis.title.score}%</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Description Analysis</span>
                    <span className="breakdown-score">{result.analysis.description.score}%</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Tags Analysis</span>
                    <span className="breakdown-score">{result.analysis.tags.score}%</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Channel Patterns</span>
                    <span className="breakdown-score">{result.analysis.channel.score}%</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">Metadata Patterns</span>
                    <span className="breakdown-score">{result.analysis.metadata.score}%</span>
                  </div>
                </div>
              </div>

              {/* Indicators Found */}
              {result.indicators && result.indicators.length > 0 && (
                <div className="indicators-section">
                  <h3>🔍 AI Indicators Found</h3>
                  <div className="indicators-list">
                    {result.indicators.map((indicator, index) => (
                      <div key={index} className="indicator-item">
                        <div className="indicator-header">
                          <span className="indicator-label">{indicator.label}</span>
                          <span className="indicator-source">{indicator.source}</span>
                        </div>
                        {indicator.examples && indicator.examples.length > 0 && (
                          <div className="indicator-examples">
                            {indicator.examples.map((example, i) => (
                              <span key={i} className="example-tag">{example}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Indicators */}
              {(!result.indicators || result.indicators.length === 0) && (
                <div className="no-indicators">
                  <p>✅ No obvious AI indicators found in the video metadata</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="disclaimer glass">
              <p>
                <strong>⚠️ Disclaimer:</strong> This analysis is based on video metadata, description, 
                and patterns. It cannot analyze the actual video content. Results should be used as 
                guidance only and may not be 100% accurate.
              </p>
            </div>
          </div>
        )}

        {/* How It Works */}
        {!result && !loading && (
          <div className="how-it-works glass">
            <h3>🔬 How It Works</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <h4>Text Analysis</h4>
                <p>Scans title, description, and tags for AI-related keywords and patterns</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏷️</div>
                <h4>Platform Detection</h4>
                <p>Identifies mentions of AI tools like ChatGPT, Midjourney, ElevenLabs, etc.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h4>Metadata Analysis</h4>
                <p>Examines engagement patterns and video characteristics</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h4>Confidence Scoring</h4>
                <p>Provides probability score with confidence level (low/medium/high)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeAIDetector;
