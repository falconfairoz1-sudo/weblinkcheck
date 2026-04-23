const dns = require('dns').promises;
const axios = require('axios');
const crypto = require('crypto');
const { extractDomain, analyzeUrlHeuristics } = require('../utils/urlAnalyzer');
const Scan = require('../models/Scan');

// ─── Feature 1: SSL Certificate Checker ──────────────────────────────────────
async function checkSSL(req, res, next) {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

    // Use tls module to get certificate info
    const tls = require('tls');
    const net = require('net');

    const result = await new Promise((resolve) => {
      const socket = tls.connect(443, cleanDomain, { servername: cleanDomain, rejectUnauthorized: false }, () => {
        const cert = socket.getPeerCertificate(true);
        const authorized = socket.authorized;
        socket.destroy();

        if (!cert || !cert.subject) {
          resolve({ error: 'Could not retrieve certificate', domain: cleanDomain });
          return;
        }

        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysLeft = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
        const isExpired = now > validTo;
        const isValid = authorized && !isExpired;

        resolve({
          domain: cleanDomain,
          isValid,
          isExpired,
          authorized,
          daysLeft,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
          issuerCN: cert.issuer?.CN || 'Unknown',
          subject: cert.subject?.CN || cleanDomain,
          subjectOrg: cert.subject?.O || null,
          serialNumber: cert.serialNumber || null,
          fingerprint: cert.fingerprint || null,
          protocol: socket.getProtocol?.() || 'TLS',
          cipher: socket.getCipher?.()?.name || 'Unknown',
          altNames: cert.subjectaltname
            ? cert.subjectaltname.replace(/DNS:/g, '').split(', ').slice(0, 10)
            : [],
          grade: isExpired ? 'F' : !authorized ? 'C' : daysLeft < 14 ? 'B' : 'A'
        });
      });

      socket.on('error', () => {
        resolve({ domain: cleanDomain, error: 'No SSL certificate found or connection refused', isValid: false });
      });

      socket.setTimeout(8000, () => {
        socket.destroy();
        resolve({ domain: cleanDomain, error: 'Connection timed out', isValid: false });
      });
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
}

// ─── Feature 2: Email Header Analyzer ────────────────────────────────────────
async function analyzeEmailHeaders(req, res, next) {
  try {
    const { headers } = req.body;
    if (!headers || typeof headers !== 'string') {
      return res.status(400).json({ error: 'Email headers string is required' });
    }

    const lines = headers.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = {};
    let currentKey = '';

    for (const line of lines) {
      if (/^\S/.test(line) && line.includes(':')) {
        const idx = line.indexOf(':');
        currentKey = line.substring(0, idx).trim().toLowerCase();
        parsed[currentKey] = line.substring(idx + 1).trim();
      } else if (currentKey) {
        parsed[currentKey] += ' ' + line;
      }
    }

    // Extract key fields
    const from = parsed['from'] || '';
    const replyTo = parsed['reply-to'] || '';
    const returnPath = parsed['return-path'] || '';
    const receivedSpf = parsed['received-spf'] || '';
    const dkimSignature = parsed['dkim-signature'] || '';
    const dmarcResult = parsed['authentication-results'] || '';
    const xMailer = parsed['x-mailer'] || '';
    const messageId = parsed['message-id'] || '';
    const subject = parsed['subject'] || '';
    const date = parsed['date'] || '';

    // Extract all Received headers for hop analysis
    const receivedHops = lines
      .filter(l => l.toLowerCase().startsWith('received:'))
      .map(l => l.replace(/^received:\s*/i, ''))
      .slice(0, 10);

    // Detect suspicious patterns
    const warnings = [];
    const fromDomain = from.match(/@([\w.-]+)/)?.[1] || '';
    const replyToDomain = replyTo.match(/@([\w.-]+)/)?.[1] || '';
    const returnPathDomain = returnPath.match(/@([\w.-]+)/)?.[1] || '';

    if (replyTo && fromDomain && replyToDomain && fromDomain !== replyToDomain) {
      warnings.push({ type: 'REPLY_TO_MISMATCH', severity: 'high', message: `Reply-To domain (${replyToDomain}) differs from From domain (${fromDomain})` });
    }
    if (returnPath && fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
      warnings.push({ type: 'RETURN_PATH_MISMATCH', severity: 'medium', message: `Return-Path domain differs from From domain` });
    }
    if (receivedSpf && receivedSpf.toLowerCase().includes('fail')) {
      warnings.push({ type: 'SPF_FAIL', severity: 'high', message: 'SPF check failed — sender not authorized' });
    }
    if (!dkimSignature) {
      warnings.push({ type: 'NO_DKIM', severity: 'medium', message: 'No DKIM signature found' });
    }
    if (dmarcResult && dmarcResult.toLowerCase().includes('dmarc=fail')) {
      warnings.push({ type: 'DMARC_FAIL', severity: 'high', message: 'DMARC authentication failed' });
    }
    if (receivedHops.length > 8) {
      warnings.push({ type: 'MANY_HOPS', severity: 'low', message: `Email passed through ${receivedHops.length} servers (unusual)` });
    }

    const spfPass = receivedSpf.toLowerCase().includes('pass');
    const dkimPass = !!dkimSignature && !dmarcResult.toLowerCase().includes('dkim=fail');
    const dmarcPass = !dmarcResult.toLowerCase().includes('dmarc=fail');
    const riskScore = warnings.reduce((s, w) => s + (w.severity === 'high' ? 30 : w.severity === 'medium' ? 15 : 5), 0);

    return res.json({
      from, replyTo, returnPath, subject, date, messageId, xMailer,
      authentication: { spf: spfPass ? 'pass' : receivedSpf ? 'fail' : 'none', dkim: dkimPass ? 'pass' : 'none', dmarc: dmarcPass ? 'pass' : 'fail' },
      receivedHops,
      warnings,
      riskScore: Math.min(riskScore, 100),
      isSuspicious: warnings.some(w => w.severity === 'high'),
      summary: warnings.length === 0 ? 'No suspicious patterns detected' : `${warnings.length} issue(s) found`
    });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 3: Subdomain Finder ─────────────────────────────────────────────
async function findSubdomains(req, res, next) {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
    const commonSubs = ['www', 'mail', 'ftp', 'smtp', 'pop', 'imap', 'webmail', 'admin', 'portal',
      'api', 'dev', 'staging', 'test', 'blog', 'shop', 'store', 'app', 'mobile', 'cdn',
      'static', 'media', 'img', 'images', 'assets', 'docs', 'help', 'support', 'status',
      'vpn', 'remote', 'secure', 'login', 'auth', 'sso', 'dashboard', 'panel', 'cpanel'];

    const results = await Promise.allSettled(
      commonSubs.map(async (sub) => {
        const full = `${sub}.${cleanDomain}`;
        try {
          const addrs = await dns.resolve4(full);
          return { subdomain: full, ip: addrs[0], status: 'active' };
        } catch {
          return null;
        }
      })
    );

    const found = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);

    return res.json({ domain: cleanDomain, found, total: found.length, checked: commonSubs.length });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 4: Network Ping / Reachability ───────────────────────────────────
async function pingHost(req, res, next) {
  try {
    const { host } = req.body;
    if (!host) return res.status(400).json({ error: 'Host is required' });

    const cleanHost = host.replace(/^https?:\/\//, '').split('/')[0];
    const results = [];

    // Try HTTP and HTTPS
    for (const protocol of ['https', 'http']) {
      const start = Date.now();
      try {
        const resp = await axios.get(`${protocol}://${cleanHost}`, {
          timeout: 5000,
          validateStatus: () => true,
          maxRedirects: 3,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LinkGuard/1.0)' }
        });
        results.push({ protocol, status: resp.status, latency: Date.now() - start, reachable: true });
      } catch {
        results.push({ protocol, status: null, latency: Date.now() - start, reachable: false });
      }
    }

    // DNS resolution time
    const dnsStart = Date.now();
    let ipAddress = null;
    try {
      const addrs = await dns.resolve4(cleanHost);
      ipAddress = addrs[0];
    } catch {}
    const dnsLatency = Date.now() - dnsStart;

    const isReachable = results.some(r => r.reachable);
    const bestResult = results.find(r => r.reachable) || results[0];

    return res.json({
      host: cleanHost,
      ipAddress,
      isReachable,
      dnsLatency,
      httpStatus: bestResult?.status,
      latency: bestResult?.latency,
      protocols: results,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 5: Leaked Password Check (k-anonymity via HIBP) ─────────────────
async function checkLeakedPassword(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });

    // k-anonymity: only send first 5 chars of SHA1 hash
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    try {
      const resp = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`, {
        timeout: 5000,
        headers: { 'Add-Padding': 'true', 'User-Agent': 'LinkGuard-Security-Tool' }
      });

      const lines = resp.data.split('\n');
      const match = lines.find(l => l.startsWith(suffix));
      const count = match ? parseInt(match.split(':')[1].trim(), 10) : 0;

      return res.json({
        isLeaked: count > 0,
        count,
        severity: count > 100000 ? 'critical' : count > 10000 ? 'high' : count > 100 ? 'medium' : count > 0 ? 'low' : 'none',
        message: count > 0
          ? `This password has appeared ${count.toLocaleString()} times in data breaches`
          : 'This password was not found in any known data breaches',
        recommendation: count > 0 ? 'Change this password immediately on all sites where it is used' : 'Password not found in breach databases'
      });
    } catch {
      return res.json({ isLeaked: false, count: 0, severity: 'none', message: 'Could not check breach database (service unavailable)', recommendation: 'Try again later' });
    }
  } catch (error) {
    next(error);
  }
}

// ─── Feature 6: Add Note to Scan ─────────────────────────────────────────────
async function addScanNote(req, res, next) {
  try {
    const { scanId, note } = req.body;
    if (!scanId || !note?.trim()) return res.status(400).json({ error: 'scanId and note are required' });
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const scan = await Scan.findById(scanId);
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    if (scan.userId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to annotate this scan' });
    }

    if (!scan.notes) scan.notes = [];
    scan.notes.push({ text: note.trim(), addedAt: new Date(), userId: req.user._id });
    await scan.save();

    return res.json({ notes: scan.notes, message: 'Note added' });
  } catch (error) {
    next(error);
  }
}

async function getScanNotes(req, res, next) {
  try {
    const { scanId } = req.params;
    const scan = await Scan.findById(scanId).select('notes userId');
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    return res.json({ notes: scan.notes || [] });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 7: Activity Heatmap Data ────────────────────────────────────────
async function getActivityHeatmap(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);

    const scans = await Scan.find({ userId: req.user._id, createdAt: { $gte: since } })
      .select('createdAt status')
      .lean();

    // Group by date string
    const map = {};
    for (const scan of scans) {
      const d = new Date(scan.createdAt).toISOString().split('T')[0];
      if (!map[d]) map[d] = { date: d, count: 0, safe: 0, suspicious: 0, malicious: 0 };
      map[d].count++;
      if (scan.status === 'safe') map[d].safe++;
      else if (scan.status === 'suspicious') map[d].suspicious++;
      else if (scan.status === 'malicious') map[d].malicious++;
    }

    const heatmap = Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
    const maxCount = Math.max(...heatmap.map(d => d.count), 1);

    return res.json({ heatmap, maxCount, totalDays: heatmap.length, totalScans: scans.length });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 8: Phishing Quiz Questions ──────────────────────────────────────
async function getPhishingQuiz(req, res, next) {
  try {
    const questions = [
      {
        id: 1,
        question: 'Which of these URLs is most likely a phishing attempt?',
        options: ['https://paypal.com/login', 'https://paypa1.com/login', 'https://www.paypal.com/signin', 'https://paypal.com/account'],
        answer: 1,
        explanation: 'paypa1.com uses the number "1" instead of the letter "l" — a classic typosquatting technique.'
      },
      {
        id: 2,
        question: 'An email says "Your account will be suspended in 24 hours. Click here immediately." What should you do?',
        options: ['Click the link right away', 'Forward to friends', 'Go directly to the website by typing the URL', 'Reply with your credentials'],
        answer: 2,
        explanation: 'Urgency is a key phishing tactic. Always navigate directly to the site instead of clicking email links.'
      },
      {
        id: 3,
        question: 'Which is a sign that a website is secure?',
        options: ['It has a padlock icon and HTTPS', 'It has a professional design', 'It loads quickly', 'It has many pages'],
        answer: 0,
        explanation: 'HTTPS and the padlock icon indicate an encrypted connection, though they don\'t guarantee the site is legitimate.'
      },
      {
        id: 4,
        question: 'You receive a QR code in a flyer promising a free gift. What should you do?',
        options: ['Scan it immediately', 'Use LinkGuard QR Scanner to check it first', 'Share it with friends', 'Ignore it completely'],
        answer: 1,
        explanation: 'QR codes can hide malicious URLs. Always scan them with a security tool before visiting.'
      },
      {
        id: 5,
        question: 'Which password is strongest?',
        options: ['password123', 'P@ssw0rd', 'correct-horse-battery-staple', 'abc123!'],
        answer: 2,
        explanation: 'A long passphrase with random words is harder to crack than short passwords with symbol substitutions.'
      },
      {
        id: 6,
        question: 'What does a shortened URL like bit.ly hide?',
        options: ['The file size', 'The real destination URL', 'The sender\'s identity', 'The email subject'],
        answer: 1,
        explanation: 'Shortened URLs mask the real destination. Use a URL expander to see where they lead before clicking.'
      },
      {
        id: 7,
        question: 'Which is NOT a sign of a phishing email?',
        options: ['Urgent language demanding immediate action', 'Sender email matches the company domain exactly', 'Generic greeting like "Dear Customer"', 'Request for personal information'],
        answer: 1,
        explanation: 'A legitimate sender domain is a good sign. Phishing emails often use lookalike domains or free email services.'
      },
      {
        id: 8,
        question: 'What is "smishing"?',
        options: ['Email phishing', 'Phishing via SMS text messages', 'Voice call phishing', 'Social media phishing'],
        answer: 1,
        explanation: 'Smishing is phishing conducted through SMS text messages, often with fake delivery notifications or bank alerts.'
      }
    ];

    // Shuffle and return 5 random questions
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 5);
    return res.json({ questions: shuffled.map(q => ({ ...q, answer: undefined })), answers: shuffled.map(q => ({ id: q.id, answer: q.answer, explanation: q.explanation })) });
  } catch (error) {
    next(error);
  }
}

async function submitPhishingQuiz(req, res, next) {
  try {
    const { answers } = req.body; // [{ id, answer }]
    if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers array required' });

    const allQuestions = [
      { id: 1, answer: 1 }, { id: 2, answer: 2 }, { id: 3, answer: 0 },
      { id: 4, answer: 1 }, { id: 5, answer: 2 }, { id: 6, answer: 1 },
      { id: 7, answer: 1 }, { id: 8, answer: 1 }
    ];

    let correct = 0;
    const results = answers.map(a => {
      const q = allQuestions.find(q => q.id === a.id);
      const isCorrect = q && q.answer === a.answer;
      if (isCorrect) correct++;
      return { id: a.id, correct: isCorrect, correctAnswer: q?.answer };
    });

    const score = Math.round((correct / answers.length) * 100);
    return res.json({
      score,
      correct,
      total: answers.length,
      results,
      grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'F',
      message: score >= 80 ? 'Excellent! You have strong phishing awareness.' : score >= 60 ? 'Good job! Review the questions you missed.' : 'Keep learning — phishing awareness is critical.'
    });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 9: URL Safety Score History (trend) ─────────────────────────────
async function getScanTrend(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const scans = await Scan.find({ userId: req.user._id, createdAt: { $gte: since } })
      .select('riskScore status createdAt')
      .sort({ createdAt: 1 })
      .lean();

    // Group by day
    const byDay = {};
    for (const scan of scans) {
      const d = new Date(scan.createdAt).toISOString().split('T')[0];
      if (!byDay[d]) byDay[d] = { date: d, count: 0, totalRisk: 0, safe: 0, suspicious: 0, malicious: 0 };
      byDay[d].count++;
      byDay[d].totalRisk += scan.riskScore;
      byDay[d][scan.status]++;
    }

    const trend = Object.values(byDay).map(d => ({
      ...d,
      avgRisk: d.count > 0 ? Math.round(d.totalRisk / d.count) : 0
    }));

    const avgRisk = scans.length > 0 ? Math.round(scans.reduce((s, sc) => s + sc.riskScore, 0) / scans.length) : 0;

    return res.json({ trend, avgRisk, totalScans: scans.length, days });
  } catch (error) {
    next(error);
  }
}

// ─── Feature 10: Bulk Domain Reputation ──────────────────────────────────────
async function bulkDomainReputation(req, res, next) {
  try {
    const { domains } = req.body;
    if (!Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({ error: 'domains array is required' });
    }
    if (domains.length > 20) return res.status(400).json({ error: 'Maximum 20 domains per request' });

    const results = await Promise.allSettled(
      domains.map(async (domain) => {
        const clean = domain.replace(/^https?:\/\//, '').split('/')[0];
        const heuristics = analyzeUrlHeuristics(`https://${clean}`);
        let ipAddress = null;
        let hasMX = false;
        let isReachable = false;

        try { const ips = await dns.resolve4(clean); ipAddress = ips[0]; isReachable = true; } catch {}
        try { const mx = await dns.resolveMx(clean); hasMX = mx.length > 0; } catch {}

        const riskFactors = [];
        if (heuristics.hasSuspiciousTLD) riskFactors.push('Suspicious TLD');
        if (heuristics.hasSpecialChars) riskFactors.push('Special characters');
        if (heuristics.domainLength > 30) riskFactors.push('Very long domain');
        if (!isReachable) riskFactors.push('Not reachable');

        const riskScore = Math.min(riskFactors.length * 20 + (heuristics.hasSuspiciousTLD ? 20 : 0), 100);

        return {
          domain: clean,
          ipAddress,
          isReachable,
          hasMX,
          tld: heuristics.tld,
          isSuspiciousTLD: heuristics.hasSuspiciousTLD,
          riskScore,
          riskFactors,
          status: riskScore >= 60 ? 'suspicious' : riskScore >= 30 ? 'caution' : 'clean'
        };
      })
    );

    const output = results.map((r, i) =>
      r.status === 'fulfilled' ? r.value : { domain: domains[i], error: 'Lookup failed', riskScore: 0 }
    );

    return res.json({ results: output, total: output.length });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkSSL, analyzeEmailHeaders, findSubdomains, pingHost,
  checkLeakedPassword, addScanNote, getScanNotes,
  getActivityHeatmap, getPhishingQuiz, submitPhishingQuiz,
  getScanTrend, bulkDomainReputation
};
