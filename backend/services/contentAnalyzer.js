/**
 * AI Content Analyzer Service
 * Detects scam messages, crypto fraud, and job scams
 */

// Scam patterns and keywords
const SCAM_PATTERNS = {
  CRYPTO_FRAUD: {
    keywords: [
      'bitcoin', 'ethereum', 'crypto', 'cryptocurrency', 'blockchain',
      'wallet', 'private key', 'seed phrase', 'mining', 'token',
      'coin', 'defi', 'nft', 'web3', 'metaverse'
    ],
    scamIndicators: [
      'guaranteed returns', 'guaranteed profit', 'risk-free',
      'double your money', 'triple your investment', 'passive income',
      'get rich quick', 'easy money', 'no risk', 'sure profit',
      'limited time offer', 'act now', 'hurry', 'exclusive opportunity',
      'send crypto', 'transfer funds', 'verify wallet', 'confirm identity',
      'click here', 'verify account', 'update payment', 'confirm transaction'
    ],
    urgencyWords: [
      'urgent', 'immediately', 'asap', 'right now', 'today only',
      'limited time', 'expires', 'deadline', 'hurry', 'act fast',
      'don\'t miss', 'last chance', 'final offer'
    ]
  },
  JOB_SCAMS: {
    keywords: [
      'work from home', 'remote job', 'easy money', 'quick cash',
      'part-time', 'flexible hours', 'no experience', 'hiring',
      'employment', 'job opportunity', 'position', 'vacancy'
    ],
    scamIndicators: [
      'no experience needed', 'no qualifications', 'guaranteed job',
      'guaranteed income', 'easy work', 'minimal effort', 'high pay',
      'send money', 'upfront payment', 'processing fee', 'registration fee',
      'deposit required', 'buy starter kit', 'purchase materials',
      'verify identity', 'confirm details', 'update information'
    ],
    urgencyWords: [
      'urgent hiring', 'immediate start', 'asap', 'limited positions',
      'apply now', 'don\'t miss', 'last chance', 'hurry'
    ]
  },
  GENERAL_SCAMS: {
    keywords: [
      'congratulations', 'winner', 'claim', 'prize', 'reward',
      'inheritance', 'refund', 'tax', 'bank', 'account',
      'verify', 'confirm', 'update', 'urgent action'
    ],
    scamIndicators: [
      'click here', 'verify now', 'confirm identity', 'update payment',
      'verify account', 'confirm details', 'act now', 'urgent',
      'send money', 'wire transfer', 'gift card', 'payment required',
      'personal information', 'credit card', 'bank details', 'ssn'
    ],
    urgencyWords: [
      'urgent', 'immediately', 'asap', 'right now', 'today',
      'limited time', 'expires', 'deadline', 'hurry', 'act fast'
    ]
  }
};

/**
 * Analyze content for scams
 */
function analyzeContent(text) {
  if (!text || typeof text !== 'string') {
    return {
      isScam: false,
      riskScore: 0,
      scamType: 'none',
      indicators: [],
      confidence: 0
    };
  }

  const lowerText = text.toLowerCase();
  const results = {
    cryptoFraud: analyzeCryptoFraud(lowerText),
    jobScam: analyzeJobScam(lowerText),
    generalScam: analyzeGeneralScam(lowerText)
  };

  // Determine overall risk
  const maxScore = Math.max(
    results.cryptoFraud.score,
    results.jobScam.score,
    results.generalScam.score
  );

  let scamType = 'none';
  if (results.cryptoFraud.score === maxScore && maxScore > 0) {
    scamType = 'crypto_fraud';
  } else if (results.jobScam.score === maxScore && maxScore > 0) {
    scamType = 'job_scam';
  } else if (results.generalScam.score === maxScore && maxScore > 0) {
    scamType = 'general_scam';
  }

  const allIndicators = [
    ...results.cryptoFraud.indicators,
    ...results.jobScam.indicators,
    ...results.generalScam.indicators
  ];

  return {
    isScam: maxScore >= 50,
    riskScore: Math.min(100, maxScore),
    scamType,
    indicators: [...new Set(allIndicators)],
    confidence: calculateConfidence(maxScore, allIndicators.length),
    details: {
      cryptoFraud: results.cryptoFraud,
      jobScam: results.jobScam,
      generalScam: results.generalScam
    }
  };
}

/**
 * Analyze for crypto fraud
 */
