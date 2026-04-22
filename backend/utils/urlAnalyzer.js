/**
 * Comprehensive URL Heuristic Analyzer
 * Performs multi-layer analysis without external APIs
 */

// Known URL shorteners
const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link',
  'buff.ly', 'adf.ly', 'tiny.cc', 'is.gd', 'cli.gs', 'pic.gd',
  'digg.com', 'tr.im', 'twurl.nl', 'snipurl.com', 'short.to',
  'BudURL.com', 'ping.fm', 'post.ly', 'Just.as', 'bkite.com',
  'snipr.com', 'fic.kr', 'loopt.us', 'doiop.com', 'twitthis.com',
  'htxt.it', 'AltURL.com', 'RedirX.com', 'SnipURL.com', 'rb.gy',
  'cutt.ly', 'shorturl.at', 'tiny.one', 'rebrand.ly', 'bl.ink'
]);

// Suspicious keywords commonly found in phishing URLs
const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'validate',
  'account', 'update', 'confirm', 'secure', 'security', 'banking',
  'paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook',
  'instagram', 'netflix', 'urgent', 'alert', 'warning', 'suspended',
  'limited', 'expire', 'password', 'credential', 'free', 'winner',
  'prize', 'click', 'claim', 'reward', 'bonus', 'offer', 'deal',
  'discount', 'invoice', 'payment', 'billing', 'refund', 'support',
  'helpdesk', 'customer-service', 'webscr', 'cmd=_s-xclick'
];

// Suspicious TLDs often used in phishing
const SUSPICIOUS_TLDS = new Set([
  '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club',
  '.online', '.site', '.website', '.space', '.fun', '.icu',
  '.buzz', '.click', '.link', '.live', '.stream', '.download'
]);

// Legitimate brand domains (for subdomain abuse detection)
const BRAND_NAMES = [
  'paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook',
  'instagram', 'twitter', 'netflix', 'ebay', 'bank', 'chase',
  'wellsfargo', 'citibank', 'barclays', 'hsbc', 'visa', 'mastercard'
];

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Extract TLD from domain
 */
function extractTLD(domain) {
  if (!domain) return '';
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return '.' + parts[parts.length - 1];
  }
  return '';
}

/**
 * Check if URL uses an IP address instead of domain
 */
function isIpBased(domain) {
  if (!domain) return false;
  // IPv4 pattern
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 pattern (simplified)
  const ipv6 = /^\[?[0-9a-fA-F:]+\]?$/;
  return ipv4.test(domain) || ipv6.test(domain);
}

/**
 * Check for subdomain abuse (brand name in subdomain)
 */
function hasSubdomainAbuse(domain) {
  if (!domain) return false;
  const parts = domain.split('.');
  if (parts.length <= 2) return false;

  // Check if any brand name appears in subdomain but not as the main domain
  const subdomains = parts.slice(0, -2).join('.');
  return BRAND_NAMES.some((brand) => subdomains.includes(brand));
}

/**
 * Check for suspicious keywords in URL
 */
function findSuspiciousKeywords(url) {
  const lowerUrl = url.toLowerCase();
  return SUSPICIOUS_KEYWORDS.filter((kw) => lowerUrl.includes(kw));
}

/**
 * Check for special/obfuscation characters
 */
function hasSpecialChars(url) {
  // Check for @ symbol (can redirect to different host), multiple dots, encoded chars
  const suspiciousPatterns = [
    /@/, // @ in URL path
    /\.\./,  // double dots
    /%[0-9a-fA-F]{2}.*%[0-9a-fA-F]{2}.*%[0-9a-fA-F]{2}/, // heavy encoding
    /[^\x00-\x7F]/, // non-ASCII characters
    /\-{2,}/, // multiple consecutive hyphens
  ];
  return suspiciousPatterns.some((p) => p.test(url));
}

/**
 * Calculate path depth
 */
function getPathDepth(url) {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments.length;
  } catch {
    return 0;
  }
}

/**
 * Check for excessive subdomains
 */
function hasExcessiveSubdomains(domain) {
  if (!domain) return false;
  const parts = domain.split('.');
  return parts.length > 4;
}

/**
 * Check for long domain name (often used in phishing)
 */
