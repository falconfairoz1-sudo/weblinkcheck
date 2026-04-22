// LinkGuard Browser Extension - Popup Script
class LinkGuardPopup {
  constructor() {
    this.currentTab = null;
    this.settings = {};
    this.init();
  }

  async init() {
    // Get current tab
    this.currentTab = await this.getCurrentTab();
    
    // Load settings
    this.settings = await this.getSettings();
    
    // Initialize UI
    this.initializeUI();
    
    // Bind events
    this.bindEvents();
    
    // Load current page info
    this.loadCurrentPageInfo();
    
    // Load statistics
    this.loadStatistics();
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getSettings' }, resolve);
    });
  }

  async updateSettings(newSettings) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ 
        action: 'updateSettings', 
        settings: newSettings 
      }, resolve);
    });
  }

  initializeUI() {
    // Set current page URL
    const pageUrlElement = document.getElementById('pageUrl');
    if (this.currentTab) {
      const url = new URL(this.currentTab.url);
      pageUrlElement.textContent = url.hostname;
      pageUrlElement.title = this.currentTab.url;
    }

    // Set settings checkboxes
    document.getElementById('enableProtection').checked = this.settings.enabled;
    document.getElementById('showNotifications').checked = this.settings.showNotifications;
    document.getElementById('blockDangerous').checked = this.settings.blockDangerous;

    // Update status indicator
    this.updateStatusIndicator();
  }

  bindEvents() {
    // Scan current page button
    document.getElementById('scanCurrentPage').addEventListener('click', () => {
      this.scanCurrentPage();
    });

    // Open dashboard button
    document.getElementById('openDashboard').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
    });

    // Settings checkboxes
    document.getElementById('enableProtection').addEventListener('change', (e) => {
      this.updateSetting('enabled', e.target.checked);
    });

    document.getElementById('showNotifications').addEventListener('change', (e) => {
      this.updateSetting('showNotifications', e.target.checked);
    });

    document.getElementById('blockDangerous').addEventListener('change', (e) => {
      this.updateSetting('blockDangerous', e.target.checked);
    });

    // Footer buttons
    document.getElementById('settingsBtn').addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    });

    document.getElementById('helpBtn').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:5173/help' });
    });

    document.getElementById('reportBtn').addEventListener('click', () => {
      this.reportIssue();
    });
  }

  async loadCurrentPageInfo() {
    if (!this.currentTab || !this.currentTab.url) {
      this.updatePageStatus('Unknown', 'Unable to scan this page', 0);
      return;
    }

    // Skip internal pages
    if (this.currentTab.url.startsWith('chrome://') || 
        this.currentTab.url.startsWith('chrome-extension://')) {
      this.updatePageStatus('Internal', 'Browser internal page', 0);
      return;
    }

    try {
      // Show loading state
      this.updatePageStatus('Scanning', 'Analyzing page safety...', null, true);

      // Scan the current page URL
      const result = await this.scanUrl(this.currentTab.url);
      
      // Update UI with results
      if (result.error) {
        this.updatePageStatus('Error', 'Unable to scan page', 0);
      } else {
        const status = this.getRiskStatus(result.riskScore);
        const message = this.getRiskMessage(result.riskScore, result.warnings);
        this.updatePageStatus(status, message, result.riskScore);
      }
    } catch (error) {
      console.error('Error loading page info:', error);
      this.updatePageStatus('Error', 'Scan failed', 0);
    }
  }

  async scanUrl(url) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'scanUrl', url }, resolve);
    });
  }

  updatePageStatus(status, message, riskScore, isLoading = false) {
    const statusIcon = document.querySelector('.status-icon');
    const statusMessage = document.querySelector('.status-message');
    const riskScoreElement = document.getElementById('riskScore');

    // Update icon
    if (isLoading) {
      statusIcon.textContent = '🔄';
      statusIcon.classList.add('loading');
    } else {
      statusIcon.classList.remove('loading');
      switch (status.toLowerCase()) {
        case 'safe':
          statusIcon.textContent = '✅';
          break;
        case 'warning':
          statusIcon.textContent = '⚠️';
          break;
        case 'danger':
          statusIcon.textContent = '🛑';
          break;
        case 'internal':
          statusIcon.textContent = '🏠';
          break;
        default:
          statusIcon.textContent = '❓';
      }
    }

    // Update message
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${status.toLowerCase()}`;

    // Update risk score
    if (riskScore !== null && !isLoading) {
      riskScoreElement.style.display = 'flex';
      const scoreValue = riskScoreElement.querySelector('.score-value');
      scoreValue.textContent = `${riskScore}/100`;
      
      // Update risk score styling
      riskScoreElement.className = 'risk-score';
      if (riskScore >= 70) {
        riskScoreElement.classList.add('risk-high');
      } else if (riskScore >= 40) {
        riskScoreElement.classList.add('risk-medium');
      } else {
        riskScoreElement.classList.add('risk-low');
      }
    } else {
      riskScoreElement.style.display = 'none';
    }
  }

  getRiskStatus(riskScore) {
    if (riskScore >= 70) return 'Danger';
    if (riskScore >= 40) return 'Warning';
    return 'Safe';
  }

  getRiskMessage(riskScore, warnings = []) {
    if (riskScore >= 70) {
      return `Dangerous site detected! ${warnings.length > 0 ? warnings[0] : 'High risk'}`;
    }
    if (riskScore >= 40) {
      return `Potentially suspicious. ${warnings.length > 0 ? warnings[0] : 'Moderate risk'}`;
    }
    return 'Site appears safe to visit';
  }

  async scanCurrentPage() {
    if (!this.currentTab) return;

    const button = document.getElementById('scanCurrentPage');
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<span class="btn-icon loading">🔄</span>Scanning...';
    button.disabled = true;

    try {
      await this.loadCurrentPageInfo();
    } finally {
      // Restore button
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  async updateSetting(key, value) {
    this.settings[key] = value;
    await this.updateSettings(this.settings);
    this.updateStatusIndicator();
  }

  updateStatusIndicator() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    if (this.settings.enabled) {
      statusDot.style.background = '#10b981';
      statusText.textContent = 'Protected';
    } else {
      statusDot.style.background = '#6b7280';
      statusText.textContent = 'Disabled';
    }
  }

  async loadStatistics() {
    try {
      // Get today's statistics from storage
      const today = new Date().toDateString();
      const stats = await this.getStorageData(`stats_${today}`) || {
        scanned: 0,
        blocked: 0
      };

      document.getElementById('scannedCount').textContent = stats.scanned;
      document.getElementById('blockedCount').textContent = stats.blocked;
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async getStorageData(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  reportIssue() {
    const subject = encodeURIComponent('LinkGuard Extension Issue Report');
    const body = encodeURIComponent(`
Please describe the issue you encountered:

Current Page: ${this.currentTab?.url || 'Unknown'}
Extension Version: 1.0.0
Browser: ${navigator.userAgent}

Issue Description:
[Please describe the issue here]
    `.trim());

    const mailtoUrl = `mailto:support@linkguard.com?subject=${subject}&body=${body}`;
    chrome.tabs.create({ url: mailtoUrl });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LinkGuardPopup();
});