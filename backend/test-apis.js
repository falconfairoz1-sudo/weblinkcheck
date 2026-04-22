#!/usr/bin/env node

/**
 * API Keys Testing Script (Simplified - Google Safe Browsing + VirusTotal only)
 * Run this script to test if your API keys are working correctly
 * 
 * Usage: node test-apis.js
 */

require('dotenv').config();
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
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}🔍 ${msg}${colors.reset}`)
};

async function testGoogleSafeBrowsing() {
  log.header('Testing Google Safe Browsing API');
  
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey || apiKey === 'your_google_safe_browsing_api_key') {
    log.warning('Google Safe Browsing API key not configured');
    return false;
  }

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: {
          clientId: 'linkguard-test',
          clientVersion: '1.0.0'
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: 'http://malware.testing.google.test/testing/malware/' }]
        }
      },
      { timeout: 10000 }
    );

    log.success('Google Safe Browsing API is working!');
    log.info(`Response: ${JSON.stringify(response.data, null, 2)}`);
    return true;
  } catch (error) {
    log.error(`Google Safe Browsing API failed: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testVirusTotal() {
  log.header('Testing VirusTotal API');
  
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey || apiKey === 'your_virustotal_api_key') {
    log.warning('VirusTotal API key not configured');
    return false;
  }

  try {
    // Test with a simple URL scan
    const testUrl = 'https://www.google.com';
    const urlId = Buffer.from(testUrl).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    const response = await axios.get(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        headers: { 'x-apikey': apiKey },
        timeout: 10000
      }
    );

    log.success('VirusTotal API is working!');
    const stats = response.data?.data?.attributes?.last_analysis_stats || {};
    log.info(`Analysis stats: ${JSON.stringify(stats, null, 2)}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      // URL not found is actually a good sign - API is working
      log.success('VirusTotal API is working! (URL not in database yet)');
      return true;
    }
    log.error(`VirusTotal API failed: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testMongoDB() {
  log.header('Testing MongoDB Connection');
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    log.warning('MongoDB URI not configured');
    return false;
  }

  try {
    const mongoose = require('mongoose');
    await mongoose.connect(mongoUri);
    log.success('MongoDB connection successful!');
    await mongoose.disconnect();
    return true;
  } catch (error) {
    log.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`${colors.bold}${colors.blue}🛡️  LinkGuard API Testing Suite (Simplified)${colors.reset}\n`);
  
  const results = {
    mongodb: await testMongoDB(),
    googleSafeBrowsing: await testGoogleSafeBrowsing(),
    virusTotal: await testVirusTotal()
  };

  // Summary
  log.header('Test Results Summary');
  
  const working = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n${colors.bold}Results:${colors.reset}`);
  Object.entries(results).forEach(([service, status]) => {
    const icon = status ? '✅' : '❌';
    const serviceName = service.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`  ${icon} ${serviceName}`);
  });

  console.log(`\n${colors.bold}Summary: ${working}/${total} services working${colors.reset}`);
  
  if (results.mongodb) {
    log.success('Core functionality available - MongoDB is connected');
  } else {
    log.error('MongoDB is required for the application to work');
  }

  if (working >= 2) {
    log.success('LinkGuard is ready to run! 🚀');
  } else {
    log.warning('Consider setting up Google Safe Browsing and VirusTotal API keys for enhanced threat detection');
  }

  console.log(`\n${colors.blue}💡 Simplified Setup: Only Google Safe Browsing + VirusTotal + AI Heuristics${colors.reset}`);
  console.log(`${colors.blue}   This provides comprehensive threat detection without API complexity${colors.reset}\n`);
}

// Run the tests
main().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});