function isLongDomain(domain) {
  if (!domain) return false;
  return domain.length > 50;
}

/**
 * Check for numbers in domain (suspicious pattern)
 */
function hasNumbersInDomain(domain) {
  if (!domain) return false;
  const mainDomain = domain.split('.').slice(-2, -1)[0] || '';
  return /\d/.test(mainDomain);
}

/**
 * Main heuristic analysis function
 * @param {string} url
 * @returns {object} heuristic analysis result
 */
function analyzeUrlHeuristics(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }

  const domain = parsedUrl.hostname.toLowerCase();
  const tld = extractTLD(domain);
  const suspiciousKeywordsFound = findSuspiciousKeywords(url);

  const analysis = {
    valid: true,
    domain,
    tld,
    hasHttps: parsedUrl.protocol === 'https:',
    isShortened: URL_SHORTENERS.has(domain),
    isIpBased: isIpBased(domain),
    hasSuspiciousKeywords: suspiciousKeywordsFound.length > 0,
    suspiciousKeywordsFound,
    hasSubdomainAbuse: hasSubdomainAbuse(domain),
    hasSpecialChars: hasSpecialChars(url),
    hasSuspiciousTLD: SUSPICIOUS_TLDS.has(tld),
    hasExcessiveSubdomains: hasExcessiveSubdomains(domain),
    isLongDomain: isLongDomain(domain),
    hasNumbersInDomain: hasNumbersInDomain(domain),
    domainLength: domain.length,
    pathDepth: getPathDepth(url),
    urlLength: url.length,
    hasQueryParams: parsedUrl.search.length > 0,
    queryParamCount: parsedUrl.searchParams ? [...parsedUrl.searchParams].length : 0
  };

  return analysis;
}

/**
 * Generate warnings based on heuristic analysis
 * @param {object} heuristics
 * @returns {Array<{type, message, severity}>}
 */
function generateWarnings(heuristics) {
  const warnings = [];

  if (!heuristics.hasHttps) {
    warnings.push({
      type: 'NO_HTTPS',
      message: 'This URL does not use HTTPS. Your connection may not be secure.',
      severity: 'high'
    });
  }

  if (heuristics.isShortened) {
    warnings.push({
      type: 'SHORTENED_URL',
      message: 'This is a shortened URL. The actual destination is hidden.',
      severity: 'medium'
    });
  }

  if (heuristics.isIpBased) {
    warnings.push({
      type: 'IP_BASED_URL',
      message: 'URL uses an IP address instead of a domain name — common in phishing attacks.',
      severity: 'critical'
    });
  }

  if (heuristics.hasSuspiciousKeywords && heuristics.suspiciousKeywordsFound.length > 0) {
    warnings.push({
      type: 'SUSPICIOUS_KEYWORDS',
      message: `Contains suspicious keywords: ${heuristics.suspiciousKeywordsFound.slice(0, 5).join(', ')}`,
      severity: heuristics.suspiciousKeywordsFound.length >= 3 ? 'high' : 'medium'
    });
  }

  if (heuristics.hasSubdomainAbuse) {
    warnings.push({
      type: 'SUBDOMAIN_ABUSE',
      message: 'A brand name appears in the subdomain — this is a common phishing technique.',
      severity: 'critical'
    });
  }

  if (heuristics.hasSuspiciousTLD) {
    warnings.push({
      type: 'SUSPICIOUS_TLD',
      message: `The domain uses a suspicious TLD (${heuristics.tld}) commonly associated with malicious sites.`,
      severity: 'high'
    });
  }

  if (heuristics.hasExcessiveSubdomains) {
    warnings.push({
      type: 'EXCESSIVE_SUBDOMAINS',
      message: 'URL has an unusually high number of subdomains.',
      severity: 'medium'
    });
  }

  if (heuristics.isLongDomain) {
    warnings.push({
      type: 'LONG_DOMAIN',
      message: 'Unusually long domain name — often used to disguise malicious URLs.',
      severity: 'medium'
    });
  }

  if (heuristics.hasSpecialChars) {
    warnings.push({
      type: 'SPECIAL_CHARS',
      message: 'URL contains special or obfuscated characters that may be used to deceive.',
      severity: 'high'
    });
  }

  if (heuristics.urlLength > 200) {
    warnings.push({
      type: 'LONG_URL',
      message: 'Extremely long URL — may be attempting to hide the true destination.',
      severity: 'low'
    });
  }

  return warnings;
}

