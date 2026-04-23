const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
  type: String,
  message: String,
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] }
}, { _id: false });

const scanSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048
    },
    domain: { type: String, trim: true },
    status: {
      type: String,
      enum: ['safe', 'suspicious', 'malicious', 'error'],
      required: true
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    // API Results
    googleSafeBrowsing: {
      checked: { type: Boolean, default: false },
      isSafe: { type: Boolean, default: true },
      threats: [String],
      error: String
    },
    virusTotal: {
      checked: { type: Boolean, default: false },
      positives: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      scanId: String,
      error: String
    },
    // Heuristic Analysis
    heuristics: {
      isShortened: { type: Boolean, default: false },
      hasHttps: { type: Boolean, default: false },
      isIpBased: { type: Boolean, default: false },
      hasSuspiciousKeywords: { type: Boolean, default: false },
      suspiciousKeywordsFound: [String],
      hasSubdomainAbuse: { type: Boolean, default: false },
      hasSpecialChars: { type: Boolean, default: false },
      domainLength: Number,
      pathDepth: Number,
      tld: String
    },
    // Domain Info
    domainInfo: {
      registrationDate: Date,
      expirationDate: Date,
      registrar: String,
      country: String,
      ageInDays: Number,
      isNewDomain: { type: Boolean, default: false }
    },
    // SSL Info
    sslInfo: {
      hasSSL: { type: Boolean, default: false },
      issuer: String,
      validFrom: Date,
      validTo: Date,
      isExpired: { type: Boolean, default: false }
    },
    warnings: [warningSchema],
    aiAnalysis: {
      phishingProbability: { type: Number, min: 0, max: 100 },
      explanation: [String],
      confidence: { type: String, enum: ['low', 'medium', 'high'] }
    },
    communityVotes: {
      safe: { type: Number, default: 0 },
      unsafe: { type: Number, default: 0 }
    },
    // User association (optional)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    ipAddress: String,
    scanDuration: Number // ms
  },
  {
    timestamps: true
  }
);

// Index for faster queries
scanSchema.index({ url: 1, createdAt: -1 });
scanSchema.index({ userId: 1, createdAt: -1 });
scanSchema.index({ status: 1 });
scanSchema.index({ domain: 1 });

module.exports = mongoose.model('Scan', scanSchema);
