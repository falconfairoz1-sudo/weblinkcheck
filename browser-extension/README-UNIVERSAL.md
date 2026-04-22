# LinkGuard Universal Browser Extension

A comprehensive URL scanner that works across **ALL browsers** without any installation required. This extension provides real-time protection against malicious URLs, phishing attempts, and suspicious websites.

## 🚀 Features

- ✅ **Universal Compatibility** - Works in Chrome, Firefox, Safari, Edge, Opera, and more
- 🛡️ **Real-time URL Protection** - Automatically scans links as you browse
- 🔍 **Advanced Threat Detection** - Identifies malware, phishing, and suspicious content
- 📊 **Risk Score Analysis** - Provides detailed risk assessment (0-100 scale)
- 🚫 **Auto-blocking** - Prevents access to dangerous sites with user confirmation
- 🎯 **Visual Indicators** - Color-coded safety indicators on all links
- 🔒 **Privacy-focused** - No data collection, local processing when possible
- ⚡ **Lightweight** - Minimal performance impact
- 🌐 **Offline Capable** - Basic heuristic analysis works without internet

## 📁 Files Overview

### Core Files
- `linkguard-universal.html` - **Main scanner interface** (works standalone)
- `manifest-universal.json` - Universal manifest (Manifest V2 for compatibility)
- `background-universal.js` - Background service worker
- `popup-universal.html` - Extension popup interface
- `content-universal.js` - Content script for link scanning

### Installation Options

#### Option 1: Standalone Web App (No Installation)
1. Open `linkguard-universal.html` in any browser
2. Bookmark it for easy access
3. Works immediately without any setup

#### Option 2: Browser Extension (Full Features)
1. **Chrome/Edge/Brave:**
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `browser-extension` folder

2. **Firefox:**
   - Go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `manifest-universal.json`

3. **Safari:**
   - Use Safari Web Extension Converter
   - Convert the extension files
   - Install through Xcode

4. **Opera:**
   - Go to `opera://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `browser-extension` folder

## 🛠️ Setup Instructions

### Quick Start (Standalone)
```bash
# Simply open the HTML file
open browser-extension/linkguard-universal.html
```

### Extension Installation
```bash
# 1. Navigate to your browser's extension page
# 2. Enable developer mode
# 3. Load the browser-extension folder
# 4. The extension will appear in your toolbar
```

### API Configuration
The extension can connect to your LinkGuard API backend:

1. **Default API:** `http://localhost:5001/api`
2. **Fallback API:** Configure in background script
3. **Mock Analysis:** Works offline with heuristic analysis

## 🔧 Configuration

### Settings Available
- **Real-time Protection** - Enable/disable automatic link scanning
- **Show Notifications** - Display threat alerts
- **Auto-block Dangerous Sites** - Prevent access to high-risk URLs
- **API Endpoint** - Configure custom API server

### Customization
Edit the configuration in `background-universal.js`:

```javascript
this.apiUrl = 'http://localhost:5001/api'; // Your API
this.fallbackApiUrl = 'https://your-api.com/api'; // Backup API
this.cacheExpiry = 5 * 60 * 1000; // Cache duration
```

## 🎯 How It Works

### 1. Link Detection
- Scans all links on page load
- Monitors dynamically added links
- Processes links in batches for performance

### 2. Risk Analysis
- **API Analysis:** Connects to LinkGuard backend for comprehensive scanning
- **Heuristic Analysis:** Offline analysis using security patterns
- **Cache System:** Stores results to avoid duplicate scans

### 3. Visual Indicators
- 🛑 **Red** - Dangerous (Risk 70-100)
- ⚠️ **Yellow** - Suspicious (Risk 40-69)
- ✅ **Green** - Safe (Risk 0-39)
- ❓ **Gray** - Unable to scan

### 4. User Protection
- **Click Interception:** Blocks dangerous links with confirmation dialog
- **Warning Dialogs:** Alerts users about suspicious content
- **Detailed Tooltips:** Shows risk information on hover

## 🔒 Security Features

### Threat Detection
- Malware hosting sites
- Phishing attempts
- URL shorteners
- IP-based URLs
- Suspicious TLDs
- Non-HTTPS connections
- Excessive subdomains

### Privacy Protection
- No user data collection
- Local processing when possible
- Secure API communication
- No tracking or analytics

## 🌐 Browser Compatibility

| Browser | Standalone | Extension | Features |
|---------|------------|-----------|----------|
| Chrome | ✅ | ✅ | Full |
| Firefox | ✅ | ✅ | Full |
| Safari | ✅ | ⚠️ | Limited |
| Edge | ✅ | ✅ | Full |
| Opera | ✅ | ✅ | Full |
| Brave | ✅ | ✅ | Full |

## 📱 Mobile Support

The standalone version (`linkguard-universal.html`) works on mobile browsers:
- iOS Safari
- Android Chrome
- Mobile Firefox
- Samsung Internet

## 🔧 Development

### File Structure
```
browser-extension/
├── linkguard-universal.html     # Standalone scanner
├── manifest-universal.json      # Extension manifest
├── background-universal.js      # Background script
├── popup-universal.html         # Extension popup
├── content-universal.js         # Content script
├── icons/                       # Extension icons
└── README-UNIVERSAL.md          # This file
```

### API Integration
The extension expects these API endpoints:

```javascript
POST /api/scan
{
  "url": "https://example.com"
}

Response:
{
  "url": "https://example.com",
  "riskScore": 25,
  "status": "safe",
  "warnings": [],
  "message": "Site appears safe"
}
```

### Testing
1. **Standalone:** Open HTML file and test URL scanning
2. **Extension:** Load in browser and test on various websites
3. **API:** Verify connection to backend service

## 🚨 Troubleshooting

### Common Issues

**Extension not loading:**
- Check manifest.json syntax
- Verify file permissions
- Enable developer mode

**API connection failed:**
- Check API server is running
- Verify CORS settings
- Check network connectivity

**Links not being scanned:**
- Verify content script injection
- Check browser console for errors
- Ensure extension permissions

**Popup not working:**
- Check popup HTML syntax
- Verify popup permissions
- Test in different browser

### Debug Mode
Enable debug logging in browser console:
```javascript
// In browser console
localStorage.setItem('linkguard-debug', 'true');
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across multiple browsers
5. Submit a pull request

## 📞 Support

- **Issues:** Report bugs on GitHub
- **Documentation:** Check the main README
- **API:** See backend documentation
- **Community:** Join our Discord server

## 🔄 Updates

The extension automatically checks for updates when using the API. For standalone usage, download the latest version from the repository.

---

**Made with ❤️ for universal web security**