/**
 * Calculate AI-style risk score based on all factors
 * @param {object} params
 * @returns {{score: number, explanation: string[], confidence: string}}
 */
function calculateRiskScore({
  heuristics,
  googleResult,
  virusTotalResult,
  domainAge
}) {
  let score = 0;
  const explanation = [];

  // ── API-based scoring (high weight) ──────────────────────────────────────────
  if (googleResult?.checked && !googleResult.isSafe) {
    score += 40;
    explanation.push(`🚨 Google Safe Browsing flagged this URL as: ${googleResult.threats.join(', ')}`);
  }

  if (virusTotalResult?.checked && virusTotalResult.positives > 0) {
    const vtScore = Math.min(30, (virusTotalResult.positives / Math.max(virusTotalResult.total, 1)) * 30);
    score += vtScore;
    explanation.push(`🦠 VirusTotal: ${virusTotalResult.positives}/${virusTotalResult.total} engines flagged this URL`);
  }

  // ── Heuristic scoring ─────────────────────────────────────────────────────────
  if (heuristics.isIpBased) {
    score += 20;
    explanation.push('⚠️ URL uses an IP address instead of a domain name');
  }

  if (heuristics.hasSubdomainAbuse) {
    score += 18;
    explanation.push('⚠️ Brand name found in subdomain — classic phishing technique');
  }

  if (!heuristics.hasHttps) {
    score += 10;
    explanation.push('🔓 No HTTPS — connection is not encrypted');
  }

  if (heuristics.isShortened) {
    score += 8;
    explanation.push('🔗 Shortened URL hides the real destination');
  }

  if (heuristics.hasSuspiciousTLD) {
    score += 12;
    explanation.push(`⚠️ Suspicious top-level domain: ${heuristics.tld}`);
  }

  if (heuristics.hasSuspiciousKeywords) {
    const kwScore = Math.min(15, heuristics.suspiciousKeywordsFound.length * 3);
    score += kwScore;
    explanation.push(`⚠️ Suspicious keywords detected: ${heuristics.suspiciousKeywordsFound.slice(0, 3).join(', ')}`);
  }

  if (heuristics.hasSpecialChars) {
    score += 10;
    explanation.push('⚠️ URL contains obfuscated or special characters');
  }

  if (heuristics.hasExcessiveSubdomains) {
    score += 8;
    explanation.push('⚠️ Excessive number of subdomains');
  }

  if (heuristics.isLongDomain) {
    score += 5;
    explanation.push('⚠️ Unusually long domain name');
  }

  // ── Domain age scoring ────────────────────────────────────────────────────────
  if (domainAge !== null && domainAge !== undefined) {
    if (domainAge < 30) {
      score += 15;
      explanation.push(`📅 Very new domain (${domainAge} days old) — high risk`);
    } else if (domainAge < 90) {
      score += 8;
      explanation.push(`📅 Recently registered domain (${domainAge} days old)`);
    } else if (domainAge < 180) {
      score += 3;
    }
  }

  // Cap at 100
  score = Math.min(100, Math.round(score));

  // Determine confidence
  const apisChecked = [googleResult?.checked, virusTotalResult?.checked]
    .filter(Boolean).length;
  const confidence = apisChecked >= 2 ? 'high' : apisChecked === 1 ? 'medium' : 'low';

  // Add positive note if score is low
  if (score < 20 && explanation.length === 0) {
    explanation.push('✅ No threats detected by any security checks');
    explanation.push('✅ URL follows standard safe patterns');
  }

  return { score, explanation, confidence };
}

/**
 * Determine overall status from risk score
 */
function determineStatus(riskScore, googleResult) {
  // Hard overrides from APIs
  if (googleResult?.checked && !googleResult.isSafe) {
    return 'malicious';
  }

  if (riskScore >= 60) return 'malicious';
  if (riskScore >= 30) return 'suspicious';
  return 'safe';
}

module.exports = {
  analyzeUrlHeuristics,
  generateWarnings,
  calculateRiskScore,
  determineStatus,
  extractDomain
};
