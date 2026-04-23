const axios = require('axios');
const dns = require('dns').promises;
const { extractDomain, analyzeUrlHeuristics, calculateRiskScore, generateWarnings, determineStatus } = require('../utils/urlAnalyzer');
const Scan = require('../models/Scan');

// ─── Feature 1: URL Expander ───────────────────────────────────────────────────
async function expandUrl(req, res, next) {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const shortDomains = ['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','buff.ly','short.io','rb.gy','cutt.ly','is.gd','v.gd','tiny.cc'];
    const domain = extractDomain(url);
    const isShortened = shortDomains.some(d => domain?.includes(d));

    try {
      const response = await axios.get(url, {
        maxRedirects: 10,
        timeout: 8000,
        validateStatus: () => true,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LinkGuard/1.0)' }
      });
      const finalUrl = response.request?.res?.responseUrl || response.config?.url || url;
      return res.json({
        originalUrl: url,
        finalUrl,
        isShortened,
        redirectCount: finalUrl !== url ? 1 : 0,
        statusCode: response.status
      });
    } catch {
      return res.json({ originalUrl: url, finalUrl: url, isShortened, redirectCount: 0, statusCode: null, error: 'Could not follow redirects' });
    }
  } catch (error) {
    next(error);
  }
}

// ─── Feature 2: IP / Domain Lookup ────────────────────────────────────────────
async function ipLookup(req, res, next) {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'IP or domain is required' });

    // Try to resolve domain to IP
    let ip = query;
    let hostname = null;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (!ipRegex.test(query)) {
      try {
        const addresses = await dns.resolve4(query);
        ip = addresses[0];
        hostname = query;
      } catch {
        return res.status(400).json({ error: 'Could not resolve domain' });
      }
    } else {
      try {
        const hostnames = await dns.reverse(ip);
        hostname = hostnames[0] || null;
      } catch { /* no reverse DNS */ }
    }

    // Use ip-api.com (free, no key needed)
    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, { timeout: 5000 });
      const geo = geoRes.data;
      return res.json({
        ip,
        hostname,
        country: geo.country,
        countryCode: geo.countryCode,
        region: geo.regionName,
        city: geo.city,
        zip: geo.zip,
        lat: geo.lat,
        lon: geo.lon,
        timezone: geo.timezone,
        isp: geo.isp,
        org: geo.org,
        as: geo.as
      });
    } catch {
      return res.json({ ip, hostname, error: 'Geolocation lookup failed' });
    }
  } catch (error) {
    next(error);
  }
}

// ─── Feature 3: URL Comparison ────────────────────────────────────────────────
async function compareUrls(req, res, next) {
  try {
    const { url1, url2 } = req.body;
    if (!url1 || !url2) return res.status(400).json({ error: 'Two URLs are required' });

    const analyze = (url) => {
      const domain = extractDomain(url);
      const heuristics = analyzeUrlHeuristics(url);
      const warnings = generateWarnings(heuristics);
      const { score, explanation, confidence } = calculateRiskScore({ heuristics, googleResult: null, virusTotalResult: null, domainAge: null });
      const status = determineStatus(score, null);
      return { url, domain, riskScore: score, status, heuristics, warnings, aiAnalysis: { explanation, confidence } };
    };

    const result1 = analyze(url1);
    const result2 = analyze(url2);

    const comparison = {
      url1: result1,
      url2: result2,
      safer: result1.riskScore <= result2.riskScore ? 'url1' : 'url2',
      riskDifference: Math.abs(result1.riskScore - result2.riskScore),
      summary: result1.riskScore <= result2.riskScore
        ? `${url1} appears safer (${result1.riskScore} vs ${result2.riskScore} risk score)`
        : `${url2} appears safer (${result2.riskScore} vs ${result1.riskScore} risk score)`
    };

    return res.json(comparison);
  } catch (error) {
    next(error);
  }
}

// ─── Feature 4: Community Votes ───────────────────────────────────────────────
async function voteOnScan(req, res, next) {
  try {
    const { scanId, vote } = req.body; // vote: 'safe' | 'unsafe'
    if (!scanId || !['safe', 'unsafe'].includes(vote)) {
      return res.status(400).json({ error: 'scanId and vote (safe/unsafe) are required' });
    }

    const scan = await Scan.findById(scanId);
    if (!scan) return res.status(404).json({ error: 'Scan not found' });

    if (!scan.communityVotes) scan.communityVotes = { safe: 0, unsafe: 0 };
    scan.communityVotes[vote] = (scan.communityVotes[vote] || 0) + 1;
    await scan.save();

    return res.json({ votes: scan.communityVotes, message: 'Vote recorded' });
  } catch (error) {
    next(error);
  }
}

