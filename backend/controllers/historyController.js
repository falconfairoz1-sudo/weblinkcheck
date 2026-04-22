const Scan = require('../models/Scan');

/**
 * GET /api/history
 * Get scan history (public recent scans or user-specific)
 */
async function getHistory(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    // Build query
    const query = {};

    // If authenticated, show user's scans; otherwise show recent public scans
    if (req.user) {
      query.userId = req.user._id;
    }

    if (status && ['safe', 'suspicious', 'malicious'].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.url = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }

    const [scans, total] = await Promise.all([
      Scan.find(query)
        .select('url domain status riskScore warnings createdAt scanDuration aiAnalysis.phishingProbability')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Scan.countDocuments(query)
    ]);

    res.json({
      scans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history/:id
 * Get a specific scan by ID
 */
async function getScanById(req, res, next) {
  try {
    const scan = await Scan.findById(req.params.id).lean();
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }
    res.json(scan);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/history/:id
 * Delete a scan (user must own it)
 */
async function deleteScan(req, res, next) {
  try {
    const query = { _id: req.params.id };
    if (req.user?.role !== 'admin') {
      query.userId = req.user._id;
    }

    const scan = await Scan.findOneAndDelete(query);
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found or unauthorized' });
    }

    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/history/clear
 * Clear all history for the authenticated user
 */
async function clearHistory(req, res, next) {
  try {
    const result = await Scan.deleteMany({ userId: req.user._id });
    res.json({ message: `Deleted ${result.deletedCount} scans` });
  } catch (error) {
    next(error);
  }
}

module.exports = { getHistory, getScanById, deleteScan, clearHistory };