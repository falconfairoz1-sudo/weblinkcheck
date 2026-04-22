/**
 * Get status color class
 */
export function getStatusColor(status) {
  switch (status) {
    case 'safe': return 'safe';
    case 'suspicious': return 'suspicious';
    case 'malicious': return 'malicious';
    default: return 'unknown';
  }
}

/**
 * Get status icon
 */
export function getStatusIcon(status) {
  switch (status) {
    case 'safe': return '✅';
    case 'suspicious': return '⚠️';
    case 'malicious': return '❌';
    default: return '❓';
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
  switch (status) {
    case 'safe': return 'Safe';
    case 'suspicious': return 'Suspicious';
    case 'malicious': return 'Malicious';
    default: return 'Unknown';
  }
}

/**
 * Get risk score color
 */
export function getRiskColor(score) {
  if (score < 30) return '#00d4aa';
  if (score < 60) return '#f59e0b';
  return '#ef4444';
}

/**
 * Get severity color
 */
export function getSeverityColor(severity) {
  switch (severity) {
    case 'low': return '#60a5fa';
    case 'medium': return '#f59e0b';
    case 'high': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#94a3b8';
  }
}

/**
 * Format date
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate URL for display
 */
export function truncateUrl(url, maxLen = 60) {
  if (!url) return '';
  if (url.length <= maxLen) return url;
  return url.substring(0, maxLen) + '...';
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
