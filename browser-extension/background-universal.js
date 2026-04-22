// LinkGuard Universal Background Script - Compatible with all browsers
(function() {
    'use strict';

    // Universal browser API wrapper
    const browserAPI = (function() {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            return chrome;
        } else if (typeof browser !== 'undefined' && browser.runtime) {
            return browser;
        } else {
            // Fallback for older browsers
            return {
                runtime: {
                    onMessage: { addListener: function() {} },
                    sendMessage: function() {}
                },
                tabs: {
                    query: function() {},
                    create: function() {}
                },
                storage: {
                    local: { get: function() {}, set: function() {} },
                    sync: { get: function() {}, set: function() {} }
                },
                browserAction: {
                    setBadgeText: function() {},
                    setBadgeBackgroundColor: function() {}
                }
            };
        }
    })();

    class LinkGuardBackground {
        constructor() {
            this.apiUrl = 'http://localhost:5001/api';
            this.fallbackApiUrl = 'https://your-deployed-api.com/api';
            this.cache = new Map();
            this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
            this.init();
        }

        init() {
            console.log('LinkGuard Universal Background Script initialized');
            
            // Listen for messages from popup and content scripts
            if (browserAPI.runtime && browserAPI.runtime.onMessage) {
                browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
                    console.log('Background received message:', request);
                    
                    switch (request.action) {
                        case 'scanUrl':
                            this.handleScanUrl(request.url, sendResponse);
                            return true; // Keep message channel open
                        
                        case 'getSettings':
                            this.handleGetSettings(sendResponse);
                            return true;
                        
                        case 'updateSettings':
                            this.handleUpdateSettings(request.settings, sendResponse);
                            return true;
                        
                        case 'openScanner':
                            this.openUniversalScanner();
                            sendResponse({ success: true });
                            break;
                        
                        default:
                            console.log('Unknown action:', request.action);
                            sendResponse({ error: 'Unknown action' });
                    }
                });
            }

            // Set default settings on install
            if (browserAPI.runtime && browserAPI.runtime.onInstalled) {
                browserAPI.runtime.onInstalled.addListener(() => {
                    this.setDefaultSettings();
                });
            }
        }

        async handleScanUrl(url, sendResponse) {
            try {
                console.log('Scanning URL:', url);
                
                // Check if user is authenticated
                const settings = await this.getSettings();
                if (!settings.authToken) {
                    sendResponse({
                        error: true,
                        message: 'Authentication required',
                        requiresAuth: true,
                        url: url
                    });
                    return;
                }
                
                const result = await this.scanUrl(url);
                console.log('Scan result:', result);
                sendResponse(result);
            } catch (error) {
                console.error('Error scanning URL:', error);
                sendResponse({
                    error: true,
                    message: error.message,
                    url: url
                });
            }
        }

        async handleGetSettings(sendResponse) {
            try {
                const settings = await this.getSettings();
                sendResponse(settings);
            } catch (error) {
                console.error('Error getting settings:', error);
                sendResponse({
                    enabled: true,
                    showNotifications: true,
                    blockDangerous: false,
                    apiUrl: this.apiUrl
                });
            }
        }

        async handleUpdateSettings(settings, sendResponse) {
            try {
                await this.updateSettings(settings);
                sendResponse({ success: true });
            } catch (error) {
                console.error('Error updating settings:', error);
                sendResponse({ error: true, message: error.message });
            }
        }

        async scanUrl(url) {
            try {
                // Check cache first
                const cacheKey = url;
                const cached = this.cache.get(cacheKey);
                if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
                    console.log('Returning cached result for:', url);
                    return cached.data;
                }

                // Try API call
                let result;
                try {
                    result = await this.callApi(this.apiUrl, url);
                } catch (primaryError) {
                    console.log('Primary API failed, trying fallback:', primaryError.message);
                    
                    try {
                        result = await this.callApi(this.fallbackApiUrl, url);
                    } catch (fallbackError) {
                        console.log('Fallback API failed, using mock analysis:', fallbackError.message);
                        result = await this.mockAnalysis(url);
                    }
                }

                // Cache the result
                this.cache.set(cacheKey, {
                    data: result,
                    timestamp: Date.now()
                });

                // Update badge
                this.updateBadge(result);

                return result;
            } catch (error) {
                console.error('Error in scanUrl:', error);
                return {
                    url: url,
                    status: 'error',
                    riskScore: 0,
                    warnings: [`Scan failed: ${error.message}`],
                    error: true,
                    message: error.message
                };
            }
        }

        async callApi(apiUrl, url) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            try {
                // Get user token
                const settings = await this.getSettings();
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };

                if (settings.authToken) {
                    headers['Authorization'] = `Bearer ${settings.authToken}`;
                }

                const response = await fetch(`${apiUrl}/scan`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ url }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.status === 401) {
                    // Token expired or invalid - clear auth
                    await this.updateSettings({
                        ...settings,
                        authToken: null,
                        currentUser: null
                    });
                    throw new Error('Authentication required. Please login again.');
                }

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                return result;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }

        async mockAnalysis(url) {
            console.log('Using mock analysis for:', url);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname.toLowerCase();
                let riskScore = 0;
                let warnings = [];
                let status = 'safe';

                // Simple heuristic analysis
                const suspiciousPatterns = [
                    'bit.ly', 'tinyurl.com', 'short.link', 'ow.ly',
                    'phishing', 'malware', 'virus', 'hack', 'crack',
                    'free-download', 'urgent', 'verify-account'
                ];

                const highRiskTlds = ['.tk', '.ml', '.ga', '.cf'];
                
                // Check for suspicious patterns
                suspiciousPatterns.forEach(pattern => {
                    if (domain.includes(pattern) || url.toLowerCase().includes(pattern)) {
                        riskScore += 25;
                        warnings.push(`Suspicious pattern detected: ${pattern}`);
                    }
                });

                // Check for high-risk TLDs
                highRiskTlds.forEach(tld => {
                    if (domain.endsWith(tld)) {
                        riskScore += 20;
                        warnings.push(`High-risk domain extension: ${tld}`);
                    }
                });

                // Check for IP addresses
                if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) {
                    riskScore += 30;
                    warnings.push('Uses IP address instead of domain');
                }

                // Check for excessive subdomains
                const subdomains = domain.split('.').length - 2;
                if (subdomains > 2) {
                    riskScore += 15;
                    warnings.push('Multiple subdomains detected');
                }

                // Check for HTTPS
                if (!url.startsWith('https://')) {
                    riskScore += 10;
                    warnings.push('Not using secure HTTPS');
                }

                // Determine status
                if (riskScore >= 70) {
                    status = 'danger';
                } else if (riskScore >= 40) {
                    status = 'warning';
                } else {
                    status = 'safe';
                }

                riskScore = Math.min(riskScore, 100);

                return {
                    url,
                    status,
                    riskScore,
                    warnings,
                    analysis: {
                        domain,
                        secure: url.startsWith('https://'),
                        subdomains: subdomains,
                        scanTime: new Date().toISOString(),
                        method: 'heuristic'
                    },
                    message: this.getRiskMessage(riskScore, warnings)
                };
            } catch (error) {
                return {
                    url,
                    status: 'error',
                    riskScore: 0,
                    warnings: [`Invalid URL: ${error.message}`],
                    error: true,
                    message: `Unable to analyze URL: ${error.message}`
                };
            }
        }

        getRiskMessage(riskScore, warnings) {
            if (riskScore >= 70) {
                return `High risk detected! This site may be dangerous.`;
            } else if (riskScore >= 40) {
                return `Moderate risk detected. Exercise caution.`;
            } else {
                return 'Site appears safe based on analysis.';
            }
        }

        updateBadge(result) {
            if (!browserAPI.browserAction) return;

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

            try {
                browserAPI.browserAction.setBadgeText({ text: badgeText });
                browserAPI.browserAction.setBadgeBackgroundColor({ color: badgeColor });
            } catch (error) {
                console.log('Badge update not supported:', error.message);
            }
        }

        openUniversalScanner() {
            const scannerUrl = browserAPI.runtime.getURL('linkguard-universal.html');
            
            if (browserAPI.tabs && browserAPI.tabs.create) {
                browserAPI.tabs.create({ url: scannerUrl });
            } else {
                // Fallback: open in new window
                window.open(scannerUrl, '_blank');
            }
        }

        async getSettings() {
            return new Promise((resolve) => {
                const defaultSettings = {
                    enabled: true,
                    showNotifications: true,
                    blockDangerous: false,
                    apiUrl: this.apiUrl,
                    authToken: null,
                    currentUser: null
                };

                if (browserAPI.storage && browserAPI.storage.sync) {
                    browserAPI.storage.sync.get(defaultSettings, resolve);
                } else {
                    resolve(defaultSettings);
                }
            });
        }

        async updateSettings(settings) {
            return new Promise((resolve) => {
                if (browserAPI.storage && browserAPI.storage.sync) {
                    browserAPI.storage.sync.set(settings, resolve);
                } else {
                    resolve();
                }
            });
        }

        async setDefaultSettings() {
            const settings = await this.getSettings();
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

})();