function analyzeCryptoFraud(text) {
  let score = 0;
  const indicators = [];

  // Check for crypto keywords
  const cryptoKeywordCount = SCAM_PATTERNS.CRYPTO_FRAUD.keywords.filter(
    kw => text.includes(kw)
  ).length;

  if (cryptoKeywordCount > 0) {
    score += cryptoKeywordCount * 5;
  }

  // Check for scam indicators
  const scamIndicatorCount = SCAM_PATTERNS.CRYPTO_FRAUD.scamIndicators.filter(
    indicator => text.includes(indicator)
  ).length;

  if (scamIndicatorCount > 0) {
    score += scamIndicatorCount * 10;
    indicators.push(...SCAM_PATTERNS.CRYPTO_FRAUD.scamIndicators.filter(
      indicator => text.includes(indicator)
    ));
  }

  // Check for urgency words
  const urgencyCount = SCAM_PATTERNS.CRYPTO_FRAUD.urgencyWords.filter(
    word => text.includes(word)
  ).length;

  if (urgencyCount > 0) {
    score += urgencyCount * 8;
    indicators.push(...SCAM_PATTERNS.CRYPTO_FRAUD.urgencyWords.filter(
      word => text.includes(word)
    ));
  }

  // Check for suspicious patterns
  if (text.includes('send') && (text.includes('bitcoin') || text.includes('ethereum'))) {
    score += 20;
    indicators.push('send crypto request');
  }

  if (text.includes('private key') || text.includes('seed phrase')) {
    score += 25;
    indicators.push('private key request');
  }

  if (text.includes('verify wallet') || text.includes('confirm wallet')) {
    score += 20;
    indicators.push('wallet verification request');
  }

  return {
    score: Math.min(100, score),
    indicators: [...new Set(indicators)]
  };
}

/**
 * Analyze for job scams
 */
function analyzeJobScam(text) {
  let score = 0;
  const indicators = [];

  // Check for job keywords
  const jobKeywordCount = SCAM_PATTERNS.JOB_SCAMS.keywords.filter(
    kw => text.includes(kw)
  ).length;

  if (jobKeywordCount > 0) {
    score += jobKeywordCount * 5;
  }

  // Check for scam indicators
  const scamIndicatorCount = SCAM_PATTERNS.JOB_SCAMS.scamIndicators.filter(
    indicator => text.includes(indicator)
  ).length;

  if (scamIndicatorCount > 0) {
    score += scamIndicatorCount * 12;
    indicators.push(...SCAM_PATTERNS.JOB_SCAMS.scamIndicators.filter(
      indicator => text.includes(indicator)
    ));
  }

  // Check for urgency words
  const urgencyCount = SCAM_PATTERNS.JOB_SCAMS.urgencyWords.filter(
    word => text.includes(word)
  ).length;

  if (urgencyCount > 0) {
    score += urgencyCount * 8;
    indicators.push(...SCAM_PATTERNS.JOB_SCAMS.urgencyWords.filter(
      word => text.includes(word)
    ));
  }

  // Check for suspicious patterns
  if (text.includes('no experience') && text.includes('high pay')) {
    score += 20;
    indicators.push('unrealistic job offer');
  }

  if (text.includes('upfront payment') || text.includes('processing fee')) {
    score += 25;
    indicators.push('upfront payment required');
  }

  if (text.includes('starter kit') || text.includes('buy materials')) {
    score += 20;
    indicators.push('material purchase required');
  }

  return {
    score: Math.min(100, score),
    indicators: [...new Set(indicators)]
  };
}

/**
 * Analyze for general scams
 */
function analyzeGeneralScam(text) {
  let score = 0;
  const indicators = [];

  // Check for scam keywords
  const scamKeywordCount = SCAM_PATTERNS.GENERAL_SCAMS.keywords.filter(
    kw => text.includes(kw)
  ).length;

  if (scamKeywordCount > 0) {
    score += scamKeywordCount * 4;
  }

  // Check for scam indicators
  const scamIndicatorCount = SCAM_PATTERNS.GENERAL_SCAMS.scamIndicators.filter(
    indicator => text.includes(indicator)
  ).length;

  if (scamIndicatorCount > 0) {
    score += scamIndicatorCount * 10;
    indicators.push(...SCAM_PATTERNS.GENERAL_SCAMS.scamIndicators.filter(
      indicator => text.includes(indicator)
    ));
  }

  // Check for urgency words
  const urgencyCount = SCAM_PATTERNS.GENERAL_SCAMS.urgencyWords.filter(
    word => text.includes(word)
  ).length;

  if (urgencyCount > 0) {
    score += urgencyCount * 8;
    indicators.push(...SCAM_PATTERNS.GENERAL_SCAMS.urgencyWords.filter(
      word => text.includes(word)
    ));
  }

  // Check for suspicious patterns
  if (text.includes('click here') && text.includes('verify')) {
    score += 15;
    indicators.push('suspicious link request');
  }

  if (text.includes('personal information') || text.includes('credit card')) {
    score += 20;
    indicators.push('personal data request');
  }

  return {
    score: Math.min(100, score),
    indicators: [...new Set(indicators)]
  };
}

/**
 * Calculate confidence level
 */
function calculateConfidence(score, indicatorCount) {
  if (score === 0) return 0;
  if (indicatorCount === 0) return 0.3;
  if (indicatorCount < 3) return 0.5;
  if (indicatorCount < 6) return 0.7;
  return 0.9;
}

module.exports = {
  analyzeContent
};
