// LinkGuard Browser Extension - Background Script
class LinkGuardBackground {
  constructor() {
    this.apiUrl = 'http://localhost:5001/api'; // Your LinkGuard API
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.init();
  }

  init() {
    // Listen for navigation events
    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
      if (details.frameId === 0) { // Main frame only
        this.checkUrl(details.url, details.tabId);
      }
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'scanUrl') {
        this.scanUrl(request.url).then(sendResponse);
        return true; // Keep message channel open for async response
      } else if (request.action === 'getSettings') {
        this.getSettings().then(sendResponse);
        return true;
      } else if (request.action === 'updateSettings') {
        this.updateSettings(request.settings).then(sendResponse);
        return true;
      }
    });

    // Set default settings on install
    chrome.runtime.onInstalled.addListener(() => {
      this.setDefaultSettings();
    });
  }

  async checkUrl(url, tabId) {
    try {
      // Skip internal pages and extensions
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('moz-extension://')) {
        return;
      }

      const result = await this.scanUrl(url);
      
      // Update badge based on risk level
      this.updateBadge(tabId, result);
      
      // Show notification for high-risk URLs
      if (result.riskScore >= 70) {
        this.showThreatNotification(url, result);
      }
    } catch (error) {
      console.error('Error checking URL:', error);
    }
  }

  async scanUrl(url) {
    try {
      // Check cache first
      const cacheKey = url;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }

      // Get user token if available
      const settings = await this.getSettings();
      const headers = {
        'Content-Type': 'application/json'
      };

      if (settings.authToken) {
        headers['Authorization'] = `Bearer ${settings.authToken}`;
      }

      // Call your existing LinkGuard API
      const response = await fetch(`${this.apiUrl}/scan`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Error scanning URL:', error);
      // Return safe result on error to avoid blocking user
      return {
        url,
        status: 'unknown',
        riskScore: 0,
        warnings: ['Unable to scan - network error'],
        error: true
      };
    }
  }

  updateBadge(tabId, result) {
    let badgeText = '';
    let badgeColor = '#10b981'; // Green

    if (result.error) {
      badgeText = '?';
      badgeColor = '#6b7280'; // Gray
    } else if (result.riskScore >= 70) {
      badgeText = '!';
      badgeColor = '#ef4444'; // Red
    } else if (result.riskScore >= 40) {
      badgeText = '⚠';
      badgeColor = '#f59e0b'; // Yellow
    } else {
      badgeText = '✓';
      badgeColor = '#10b981'; // Green
    }

    chrome.action.setBadgeText({ text: badgeText, tabId });
    chrome.action.setBadgeBackgroundColor({ color: badgeColor, tabId });
  }

  async showThreatNotification(url, result) {
    const settings = await this.getSettings();
    if (!settings.showNotifications) return;

    const domain = new URL(url).hostname;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: '🛡️ LinkGuard Threat Detected',
      message: `Dangerous site blocked: ${domain}\nRisk Score: ${result.riskScore}/100`,
      priority: 2
    });
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        enabled: true,
        showNotifications: true,
        blockDangerous: false,
        authToken: null,
        apiUrl: 'http://localhost:5001/api'
      }, resolve);
    });
  }

  async updateSettings(settings) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(settings, resolve);
    });
  }

  async setDefaultSettings() {
    const settings = await this.getSettings();
    // Only set if not already configured
    if (!settings.configured) {
      await this.updateSettings({
        ...settings,
        configured: true
      });
    }
  }
}

// Initialize background script
new LinkGuardBackground();