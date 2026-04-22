const axios = require('axios');

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VT_BASE_URL = 'https://www.virustotal.com/api/v3';

/**
 * Encode URL to VirusTotal ID format (base64url without padding)
 */
function encodeUrlId(url) {
  return Buffer.from(url).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Check a URL against VirusTotal API v3
 * @param {string} url
 * @returns {Promise<{checked: boolean, positives: number, total: number, scanId?: string, error?: string}>}
 */
async function checkVirusTotal(url) {
  if (!VT_API_KEY) {
    return {
      checked: false,
      positives: 0,
      total: 0,
      error: 'VirusTotal API key not configured'
    };
  }

  try {
    const urlId = encodeUrlId(url);

    // First try to get existing analysis
    try {
      const getResponse = await axios.get(`${VT_BASE_URL}/urls/${urlId}`, {
        headers: { 'x-apikey': VT_API_KEY },
        timeout: 10000
      });

      const stats = getResponse.data?.data?.attributes?.last_analysis_stats || {};
      const positives = (stats.malicious || 0) + (stats.suspicious || 0);
      const total = Object.values(stats).reduce((a, b) => a + b, 0);

      return {
        checked: true,
        positives,
        total,
        scanId: getResponse.data?.data?.id,
        stats
      };
    } catch (getError) {
      // If not found, submit for scanning
      if (getError.response?.status === 404) {
        const formData = new URLSearchParams();
        formData.append('url', url);

        const submitResponse = await axios.post(`${VT_BASE_URL}/urls`, formData, {
          headers: {
            'x-apikey': VT_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 10000
        });

        const analysisId = submitResponse.data?.data?.id;

        // Wait briefly then get results
        await new Promise((r) => setTimeout(r, 3000));

        const analysisResponse = await axios.get(`${VT_BASE_URL}/analyses/${analysisId}`, {
          headers: { 'x-apikey': VT_API_KEY },
          timeout: 10000
        });

        const stats = analysisResponse.data?.data?.attributes?.stats || {};
        const positives = (stats.malicious || 0) + (stats.suspicious || 0);
        const total = Object.values(stats).reduce((a, b) => a + b, 0);

        return {
          checked: true,
          positives,
          total,
          scanId: analysisId,
          stats
        };
      }
      throw getError;
    }
  } catch (error) {
    console.error('VirusTotal error:', error.message);
    return {
      checked: false,
      positives: 0,
      total: 0,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

module.exports = { checkVirusTotal };
