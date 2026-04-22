const axios = require('axios');
const NodeCache = require('node-cache');

// Cache preview data for 24 hours
const previewCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

/**
 * Fetch website metadata and screenshot
 */
async function getWebsitePreview(url) {
  try {
    // Check cache first
    const cacheKey = `preview:${url}`;
    const cached = previewCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const preview = {
      url,
      domain: extractDomain(url),
      title: null,
      description: null,
      favicon: null,
      screenshot: null,
      error: null
    };

    // Fetch HTML content
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        maxRedirects: 5
      });

      const html = response.data;

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) {
        preview.title = titleMatch[1].trim();
      }

      // Extract meta description
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      if (descMatch) {
        preview.description = descMatch[1].trim();
      }

      // Extract favicon
      const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut\s+)?icon["'][^>]*href=["']([^"']+)["']/i);
      if (faviconMatch) {
        preview.favicon = resolveFaviconUrl(faviconMatch[1], url);
      } else {
        // Try default favicon location
        preview.favicon = `${new URL(url).origin}/favicon.ico`;
      }

      // Extract Open Graph image if available
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogImageMatch) {
        preview.screenshot = ogImageMatch[1];
      }

      // If no OG image, try to get screenshot from screenshot service
      if (!preview.screenshot) {
        preview.screenshot = await getScreenshot(url);
      }
    } catch (fetchError) {
      console.error('Error fetching website:', fetchError.message);
      preview.error = 'Could not fetch website content';
    }

    // Cache the result
    previewCache.set(cacheKey, preview);

    return preview;
  } catch (error) {
    console.error('Preview service error:', error);
    return {
      url,
      domain: extractDomain(url),
      error: 'Failed to generate preview'
    };
  }
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Resolve favicon URL to absolute URL
 */
function resolveFaviconUrl(faviconPath, baseUrl) {
  try {
    if (faviconPath.startsWith('http')) {
      return faviconPath;
    }
    const baseUrlObj = new URL(baseUrl);
    if (faviconPath.startsWith('/')) {
      return `${baseUrlObj.origin}${faviconPath}`;
    }
    return `${baseUrlObj.origin}/${faviconPath}`;
  } catch {
    return null;
  }
}

/**
 * Get screenshot using screenshot service
 * Using free screenshot API
 */
async function getScreenshot(url) {
  try {
    // Using screenshotapi.net free tier
    // Alternative: Use other free screenshot services
    const screenshotUrl = `https://screenshot.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&width=800&height=600`;
    
    // Verify the URL is accessible
    const response = await axios.head(screenshotUrl, { timeout: 5000 });
    if (response.status === 200) {
      return screenshotUrl;
    }
  } catch (error) {
    console.error('Screenshot service error:', error.message);
  }

  return null;
}

/**
 * Clear preview cache for a specific URL
 */
function clearPreviewCache(url) {
  const cacheKey = `preview:${url}`;
  previewCache.del(cacheKey);
}

/**
 * Clear all preview cache
 */
function clearAllPreviewCache() {
  previewCache.flushAll();
}

module.exports = {
  getWebsitePreview,
  clearPreviewCache,
  clearAllPreviewCache
};
