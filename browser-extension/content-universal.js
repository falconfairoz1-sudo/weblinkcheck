// LinkGuard Universal Content Script - Compatible with all browsers
(function() {
    'use strict';

    // Universal browser API wrapper
    const browserAPI = (function() {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            return chrome;
        } else if (typeof browser !== 'undefined' && browser.runtime) {
            return browser;
        } else {
            return null;
        }
    })();

    class LinkGuardContent {
        constructor() {
            this.processedLinks = new Set();
            this.observer = null;
            this.settings = { enabled: true, showNotifications: true };
            this.init();
        }

        init() {
            console.log('LinkGuard Universal Content Script initialized');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        }

        async start() {
            try {
                // Load settings
                await this.loadSettings();
                
                // Only proceed if protection is enabled and user is authenticated
                if (!this.settings.enabled) {
                    console.log('LinkGuard protection is disabled');
                    return;
                }

                if (!this.settings.authToken) {
                    console.log('LinkGuard: User not authenticated, skipping link scanning');
                    return;
                }

                // Add CSS for indicators
                this.addStyles();
                
                // Process existing links
                this.processAllLinks();
                
                // Watch for new links
                this.startObserver();
                
                // Add click interceptor
                this.addClickInterceptor();
                
                console.log('LinkGuard content script started successfully');
            } catch (error) {
                console.error('Error starting LinkGuard content script:', error);
            }
        }

        async loadSettings() {
            try {
                if (browserAPI && browserAPI.runtime) {
                    this.settings = await new Promise((resolve) => {
                        browserAPI.runtime.sendMessage({ action: 'getSettings' }, (response) => {
                            resolve(response || { 
                                enabled: true, 
                                showNotifications: true,
                                authToken: null,
                                currentUser: null
                            });
                        });
                    });
                } else {
                    // Fallback settings
                    this.settings = { 
                        enabled: true, 
                        showNotifications: true,
                        authToken: null,
                        currentUser: null
                    };
                }
            } catch (error) {
                console.error('Error loading settings:', error);
                this.settings = { 
                    enabled: true, 
                    showNotifications: true,
                    authToken: null,
                    currentUser: null
                };
            }
        }

        addStyles() {
            if (document.getElementById('linkguard-styles')) return;

            const style = document.createElement('style');
            style.id = 'linkguard-styles';
            style.textContent = `
                .linkguard-indicator {
                    display: inline-block;
                    margin-left: 4px;
                    font-size: 12px;
                    vertical-align: middle;
                    opacity: 0.8;
                    transition: opacity 0.2s ease;
                }
                
                .linkguard-loading {
                    display: inline-block;
                    margin-left: 4px;
                    font-size: 12px;
                    animation: linkguard-spin 1s linear infinite;
                    opacity: 0.6;
                }
                
                @keyframes linkguard-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .linkguard-safe {
                    border-bottom: 1px solid rgba(16, 185, 129, 0.3) !important;
                }
                
                .linkguard-warning {
                    border-bottom: 1px solid rgba(245, 158, 11, 0.5) !important;
                }
                
                .linkguard-dangerous {
                    border-bottom: 2px solid rgba(239, 68, 68, 0.7) !important;
                    background-color: rgba(239, 68, 68, 0.1) !important;
                }
                
                .linkguard-tooltip {
                    position: absolute;
                    background: #1f2937;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    line-height: 1.4;
                    max-width: 250px;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                
                .linkguard-tooltip.show {
                    opacity: 1;
                }
                
                .linkguard-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border: 5px solid transparent;
                    border-top-color: #1f2937;
                }
            `;
            
            document.head.appendChild(style);
        }

        processAllLinks() {
            const links = document.querySelectorAll('a[href]');
            console.log(`Processing ${links.length} links`);
            
            links.forEach(link => {
                // Process links in batches to avoid blocking
                setTimeout(() => this.processLink(link), Math.random() * 1000);
            });
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
            try {
                if (browserAPI && browserAPI.runtime) {
                    return new Promise((resolve) => {
                        browserAPI.runtime.sendMessage(
                            { action: 'scanUrl', url },
                            (response) => resolve(response || { error: true, message: 'No response' })
                        );
                    });
                } else {
                    // Fallback: simple heuristic analysis
                    return this.fallbackAnalysis(url);
                }
            } catch (error) {
                console.error('Error scanning URL:', error);
                return { error: true, message: error.message };
            }
        }

        fallbackAnalysis(url) {
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname.toLowerCase();
                let riskScore = 0;
                let warnings = [];

                // Basic security checks
                if (!url.startsWith('https://')) {
                    riskScore += 10;
                    warnings.push('Not using HTTPS');
                }

                // Check for suspicious patterns
                const suspiciousPatterns = ['bit.ly', 'tinyurl.com', 'short.link'];
                suspiciousPatterns.forEach(pattern => {
                    if (domain.includes(pattern)) {
                        riskScore += 25;
                        warnings.push('URL shortener detected');
                    }
                });

                // Check for IP addresses
                if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) {
                    riskScore += 30;
                    warnings.push('Uses IP address');
                }

                return {
                    url,
                    riskScore: Math.min(riskScore, 100),
                    warnings,
                    status: riskScore >= 70 ? 'danger' : riskScore >= 40 ? 'warning' : 'safe',
                    message: this.getRiskMessage(riskScore)
                };
            } catch (error) {
                return {
                    error: true,
                    message: 'Invalid URL'
                };
            }
        }

        getRiskMessage(riskScore) {
            if (riskScore >= 70) return 'High risk - potentially dangerous';
            if (riskScore >= 40) return 'Moderate risk - exercise caution';
            return 'Low risk - appears safe';
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
                return true;
            }
        }

        addLoadingIndicator(linkElement) {
            // Don't add if already has indicator
            if (linkElement.querySelector('.linkguard-loading, .linkguard-indicator')) {
                return;
            }

            const indicator = document.createElement('span');
            indicator.className = 'linkguard-loading';
            indicator.textContent = '🔄';
            indicator.title = 'LinkGuard scanning...';
            
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
            
            let icon, title, className;
            
            if (result.error) {
                icon = '❓';
                title = 'Unable to scan this link';
                className = '';
            } else if (result.riskScore >= 70) {
                icon = '🛑';
                title = `DANGER! Risk Score: ${result.riskScore}/100\n${result.warnings?.join('\n') || 'High risk detected'}`;
                className = 'linkguard-dangerous';
                linkElement.classList.add('linkguard-dangerous');
            } else if (result.riskScore >= 40) {
                icon = '⚠️';
                title = `WARNING! Risk Score: ${result.riskScore}/100\n${result.warnings?.join('\n') || 'Moderate risk detected'}`;
                className = 'linkguard-warning';
                linkElement.classList.add('linkguard-warning');
            } else {
                icon = '✅';
                title = `Safe! Risk Score: ${result.riskScore}/100`;
                className = 'linkguard-safe';
                linkElement.classList.add('linkguard-safe');
            }
            
            indicator.textContent = icon;
            indicator.title = title;
            
            linkElement.appendChild(indicator);
            
            // Store result for click handler
            linkElement.dataset.linkguardResult = JSON.stringify(result);
            
            // Add hover tooltip for detailed info
            this.addTooltip(linkElement, result);
        }

        addTooltip(linkElement, result) {
            let tooltip = null;
            
            const showTooltip = (e) => {
                if (tooltip) return;
                
                tooltip = document.createElement('div');
                tooltip.className = 'linkguard-tooltip';
                
                let content = '';
                if (result.error) {
                    content = `❌ Scan Error\n${result.message}`;
                } else {
                    const status = result.riskScore >= 70 ? '🛑 DANGEROUS' : 
                                  result.riskScore >= 40 ? '⚠️ SUSPICIOUS' : '✅ SAFE';
                    content = `${status}\nRisk Score: ${result.riskScore}/100`;
                    if (result.warnings && result.warnings.length > 0) {
                        content += `\nWarnings:\n• ${result.warnings.join('\n• ')}`;
                    }
                }
                
                tooltip.textContent = content;
                tooltip.style.whiteSpace = 'pre-line';
                
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const rect = linkElement.getBoundingClientRect();
                tooltip.style.left = Math.max(10, rect.left) + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
                
                // Show tooltip
                setTimeout(() => tooltip.classList.add('show'), 10);
            };
            
            const hideTooltip = () => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            };
            
            linkElement.addEventListener('mouseenter', showTooltip);
            linkElement.addEventListener('mouseleave', hideTooltip);
        }

        addClickInterceptor() {
            document.addEventListener('click', async (event) => {
                const link = event.target.closest('a[href]');
                if (!link || !link.dataset.linkguardResult) return;

                try {
                    const result = JSON.parse(link.dataset.linkguardResult);
                    
                    // Block dangerous links
                    if (result.riskScore >= 70) {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        const shouldProceed = await this.showDangerousLinkDialog(link.href, result);
                        if (shouldProceed) {
                            // User chose to proceed
                            this.openLink(link);
                        }
                    } else if (result.riskScore >= 40) {
                        // Show warning for medium risk links
                        const shouldProceed = await this.showWarningDialog(link.href, result);
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

        openLink(linkElement) {
            const target = linkElement.target || '_self';
            if (target === '_blank' || linkElement.getAttribute('target') === '_blank') {
                window.open(linkElement.href, '_blank');
            } else {
                window.location.href = linkElement.href;
            }
        }

        startObserver() {
            // Watch for dynamically added links
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the node itself is a link
                            if (node.tagName === 'A' && node.href) {
                                setTimeout(() => this.processLink(node), 100);
                            }
                            // Check for links within the added node
                            if (node.querySelectorAll) {
                                const links = node.querySelectorAll('a[href]');
                                links.forEach(link => {
                                    setTimeout(() => this.processLink(link), Math.random() * 500);
                                });
                            }
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
            
            // Remove styles
            const styles = document.getElementById('linkguard-styles');
            if (styles) {
                styles.remove();
            }
        }
    }

    // Initialize content script
    const linkGuardContent = new LinkGuardContent();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        linkGuardContent.destroy();
    });

})();