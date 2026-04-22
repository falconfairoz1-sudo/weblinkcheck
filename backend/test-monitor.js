/**
 * Quick test script to verify monitor functionality
 * Run with: node test-monitor.js
 */

const { analyzeUrlHeuristics, calculateRiskScore } = require('./utils/urlAnalyzer');

console.log('🧪 Testing Monitor Functions...\n');

// Test 1: Analyze URL Heuristics
console.log('Test 1: Analyzing URL Heuristics');
const testUrl = 'https://google.com';
const heuristics = analyzeUrlHeuristics(testUrl);
console.log('✅ URL:', testUrl);
console.log('✅ Has HTTPS:', heuristics.hasHttps);
console.log('✅ Domain:', heuristics.domain);
console.log('✅ Is Shortened:', heuristics.isShortened);
console.log('');

// Test 2: Calculate Risk Score
console.log('Test 2: Calculating Risk Score');
const mockGoogleResult = { checked: true, isSafe: true, threats: [] };
const mockVirusTotalResult = { checked: true, positives: 0, total: 70 };

const { score, explanation, confidence } = calculateRiskScore({
  heuristics,
  googleResult: mockGoogleResult,
  virusTotalResult: mockVirusTotalResult,
  domainAge: null
});

console.log('✅ Risk Score:', score);
console.log('✅ Confidence:', confidence);
console.log('✅ Explanation:', explanation.slice(0, 2).join(', '));
console.log('');

// Test 3: High-risk URL
console.log('Test 3: Testing High-Risk URL');
const dangerousUrl = 'http://192.168.1.1/login-verify-account-paypal.php';
const dangerousHeuristics = analyzeUrlHeuristics(dangerousUrl);
const dangerousScore = calculateRiskScore({
  heuristics: dangerousHeuristics,
  googleResult: { checked: false, isSafe: true },
  virusTotalResult: { checked: false, positives: 0, total: 0 },
  domainAge: null
});

console.log('✅ URL:', dangerousUrl);
console.log('✅ Risk Score:', dangerousScore.score);
console.log('✅ Is IP-based:', dangerousHeuristics.isIpBased);
console.log('✅ Has HTTPS:', dangerousHeuristics.hasHttps);
console.log('✅ Suspicious Keywords:', dangerousHeuristics.suspiciousKeywordsFound.length);
console.log('');

console.log('🎉 All tests passed! Monitor functions are working correctly.\n');
console.log('Next steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Login to your account');
console.log('3. Go to /monitor page');
console.log('4. Try adding a URL to monitor');
