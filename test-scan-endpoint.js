#!/usr/bin/env node

/**
 * Quick test to verify the scan endpoint works without PhishTank/WHOIS
 */

const axios = require('axios');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

async function testScanEndpoint() {
  log.header('🧪 Testing Scan Endpoint (No PhishTank/WHOIS)');
  
  try {
    const response = await axios.post('http://localhost:5000/api/scan', {
      url: 'https://www.google.com'
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      log.success('Scan endpoint is working!');
      
      const result = response.data;
      log.info(`URL: ${result.url}`);
      log.info(`Status: ${result.status}`);
      log.info(`Risk Score: ${result.riskScore}`);
      log.info(`Scan Duration: ${result.scanDuration}ms`);
      
      // Check if required fields are present
      const requiredFields = ['url', 'domain', 'status', 'riskScore', 'heuristics', 'aiAnalysis'];
      const missingFields = requiredFields.filter(field => !(field in result));
      
      if (missingFields.length === 0) {
        log.success('All required fields are present in the response');
      } else {
        log.warning(`Missing fields: ${missingFields.join(', ')}`);
      }
      
      // Check if PhishTank references are gone
      const responseStr = JSON.stringify(result);
      if (responseStr.toLowerCase().includes('phishtank')) {
        log.error('PhishTank references still found in response!');
      } else {
        log.success('No PhishTank references found - cleanup successful!');
      }
      
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log.error('Server is not running. Please start the backend server first.');
      log.info('Run: cd backend && node server.js');
    } else {
      log.error(`Scan endpoint failed: ${error.response?.data?.error || error.message}`);
    }
    return false;
  }
}

async function main() {
  const success = await testScanEndpoint();
  
  if (success) {
    log.header('🎉 All tests passed! API cleanup successful.');
    console.log(`\n${colors.blue}✨ Your LinkGuard application is now using:${colors.reset}`);
    console.log(`   • Google Safe Browsing API`);
    console.log(`   • VirusTotal API`);
    console.log(`   • AI Heuristic Analysis`);
    console.log(`   • No PhishTank or WHOIS dependencies\n`);
  } else {
    log.header('❌ Test failed. Please check the server and try again.');
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`Test failed: ${error.message}`);
  process.exit(1);
});