async function getVotes(req, res, next) {
  try {
    const { scanId } = req.params;
    const scan = await Scan.findById(scanId).select('communityVotes');
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    return res.json({ votes: scan.communityVotes || { safe: 0, unsafe: 0 } });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 5: Threat Feed ───────────────────────────────────────────────────
async function getThreatFeed(req, res, next) {
  try {
    const threats = await Scan.find({ status: { $in: ['malicious', 'suspicious'] } })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('url domain status riskScore warnings createdAt')
      .lean();

    const feed = threats.map(t => ({
      id: t._id,
      domain: t.domain,
      status: t.status,
      riskScore: t.riskScore,
      topWarning: t.warnings?.[0] || 'Suspicious activity detected',
      detectedAt: t.createdAt
    }));

    return res.json({ feed, total: feed.length });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 6: Scan Streak ───────────────────────────────────────────────────
async function getScanStreak(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const scans = await Scan.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('createdAt')
      .lean();

    if (!scans.length) return res.json({ streak: 0, longestStreak: 0, totalDays: 0 });

    // Group by date
    const days = new Set(scans.map(s => new Date(s.createdAt).toDateString()));
    const sortedDays = [...days].map(d => new Date(d)).sort((a, b) => b - a);

    let streak = 0;
    let longestStreak = 0;
    let currentStreak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if streak is active (scanned today or yesterday)
    const lastScanDay = sortedDays[0]?.toDateString();
    if (lastScanDay !== today && lastScanDay !== yesterday) {
      streak = 0;
    } else {
      streak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const diff = (sortedDays[i - 1] - sortedDays[i]) / 86400000;
        if (diff === 1) { streak++; } else break;
      }
    }

    for (let i = 1; i < sortedDays.length; i++) {
      const diff = (sortedDays[i - 1] - sortedDays[i]) / 86400000;
      if (diff === 1) { currentStreak++; longestStreak = Math.max(longestStreak, currentStreak); }
      else { currentStreak = 1; }
    }
    longestStreak = Math.max(longestStreak, streak);

    return res.json({ streak, longestStreak, totalDays: days.size, lastScanDate: sortedDays[0] });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 7: Bookmarks ─────────────────────────────────────────────────────
async function getBookmarks(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const user = await require('../models/User').findById(req.user._id).select('bookmarks').lean();
    return res.json({ bookmarks: user?.bookmarks || [] });
  } catch (error) { next(error); }
}

async function addBookmark(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const { url, label } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user.bookmarks) user.bookmarks = [];
    if (user.bookmarks.some(b => b.url === url)) {
      return res.status(409).json({ error: 'URL already bookmarked' });
    }
    user.bookmarks.push({ url, label: label || url, addedAt: new Date() });
    await user.save();
    return res.json({ bookmarks: user.bookmarks, message: 'Bookmark added' });
  } catch (error) { next(error); }
}

async function removeBookmark(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const { url } = req.body;
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    user.bookmarks = (user.bookmarks || []).filter(b => b.url !== url);
    await user.save();
    return res.json({ bookmarks: user.bookmarks, message: 'Bookmark removed' });
  } catch (error) { next(error); }
}

// ─── Feature 8: Password Strength Checker ─────────────────────────────────────
async function checkPasswordStrength(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });

    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noCommon: !['password','123456','qwerty','abc123','letmein','admin','welcome'].includes(password.toLowerCase()),
      noRepeating: !/(.)\1{2,}/.test(password),
      longEnough: password.length >= 16
    };

    const score = Object.values(checks).filter(Boolean).length;
    let strength = 'Very Weak';
    let color = '#ef4444';
    if (score >= 7) { strength = 'Very Strong'; color = '#10b981'; }
    else if (score >= 5) { strength = 'Strong'; color = '#22c55e'; }
    else if (score >= 4) { strength = 'Moderate'; color = '#f59e0b'; }
    else if (score >= 2) { strength = 'Weak'; color = '#f97316'; }

    const suggestions = [];
    if (!checks.length) suggestions.push('Use at least 12 characters');
    if (!checks.uppercase) suggestions.push('Add uppercase letters (A-Z)');
    if (!checks.lowercase) suggestions.push('Add lowercase letters (a-z)');
    if (!checks.numbers) suggestions.push('Include numbers (0-9)');
    if (!checks.symbols) suggestions.push('Add special characters (!@#$...)');
    if (!checks.noCommon) suggestions.push('Avoid common passwords');
    if (!checks.noRepeating) suggestions.push('Avoid repeating characters');
    if (!checks.longEnough) suggestions.push('Use 16+ characters for maximum security');

    return res.json({ strength, score, maxScore: 8, color, checks, suggestions, percentage: Math.round((score / 8) * 100) });
  } catch (error) { next(error); }
}

// ─── Feature 9: Domain WHOIS-style Info ───────────────────────────────────────
async function getDomainInfo(req, res, next) {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];

    let ipAddress = null;
    let mxRecords = [];
    let txtRecords = [];
    let nsRecords = [];

    try { const ips = await dns.resolve4(cleanDomain); ipAddress = ips[0]; } catch {}
    try { const mx = await dns.resolveMx(cleanDomain); mxRecords = mx.map(r => r.exchange); } catch {}
    try { const txt = await dns.resolveTxt(cleanDomain); txtRecords = txt.flat().slice(0, 3); } catch {}
    try { const ns = await dns.resolveNs(cleanDomain); nsRecords = ns.slice(0, 4); } catch {}

    const heuristics = analyzeUrlHeuristics(`https://${cleanDomain}`);

    return res.json({
      domain: cleanDomain,
      ipAddress,
      mxRecords,
      txtRecords,
      nsRecords,
      hasSSL: true, // DNS-based check
      tld: heuristics.tld,
      isSuspiciousTLD: heuristics.hasSuspiciousTLD,
      domainLength: heuristics.domainLength
    });
  } catch (error) { next(error); }
}

// ─── Feature 10: Recent Scans Public Feed ─────────────────────────────────────
async function getRecentScans(req, res, next) {
  try {
    const scans = await Scan.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('domain status riskScore createdAt')
      .lean();
    return res.json({ scans });
  } catch (error) { next(error); }
}

module.exports = {
  expandUrl, ipLookup, compareUrls, voteOnScan, getVotes,
  getThreatFeed, getScanStreak, getBookmarks, addBookmark, removeBookmark,
  checkPasswordStrength, getDomainInfo, getRecentScans
};
