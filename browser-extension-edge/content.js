// LinkGuard Microsoft Edge Extension - Content Script
// (Same as Chrome version since Edge is Chromium-based)

class LinkGuardEdgeContent {
  constructor() {
    this.processedLinks = new Set();
    this.observer = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  start() {
    // Process existing links
    this.processAllLinks();
    
    // Watch for new links added dynamically
    this.startObserver();
    
    // Add click interceptor
    this.addClickInterceptor();
  }

  processAllLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => this.processLink(link));
  }

  async processLink(linkElement) {
    try {
      const href = linkElement.href;
      
      // Skip if already processed or invalid
      if (!href || this.processedLinks.has(href) || this.isInternalLink(href)) {
        return;
      }

      this.processedLinks.add(href);
      
      // Add loading indicator
      this.addLoadingIndicator(linkElement);
      
      // Scan the URL
      const result = await this.scanUrl(href);
      
      // Remove loading indicator and add result
      this.removeLoadingIndicator(linkElement);
      this.addSafetyIndicator(linkElement, result);
      
    } catch (error) {
      console.error('Error processing link:', error);
      this.removeLoadingIndicator(linkElement);
    }
  }

  async scanUrl(url) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'scanUrl', url },
        (response) => resolve(response || { error: true })
      );
    });
  }

  isInternalLink(href) {
    try {
      const url = new URL(href);
      return url.hostname === window.location.hostname ||
             href.startsWith('#') ||
             href.startsWith('mailto:') ||
             href.startsWith('tel:') ||
             href.startsWith('javascript:');
    } catch {
      return true; // Invalid URLs are considered internal
    }
  }

  addLoadingIndicator(linkElement) {
    const indicator = document.createElement('span');
    indicator.className = 'linkguard-loading';
    indicator.innerHTML = '🔄';
    indicator.title = 'LinkGuard scanning...';
    
    linkElement.style.position = 'relative';
    linkElement.appendChild(indicator);
  }

  removeLoadingIndicator(linkElement) {
    const loading = linkElement.querySelector('.linkguard-loading');
    if (loading) {
      loading.remove();
    }
  }

  addSafetyIndicator(linkElement, result) {
    // Remove any existing indicators
    const existing = linkElement.querySelector('.linkguard-indicator');
    if (existing) {
      existing.remove();
    }

    const indicator = document.createElement('span');
    indicator.className = 'linkguard-indicator';
    
    let icon, color, title;
    
    if (result.error) {
      icon = '❓';
      color = '#6b7280';
      title = 'Unable to scan this link';
    } else if (result.riskScore >= 70) {
      icon = '🛑';
      color = '#ef4444';
      title = `Dangerous! Risk Score: ${result.riskScore}/100\nWarnings: ${result.warnings?.join(', ') || 'High risk detected'}`;
      linkElement.classList.add('linkguard-dangerous');
    } else if (result.riskScore >= 40) {
      icon = '⚠️';
      color = '#f59e0b';
      title = `Caution! Risk Score: ${result.riskScore}/100\nWarnings: ${result.warnings?.join(', ') || 'Moderate risk detected'}`;
      linkElement.classList.add('linkguard-warning');
    } else {
      icon = '✅';
      color = '#10b981';
      title = `Safe! Risk Score: ${result.riskScore}/100`;
      linkElement.classList.add('linkguard-safe');
    }
    
    indicator.innerHTML = icon;
    indicator.style.color = color;
    indicator.title = title;
    
    // Position the indicator
    linkElement.style.position = 'relative';
    linkElement.appendChild(indicator);
    
    // Store result for click handler
    linkElement.dataset.linkguardResult = JSON.stringify(result);
  }

  addClickInterceptor() {
    document.addEventListener('click', async (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      const result = link.dataset.linkguardResult;
      if (!result) return;

      try {
        const scanResult = JSON.parse(result);
        
        // Block dangerous links
        if (scanResult.riskScore >= 70) {
          event.preventDefault();
          event.stopPropagation();
          
          const shouldProceed = await this.showDangerousLinkDialog(link.href, scanResult);
          if (shouldProceed) {
            // User chose to proceed anyway
            window.open(link.href, link.target || '_self');
          }
        } else if (scanResult.riskScore >= 40) {
          // Show warning for medium risk links
          const shouldProceed = await this.showWarningDialog(link.href, scanResult);
          if (!shouldProceed) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      } catch (error) {
        console.error('Error handling link click:', error);
      }
    }, true);
  }

  async showDangerousLinkDialog(url, result) {
    const domain = new URL(url).hostname;
    const message = `🛑 DANGER: This link has been flagged as dangerous!\n\n` +
                   `Site: ${domain}\n` +
                   `Risk Score: ${result.riskScore}/100\n` +
                   `Threats: ${result.warnings?.join(', ') || 'Multiple threats detected'}\n\n` +
                   `LinkGuard strongly recommends NOT visiting this site.\n\n` +
                   `Do you want to proceed anyway? (Not recommended)`;
    
    return confirm(message);
  }

  async showWarningDialog(url, result) {
    const domain = new URL(url).hostname;
    const message = `⚠️ WARNING: This link may be suspicious.\n\n` +
                   `Site: ${domain}\n` +
                   `Risk Score: ${result.riskScore}/100\n` +
                   `Warnings: ${result.warnings?.join(', ') || 'Potential risks detected'}\n\n` +
                   `Proceed with caution. Do you want to continue?`;
    
    return confirm(message);
  }

  startObserver() {
    // Watch for dynamically added links
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the node itself is a link
            if (node.tagName === 'A' && node.href) {
              this.processLink(node);
            }
            // Check for links within the added node
            const links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
            links.forEach(link => this.processLink(link));
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize content script for Edge
const linkGuardEdgeContent = new LinkGuardEdgeContent();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  linkGuardEdgeContent.destroy();
});