const { validationResult } = require('express-validator');
const NodeCache = require('node-cache');
const Scan = require('../models/Scan');
const { checkGoogleSafeBrowsing } = require('../services/googleSafeBrowsing');
const { checkVirusTotal } = require('../services/virusTotal');
const { sendHighRiskAlert } = require('../services/emailService');
const {
  analyzeUrlHeuristics,
  generateWarnings,
  calculateRiskScore,
  determineStatus,
  extractDomain
} = require('../utils/urlAnalyzer');

// In-memory cache (TTL: 1 hour)
const scanCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * POST /api/scan
 * Main URL scanning endpoint
 */
async function scanUrl(req, res, next) {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    const startTime = Date.now();

    // Check cache first
    const cacheKey = `scan:${url}`;
    const cached = scanCache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Extract domain
    const domain = extractDomain(url);
    if (!domain) {
      return res.status(400).json({ error: 'Could not parse URL. Please enter a valid URL.' });
    }

    // ── Run all checks in parallel ─────────────────────────────────────────────
    const [googleResult, virusTotalResult] = await Promise.allSettled([
      checkGoogleSafeBrowsing(url),
      checkVirusTotal(url)
    ]);

    const google = googleResult.status === 'fulfilled' ? googleResult.value : { checked: false, isSafe: true, threats: [], error: 'Check failed' };
    const virustotal = virusTotalResult.status === 'fulfilled' ? virusTotalResult.value : { checked: false, positives: 0, total: 0, error: 'Check failed' };

    // ── Heuristic Analysis ─────────────────────────────────────────────────────
    const heuristics = analyzeUrlHeuristics(url);
    const warnings = generateWarnings(heuristics);

    // ── Risk Score Calculation ─────────────────────────────────────────────────
    const { score, explanation, confidence } = calculateRiskScore({
      heuristics,
      googleResult: google,
      virusTotalResult: virustotal,
      domainAge: null // WHOIS integration removed
    });

    const status = determineStatus(score, google);
    const scanDuration = Date.now() - startTime;

    // ── Build response ─────────────────────────────────────────────────────────
    const scanResult = {
      url,
      domain,
      status,
      riskScore: score,
      scanDuration,
      googleSafeBrowsing: google,
      virusTotal: virustotal,
      heuristics: {
        isShortened: heuristics.isShortened,
        hasHttps: heuristics.hasHttps,
        isIpBased: heuristics.isIpBased,
        hasSuspiciousKeywords: heuristics.hasSuspiciousKeywords,
        suspiciousKeywordsFound: heuristics.suspiciousKeywordsFound,
        hasSubdomainAbuse: heuristics.hasSubdomainAbuse,
        hasSpecialChars: heuristics.hasSpecialChars,
        hasSuspiciousTLD: heuristics.hasSuspiciousTLD,
        domainLength: heuristics.domainLength,
        pathDepth: heuristics.pathDepth,
        tld: heuristics.tld,
        urlLength: heuristics.urlLength
      },
      sslInfo: {
        hasSSL: heuristics.hasHttps
      },
      warnings,
      aiAnalysis: {
        phishingProbability: score,
        explanation,
        confidence
      },
      scannedAt: new Date().toISOString()
    };

    // ── Save to DB ─────────────────────────────────────────────────────────────
    try {
      const scan = new Scan({
        url,
        domain,
        status,
        riskScore: score,
        googleSafeBrowsing: google,
        virusTotal: virustotal,
        heuristics: scanResult.heuristics,
        sslInfo: scanResult.sslInfo,
        warnings,
        aiAnalysis: { phishingProbability: score, explanation, confidence },
        userId: req.user?._id || null,
        ipAddress: req.ip,
        scanDuration
      });
      await scan.save();
      scanResult.scanId = scan._id;

      // Increment user's totalScans counter
      if (req.user?._id) {
        const User = require('../models/User');
        User.findByIdAndUpdate(req.user._id, { $inc: { totalScans: 1 } }).catch(err =>
          console.error('totalScans increment error:', err)
        );
      }

      // Send high-risk alert email if authenticated and score is high
      if (req.user && score >= 70) {
        sendHighRiskAlert(req.user, scan).catch(err => 
          console.error('High-risk alert email error:', err)
        );
      }
    } catch (dbError) {
      console.error('DB save error:', dbError.message);
      // Don't fail the request if DB save fails
    }

    // Cache the result
    scanCache.set(cacheKey, scanResult);

    return res.json(scanResult);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/scan/bulk
 * Bulk URL scanning (up to 10 URLs)
 */
async function bulkScanUrls(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of URLs' });
    }

    if (urls.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 URLs per bulk scan' });
    }

    // Process sequentially to avoid rate limiting
    const results = [];
    for (const url of urls) {
      try {
        const domain = extractDomain(url);
        if (!domain) {
          results.push({ url, error: 'Invalid URL', status: 'error' });
          continue;
        }

        const heuristics = analyzeUrlHeuristics(url);
        const warnings = generateWarnings(heuristics);
        const { score, explanation, confidence } = calculateRiskScore({
          heuristics,
          googleResult: null,
          virusTotalResult: null,
          domainAge: null
        });

        results.push({
          url,
          domain,
          status: determineStatus(score, null),
          riskScore: score,
          warnings: warnings.slice(0, 3),
          aiAnalysis: { phishingProbability: score, explanation: explanation.slice(0, 2), confidence }
        });
      } catch {
        results.push({ url, error: 'Scan failed', status: 'error' });
      }
    }

    return res.json({ results, total: results.length });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/scan/stats
 * Get scanning statistics
 */
async function getScanStats(req, res, next) {
  try {
    const [total, safe, suspicious, malicious, recent] = await Promise.all([
      Scan.countDocuments(),
      Scan.countDocuments({ status: 'safe' }),
      Scan.countDocuments({ status: 'suspicious' }),
      Scan.countDocuments({ status: 'malicious' }),
      Scan.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
    ]);

    res.json({ total, safe, suspicious, malicious, recentScans24h: recent });
  } catch (error) {
    next(error);
  }
}

module.exports = { scanUrl, bulkScanUrls, getScanStats };
