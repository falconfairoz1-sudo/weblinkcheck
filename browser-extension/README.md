# 🛡️ LinkGuard Browser Extension

## Overview
The LinkGuard Browser Extension provides real-time protection by automatically scanning URLs as you browse. It integrates seamlessly with your existing LinkGuard web application to provide instant threat detection.

## Features

### 🔍 **Real-Time URL Scanning**
- Automatically scans all links on web pages
- Visual indicators show safety status
- Instant threat detection before you click

### 🚨 **Visual Safety Indicators**
- ✅ **Green Checkmark**: Safe to visit
- ⚠️ **Yellow Warning**: Proceed with caution
- 🛑 **Red Block**: Dangerous, don't visit
- ❓ **Gray Question**: Unable to scan

### 🛡️ **Proactive Protection**
- Blocks dangerous links automatically
- Warning dialogs for suspicious sites
- Real-time threat notifications
- Browser badge shows page safety status

### 📊 **Smart Dashboard**
- Current page safety status
- Daily protection statistics
- Quick access to full LinkGuard dashboard
- Customizable protection settings

## Installation

### Method 1: Load Unpacked (Development)

1. **Download Extension Files**
   ```bash
   # Copy all files from browser-extension/ folder
   ```

2. **Create Icons** (Required)
   - Create icon files in `icons/` folder
   - Required sizes: 16x16, 32x32, 48x48, 128x128 pixels
   - See `icons/create-icons.md` for guidelines

3. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - Extension should appear in toolbar

### Method 2: Chrome Web Store (Future)
- Will be available after review process
- One-click installation
- Automatic updates

## Configuration

### 1. **API Connection**
Make sure your LinkGuard backend is running:
```bash
cd backend
npm run dev  # Should be running on http://localhost:5001
```

### 2. **Extension Settings**
Click the LinkGuard icon in toolbar to access:
- **Real-time Protection**: Enable/disable scanning
- **Threat Notifications**: Show popup alerts
- **Auto-block Dangerous**: Automatically block high-risk sites

### 3. **Authentication** (Optional)
- Link your LinkGuard account for personalized protection
- Access scan history and advanced features
- Sync settings across devices

## How It Works

### 1. **Page Load Protection**
```
User visits page → Extension scans URL → Shows safety status
```

### 2. **Link Scanning**
```
Page loads → Extension finds all links → Scans each URL → Adds visual indicators
```

### 3. **Click Protection**
```
User clicks link → Extension checks safety → Warns if dangerous → Allows/blocks navigation
```

## Visual Indicators

### **Link Styling**
- **Safe Links**: Green left border
- **Warning Links**: Yellow left border + light background
- **Dangerous Links**: Red left border + strikethrough text

### **Safety Icons**
- Positioned at top-right of each link
- Hover for detailed threat information
- Animated loading during scan
- Color-coded for quick recognition

### **Browser Badge**
- Shows on extension icon in toolbar
- ✓ = Page is safe
- ⚠ = Page has warnings  
- ! = Page is dangerous
- ? = Unable to scan

## Settings & Customization

### **Protection Levels**
1. **Basic**: Visual indicators only
2. **Standard**: Warnings for suspicious links
3. **Strict**: Auto-block dangerous sites

### **Notification Options**
- Browser notifications for threats
- Email alerts (requires account)
- Sound alerts (optional)

### **Whitelist/Blacklist**
- Add trusted sites to whitelist
- Manually block specific domains
- Import/export lists

## Troubleshooting

### **Extension Not Working**
1. Check if LinkGuard backend is running
2. Verify API URL in settings (default: `http://localhost:5001`)
3. Reload extension in `chrome://extensions/`
4. Check browser console for errors

### **Links Not Being Scanned**
1. Ensure "Real-time Protection" is enabled
2. Check if site allows content scripts
3. Try refreshing the page
4. Some sites may block extension access

### **API Connection Issues**
1. Verify backend server is running on port 5001
2. Check CORS settings in backend
3. Ensure no firewall blocking requests
4. Try different API URL in settings

### **Performance Issues**
1. Extension caches scan results for 5 minutes
2. Reduce scan frequency in settings
3. Disable on trusted internal sites
4. Clear extension cache in settings

## Privacy & Security

### **Data Collection**
- Only scans URLs you visit or click
- No personal browsing data stored
- Scan results cached locally only
- Optional account linking for features

### **API Communication**
- All requests to your LinkGuard server
- No third-party data sharing
- Encrypted HTTPS communication
- Local caching for performance

### **Permissions Explained**
- **activeTab**: Read current page URL
- **storage**: Save settings and cache
- **webNavigation**: Detect page navigation
- **declarativeNetRequest**: Block dangerous sites

## Development

### **File Structure**
```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (main logic)
├── content.js            # Page content scanning
├── content.css           # Visual indicator styles
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md             # This file
```

### **API Integration**
The extension uses your existing LinkGuard API:
```javascript
// Scan URL endpoint
POST /api/scan
{
  "url": "https://example.com"
}

// Response format
{
  "url": "https://example.com",
  "status": "safe|warning|danger",
  "riskScore": 25,
  "warnings": ["List of warnings"]
}
```

### **Customization**
- Modify `content.css` for different visual styles
- Update `background.js` for different scanning logic
- Change `popup.html` for custom interface
- Add new features in `content.js`

## Browser Compatibility

### **Supported Browsers**
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Opera
- ❌ Firefox (different manifest format)
- ❌ Safari (different extension system)

### **Firefox Version**
A Firefox-compatible version using Manifest V2 can be created separately.

## Updates & Maintenance

### **Manual Updates**
1. Download new extension files
2. Replace old files
3. Reload extension in browser
4. Clear cache if needed

### **Automatic Updates** (Future)
- Chrome Web Store handles updates
- Background updates without user action
- Notification of new features

## Support

### **Getting Help**
1. Check this README first
2. Review browser console errors
3. Test with LinkGuard web app
4. Report issues via extension popup

### **Common Issues**
- **"Failed to fetch"**: Backend not running
- **"CORS error"**: Backend CORS not configured
- **"Extension disabled"**: Check Chrome extensions page
- **"No indicators"**: Content script blocked by site

### **Reporting Bugs**
Use the "Report Issue" button in extension popup or contact:
- Email: support@linkguard.com
- Include: Browser version, extension version, error details

## Roadmap

### **Version 1.1** (Planned)
- Firefox compatibility
- Improved performance
- Custom threat categories
- Bulk whitelist import

### **Version 1.2** (Planned)
- Offline threat database
- Advanced filtering options
- Team/organization features
- Enhanced reporting

### **Version 2.0** (Future)
- AI-powered threat detection
- Real-time threat intelligence
- Advanced analytics
- Enterprise features

---

## Quick Start Checklist

- [ ] Copy extension files to folder
- [ ] Create required icon files
- [ ] Start LinkGuard backend server
- [ ] Load extension in Chrome
- [ ] Test on a website
- [ ] Configure settings as needed
- [ ] Enjoy real-time protection!

**Need help?** Check the troubleshooting section or contact support.