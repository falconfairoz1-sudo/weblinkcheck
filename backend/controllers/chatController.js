const { validationResult } = require('express-validator');
const {
  analyzeUrlHeuristics,
  generateWarnings,
  calculateRiskScore,
  determineStatus,
  extractDomain
} = require('../utils/urlAnalyzer');
const { checkGoogleSafeBrowsing } = require('../services/googleSafeBrowsing');
const { checkVirusTotal } = require('../services/virusTotal');

/**
 * POST /api/chat/analyze
 * Analyze a URL and provide AI-powered explanation
 */
async function analyzeForChat(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Please provide a message' });
    }

    // Extract URL from message
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      return res.status(400).json({ 
        error: 'No URL found. Please paste a valid URL starting with http:// or https://' 
      });
    }

    const url = urlMatch[0];

    // Extract domain
    const domain = extractDomain(url);
    if (!domain) {
      return res.status(400).json({ error: 'Could not parse URL. Please enter a valid URL.' });
    }

    // Run all checks in parallel
    const [googleResult, virusTotalResult] = await Promise.allSettled([
      checkGoogleSafeBrowsing(url),
      checkVirusTotal(url)
    ]);

    const google = googleResult.status === 'fulfilled' ? googleResult.value : { checked: false, isSafe: true, threats: [], error: 'Check failed' };
    const virustotal = virusTotalResult.status === 'fulfilled' ? virusTotalResult.value : { checked: false, positives: 0, total: 0, error: 'Check failed' };

    // Heuristic Analysis
    const heuristics = analyzeUrlHeuristics(url);
    const warnings = generateWarnings(heuristics);

    // Risk Score Calculation
    const { score, explanation, confidence } = calculateRiskScore({
      heuristics,
      googleResult: google,
      virusTotalResult: virustotal,
      domainAge: null
    });

    const status = determineStatus(score, google);

    // Generate AI-powered explanation
    const analysis = generateAIAnalysis({
      url,
      domain,
      status,
      score,
      explanation,
      warnings,
      heuristics,
      google,
      virustotal
    });

    return res.json({
      analysis,
      metadata: {
        url,
        domain,
        isSafe: status === 'safe',
        riskScore: score,
        status
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generate AI-powered analysis text
 */
function generateAIAnalysis({ url, domain, status, score, explanation, warnings, heuristics, google, virustotal }) {
  let analysis = '';

  // Safety Assessment
  analysis += `🔍 **Safety Assessment**\n`;
  if (status === 'safe') {
    analysis += `✅ This link appears to be **SAFE**. Risk score: ${score}/100\n\n`;
  } else if (status === 'suspicious') {
    analysis += `⚠️ This link is **SUSPICIOUS**. Risk score: ${score}/100\n\n`;
  } else {
    analysis += `❌ This link is **MALICIOUS**. Risk score: ${score}/100\n\n`;
  }

  // Should You Click?
  analysis += `👆 **Should You Click?**\n`;
  if (status === 'safe') {
    analysis += `Yes, it's safe to click. The link has passed our security checks.\n\n`;
  } else if (status === 'suspicious') {
    analysis += `⚠️ Be cautious. This link has some warning signs. Avoid clicking unless you trust the source.\n\n`;
  } else {
    analysis += `❌ NO - Do not click this link. It's flagged as malicious.\n\n`;
  }

  // What is this site?
  analysis += `🌐 **About This Site**\n`;
  analysis += `Domain: ${domain}\n`;
  analysis += `URL: ${url.substring(0, 60)}${url.length > 60 ? '...' : ''}\n\n`;

  // Threat Details
  if (warnings.length > 0) {
    analysis += `⚠️ **Detected Issues**\n`;
    warnings.slice(0, 5).forEach(warning => {
      analysis += `• ${warning}\n`;
    });
    analysis += '\n';
  }

  // Security Checks
  analysis += `🛡️ **Security Checks**\n`;
  
  if (google.checked) {
    if (google.isSafe) {
      analysis += `✅ Google Safe Browsing: Clean\n`;
    } else {
      analysis += `❌ Google Safe Browsing: Flagged (${google.threats.join(', ')})\n`;
    }
  } else {
    analysis += `⚪ Google Safe Browsing: Not checked\n`;
  }

  if (virustotal.checked) {
    if (virustotal.positives === 0) {
      analysis += `✅ VirusTotal: Clean (${virustotal.total} engines scanned)\n`;
    } else {
      analysis += `⚠️ VirusTotal: ${virustotal.positives}/${virustotal.total} engines flagged\n`;
    }
  } else {
    analysis += `⚪ VirusTotal: Not checked\n`;
  }

  // Heuristic Analysis
  analysis += `\n🧠 **Heuristic Analysis**\n`;
  if (heuristics.hasHttps) {
    analysis += `✅ Uses HTTPS encryption\n`;
  } else {
    analysis += `⚠️ No HTTPS - unencrypted connection\n`;
  }

  if (heuristics.isShortened) {
    analysis += `⚠️ Shortened URL - destination is hidden\n`;
  }

  if (heuristics.isIpBased) {
    analysis += `⚠️ IP-based URL - suspicious\n`;
  }

  if (heuristics.hasSuspiciousKeywords) {
    analysis += `⚠️ Contains suspicious keywords: ${heuristics.suspiciousKeywordsFound.join(', ')}\n`;
  }

  if (heuristics.hasSuspiciousTLD) {
    analysis += `⚠️ Suspicious domain extension\n`;
  }

  if (heuristics.hasSubdomainAbuse) {
    analysis += `⚠️ Suspicious subdomain structure\n`;
  }

  // Confidence
  analysis += `\n📊 **Confidence**: ${Math.round(confidence * 100)}%`;

  return analysis;
}

module.exports = { analyzeForChat };
