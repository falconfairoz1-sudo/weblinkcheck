const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  checkInterval: {
    type: String,
    enum: ['hourly', 'daily', 'weekly'],
    default: 'daily'
  },
  notifyOnChange: {
    type: Boolean,
    default: true
  },
  lastRiskScore: {
    type: Number,
    default: 0
  },
  lastStatus: {
    type: String,
    enum: ['safe', 'suspicious', 'dangerous'],
    default: 'safe'
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  checksPerformed: {
    type: Number,
    default: 0
  },
  statusChanges: [{
    previousStatus: String,
    newStatus: String,
    previousRiskScore: Number,
    newRiskScore: Number,
    changedAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
monitorSchema.index({ user: 1, isActive: 1 });
monitorSchema.index({ lastChecked: 1, isActive: 1 });

module.exports = mongoose.model('Monitor', monitorSchema);
