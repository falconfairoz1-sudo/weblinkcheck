const Monitor = require('../models/Monitor');
const { analyzeUrlHeuristics, calculateRiskScore } = require('../utils/urlAnalyzer');
const { checkGoogleSafeBrowsing } = require('../services/googleSafeBrowsing');
const { checkVirusTotal } = require('../services/virusTotal');
const { sendEmail } = require('../services/emailService');

/**
 * Add URL to monitoring list
 */
exports.addMonitor = async (req, res) => {
  try {
    const { url, checkInterval = 'daily', notifyOnChange = true } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Check if already monitoring
    const existing = await Monitor.findOne({ user: req.user.id, url, isActive: true });
    if (existing) {
      return res.status(400).json({ error: 'URL is already being monitored' });
    }

    // Perform initial scan
    const heuristics = analyzeUrlHeuristics(url);
    const googleResult = await checkGoogleSafeBrowsing(url);
    const virusTotalResult = await checkVirusTotal(url);

    const { score: riskScore } = calculateRiskScore({
      heuristics,
      googleResult,
      virusTotalResult,
      domainAge: null
    });

    const monitor = new Monitor({
      user: req.user.id,
      url,
      checkInterval,
      notifyOnChange,
      lastRiskScore: Math.min(riskScore, 100),
      lastStatus: riskScore < 30 ? 'safe' : riskScore < 70 ? 'suspicious' : 'dangerous',
      lastChecked: new Date(),
      checksPerformed: 1
    });

    await monitor.save();

    res.status(201).json({
      message: 'URL added to monitoring',
      monitor
    });
  } catch (error) {
    console.error('Add monitor error:', error);
    res.status(500).json({ error: 'Failed to add monitor' });
  }
};

/**
 * Get all monitors for user
 */
exports.getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find({ user: req.user.id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({ monitors });
  } catch (error) {
    console.error('Get monitors error:', error);
    res.status(500).json({ error: 'Failed to fetch monitors' });
  }
};

/**
 * Delete monitor
 */
exports.deleteMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!monitor) {
      return res.status(404).json({ error: 'Monitor not found' });
    }

    res.json({ message: 'Monitor removed' });
  } catch (error) {
    console.error('Delete monitor error:', error);
    res.status(500).json({ error: 'Failed to delete monitor' });
  }
};

/**
 * Check all active monitors (called by cron job)
 */
exports.checkMonitors = async () => {
  try {
    const monitors = await Monitor.find({ isActive: true }).populate('user');

    for (const monitor of monitors) {
      // Check if it's time to scan based on interval
      const hoursSinceLastCheck = (Date.now() - monitor.lastChecked) / (1000 * 60 * 60);
      const shouldCheck = 
        (monitor.checkInterval === 'hourly' && hoursSinceLastCheck >= 1) ||
        (monitor.checkInterval === 'daily' && hoursSinceLastCheck >= 24) ||
        (monitor.checkInterval === 'weekly' && hoursSinceLastCheck >= 168);

      if (!shouldCheck) continue;

      // Perform scan
      const heuristics = analyzeUrlHeuristics(monitor.url);
      const googleResult = await checkGoogleSafeBrowsing(monitor.url);
      const virusTotalResult = await checkVirusTotal(monitor.url);

      const { score: riskScore } = calculateRiskScore({
        heuristics,
        googleResult,
        virusTotalResult,
        domainAge: null
      });

      const newStatus = riskScore < 30 ? 'safe' : riskScore < 70 ? 'suspicious' : 'dangerous';
      const statusChanged = newStatus !== monitor.lastStatus;
      const riskIncreased = riskScore > monitor.lastRiskScore + 10;

      // Update monitor
      monitor.lastRiskScore = Math.min(riskScore, 100);
      monitor.lastStatus = newStatus;
      monitor.lastChecked = new Date();
      monitor.checksPerformed += 1;

      if (statusChanged || riskIncreased) {
        monitor.statusChanges.push({
          previousStatus: monitor.lastStatus,
          newStatus,
          previousRiskScore: monitor.lastRiskScore,
          newRiskScore: riskScore,
          changedAt: new Date()
        });
      }

      await monitor.save();

      // Send notification if status changed
      if (monitor.notifyOnChange && (statusChanged || riskIncreased)) {
        await sendEmail({
          to: monitor.user.email,
          subject: `⚠️ URL Status Alert: ${monitor.url}`,
          html: `
            <h2>URL Monitoring Alert</h2>
            <p>The status of a monitored URL has changed:</p>
            <p><strong>URL:</strong> ${monitor.url}</p>
            <p><strong>Previous Status:</strong> ${monitor.lastStatus} (Risk: ${monitor.lastRiskScore})</p>
            <p><strong>New Status:</strong> ${newStatus} (Risk: ${riskScore})</p>
            <p><strong>Change:</strong> ${statusChanged ? 'Status changed' : 'Risk increased significantly'}</p>
            <p>Please review this URL immediately if it's still in use.</p>
          `
        });
      }
    }

    console.log(`✅ Checked ${monitors.length} monitors`);
  } catch (error) {
    console.error('Monitor check error:', error);
  }
};
