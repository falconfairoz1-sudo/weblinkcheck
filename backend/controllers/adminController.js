const User = require('../models/User');
const Scan = require('../models/Scan');

// GET /api/admin/users
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (e) { next(e); }
}

// PUT /api/admin/users/:id
async function updateUser(req, res, next) {
  try {
    const { isActive, role } = req.body;
    const update = {};
    if (isActive !== undefined) update.isActive = isActive;
    if (role && ['user', 'admin'].includes(role)) update.role = role;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) { next(e); }
}

// GET /api/admin/scans
async function getAllScans(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const scans = await Scan.find({})
      .select('url domain status riskScore userId createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await Scan.countDocuments();
    res.json({ scans, total });
  } catch (e) { next(e); }
}

// DELETE /api/admin/scans/:id
async function deleteScan(req, res, next) {
  try {
    const scan = await Scan.findByIdAndDelete(req.params.id);
    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    res.json({ message: 'Scan deleted' });
  } catch (e) { next(e); }
}

module.exports = { getAllUsers, updateUser, getAllScans, deleteScan };
