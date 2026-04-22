const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const GOOGLE_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

/**
 * Check a URL against Google Safe Browsing API
 * @param {string} url
 * @returns {Promise<{checked: boolean, isSafe: boolean, threats: string[], error?: string}>}
 */
async function checkGoogleSafeBrowsing(url) {
  if (!GOOGLE_API_KEY) {
    return {
      checked: false,
      isSafe: true,
      threats: [],
      error: 'Google Safe Browsing API key not configured'
    };
  }

  try {
    const requestBody = {
      client: {
        clientId: 'link-safety-checker',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
          'THREAT_TYPE_UNSPECIFIED'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    const response = await axios.post(
      `${GOOGLE_API_URL}?key=${GOOGLE_API_KEY}`,
      requestBody,
      { timeout: 8000 }
    );

    const matches = response.data.matches || [];
    const threats = matches.map((m) => m.threatType);

    return {
      checked: true,
      isSafe: threats.length === 0,
      threats
    };
  } catch (error) {
    console.error('Google Safe Browsing error:', error.message);
    return {
      checked: false,
      isSafe: true,
      threats: [],
      error: error.response?.data?.error?.message || error.message
    };
  }
}

module.exports = { checkGoogleSafeBrowsing };
