# 🌐 LinkGuard Browser Extensions - Complete Guide

## 📋 Overview

LinkGuard now supports **3 major browsers**:
- 🟦 **Chrome** (Manifest V3)
- 🟧 **Firefox** (Manifest V2) 
- 🟩 **Microsoft Edge** (Manifest V3)

Each extension provides real-time URL protection while browsing.

---

## 🚀 Quick Setup for All Browsers

### Step 1: Prepare Icons (Required for All)
```bash
# Navigate to any extension folder
cd browser-extension/icons/

# Open the converter in your browser
# Double-click: svg-to-png-converter.html

# Download all 4 PNG files:
# - icon16.png, icon32.png, icon48.png, icon128.png

# Copy these PNG files to ALL extension folders:
# - browser-extension/icons/
# - browser-extension-firefox/icons/
# - browser-extension-edge/icons/
```

### Step 2: Start LinkGuard Backend
```bash
cd backend
npm run dev
# Must be running on http://localhost:5001
```

---

## 🟦 Chrome Extension Setup

### Installation Steps:
```bash
# 1. Open Chrome
# 2. Go to: chrome://extensions/
# 3. Enable "Developer mode" (top-right toggle)
# 4. Click "Load unpacked"
# 5. Select "browser-extension" folder
# 6. Extension appears in toolbar
```

### Features:
- ✅ Real-time URL scanning
- ✅ Visual safety indicators
- ✅ Click protection
- ✅ Browser notifications
- ✅ Popup dashboard

### Files:
```
browser-extension/
├── manifest.json (Manifest V3)
├── background.js (Service Worker)
├── content.js
├── popup.html/css/js
└── icons/ (PNG files)
```

---

## 🟧 Firefox Extension Setup

### Installation Steps:
```bash
# Method 1: Temporary Installation (Development)
# 1. Open Firefox
# 2. Go to: about:debugging
# 3. Click "This Firefox"
# 4. Click "Load Temporary Add-on"
# 5. Select "browser-extension-firefox/manifest.json"
# 6. Extension appears in toolbar

# Method 2: Permanent Installation (Advanced)
# 1. Package as .xpi file
# 2. Sign with Mozilla
# 3. Install normally
```

### Firefox-Specific Features:
- ✅ Uses `browser` API instead of `chrome`
- ✅ Manifest V2 compatibility
- ✅ Firefox-specific permissions
- ✅ Works with Firefox containers

### Files:
```
browser-extension-firefox/
├── manifest.json (Manifest V2)
├── background.js (Background Script)
├── content.js (Firefox API)
├── popup.html/css/js
└── icons/ (PNG files)
```

### Key Differences from Chrome:
- Uses `browser.*` instead of `chrome.*`
- `browserAction` instead of `action`
- Different permission model
- Manifest V2 format

---

## 🟩 Microsoft Edge Extension Setup

### Installation Steps:
```bash
# 1. Open Microsoft Edge
# 2. Go to: edge://extensions/
# 3. Enable "Developer mode" (left sidebar)
# 4. Click "Load unpacked"
# 5. Select "browser-extension-edge" folder
# 6. Extension appears in toolbar
```

### Edge-Specific Features:
- ✅ Same as Chrome (Chromium-based)
- ✅ Manifest V3 support
- ✅ Edge-specific optimizations
- ✅ Works with Edge Collections

### Files:
```
browser-extension-edge/
├── manifest.json (Manifest V3)
├── background.js (Service Worker)
├── content.js (Same as Chrome)
├── popup.html/css/js
└── icons/ (PNG files)
```

---

## 🔧 Browser-Specific Instructions

### 🟦 Chrome Detailed Setup

#### Prerequisites:
- Chrome 88+ required
- Developer mode enabled

#### Step-by-Step:
1. **Open Extensions Page**:
   - Type `chrome://extensions/` in address bar
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" in top-right

3. **Load Extension**:
   - Click "Load unpacked"
   - Navigate to `browser-extension` folder
   - Click "Select Folder"

4. **Verify Installation**:
   - LinkGuard icon appears in toolbar
   - No errors in extensions page
   - Click icon to open popup

#### Troubleshooting Chrome:
```bash
# Common issues:
# - "Manifest file is missing" → Check manifest.json exists
# - "Icons not found" → Create PNG files first
# - "Service worker failed" → Check background.js syntax
```

### 🟧 Firefox Detailed Setup

#### Prerequisites:
- Firefox 57+ required
- Developer tools access

#### Step-by-Step:
1. **Open Debugging Page**:
   - Type `about:debugging` in address bar
   - Click "This Firefox" in sidebar

2. **Load Temporary Add-on**:
   - Click "Load Temporary Add-on..."
   - Navigate to `browser-extension-firefox` folder
   - Select `manifest.json` file

3. **Verify Installation**:
   - Extension appears in add-ons list
   - LinkGuard icon in toolbar
   - Check for any error messages

#### Firefox Permanent Installation:
```bash
# For permanent installation:
# 1. Package extension as .xpi
# 2. Sign with Mozilla Developer account
# 3. Submit to Firefox Add-ons store
# OR install unsigned in Developer Edition
```

#### Troubleshooting Firefox:
```bash
# Common issues:
# - "Invalid manifest" → Check Manifest V2 format
# - "API not available" → Use browser.* instead of chrome.*
# - "Temporary add-on removed" → Reload after Firefox restart
```

### 🟩 Edge Detailed Setup

#### Prerequisites:
- Microsoft Edge 79+ required
- Developer mode enabled

#### Step-by-Step:
1. **Open Extensions Page**:
   - Type `edge://extensions/` in address bar
   - Or: Menu → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" in left sidebar

3. **Load Extension**:
   - Click "Load unpacked"
   - Navigate to `browser-extension-edge` folder
   - Click "Select Folder"

4. **Verify Installation**:
   - LinkGuard icon appears in toolbar
   - Extension listed in extensions page
   - Test popup functionality

#### Troubleshooting Edge:
```bash
# Common issues:
# - Same as Chrome (Chromium-based)
# - Check manifest.json format
# - Verify PNG icons exist
# - Ensure backend is running
```

---

## 🧪 Testing Your Extensions

### Universal Test Steps:
1. **Install Extension** (browser-specific steps above)
2. **Start Backend**: `cd backend && npm run dev`
3. **Visit Test Page**: Open `browser-extension/test-extension.html`
4. **Check Indicators**: Look for safety icons on links
5. **Test Popup**: Click extension icon in toolbar

### Browser-Specific Testing:

#### Chrome Testing:
```bash
# 1. Load extension in chrome://extensions/
# 2. Visit google.com
# 3. Look for green checkmarks on links
# 4. Click LinkGuard icon → should show popup
# 5. Check browser console for errors (F12)
```

#### Firefox Testing:
```bash
# 1. Load temporary add-on in about:debugging
# 2. Visit google.com  
# 3. Look for green checkmarks on links
# 4. Click LinkGuard icon → should show popup
# 5. Check browser console for errors (F12)
```

#### Edge Testing:
```bash
# 1. Load extension in edge://extensions/
# 2. Visit google.com
# 3. Look for green checkmarks on links
# 4. Click LinkGuard icon → should show popup
# 5. Check browser console for errors (F12)
```

---

## 🔍 Troubleshooting All Browsers

### Common Issues Across All Browsers:

#### 1. "Extension failed to load"
```bash
# Solutions:
# - Create PNG icons using svg-to-png-converter.html
# - Check manifest.json syntax
# - Verify all required files exist
# - Check file permissions
```

#### 2. "Failed to fetch" errors
```bash
# Solutions:
# - Start backend: cd backend && npm run dev
# - Check backend runs on localhost:5001
# - Verify CORS configuration
# - Check firewall settings
```

#### 3. "No safety indicators appear"
```bash
# Solutions:
# - Wait 5-10 seconds for scanning
# - Refresh the webpage
# - Check extension is enabled
# - Verify backend API is responding
```

#### 4. "CORS errors in console"
```bash
# Solution - Add to backend server.js:
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',
    'chrome-extension://*',
    'moz-extension://*'
  ],
  credentials: true
}));
```

### Browser-Specific Issues:

#### Chrome Issues:
- **Service Worker errors**: Check background.js syntax
- **Manifest V3 issues**: Verify permissions format
- **Action API**: Use `chrome.action` not `browserAction`

#### Firefox Issues:
- **API differences**: Use `browser.*` not `chrome.*`
- **Manifest V2**: Different format than Chrome
- **Temporary add-on**: Reloads needed after restart

#### Edge Issues:
- **Same as Chrome**: Chromium-based, similar issues
- **Developer mode**: Must be enabled in sidebar
- **Extension store**: Different from Chrome Web Store

---

## 📊 Feature Comparison

| Feature | Chrome | Firefox | Edge |
|---------|--------|---------|------|
| Real-time Scanning | ✅ | ✅ | ✅ |
| Visual Indicators | ✅ | ✅ | ✅ |
| Click Protection | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |
| Popup Dashboard | ✅ | ✅ | ✅ |
| Auto-updates | ✅ | ✅ | ✅ |
| Manifest Version | V3 | V2 | V3 |
| API Namespace | chrome.* | browser.* | chrome.* |

---

## 🚀 Distribution & Publishing

### Chrome Web Store:
```bash
# 1. Create developer account
# 2. Package extension as .zip
# 3. Upload to Chrome Web Store
# 4. Fill store listing details
# 5. Submit for review
```

### Firefox Add-ons:
```bash
# 1. Create Mozilla developer account
# 2. Package as .xpi file
# 3. Submit to addons.mozilla.org
# 4. Pass automated review
# 5. Manual review if needed
```

### Microsoft Edge Add-ons:
```bash
# 1. Create Partner Center account
# 2. Package extension as .zip
# 3. Upload to Edge Add-ons store
# 4. Fill store listing
# 5. Submit for certification
```

---

## 🎉 Success Checklist

When all extensions are working correctly:

### ✅ Chrome Extension:
- [ ] Loads without errors in chrome://extensions/
- [ ] Icon appears in toolbar
- [ ] Safety indicators show on links
- [ ] Popup opens and functions
- [ ] Backend communication works

### ✅ Firefox Extension:
- [ ] Loads as temporary add-on
- [ ] Icon appears in toolbar
- [ ] Safety indicators show on links
- [ ] Popup opens and functions
- [ ] Browser API calls work

### ✅ Edge Extension:
- [ ] Loads without errors in edge://extensions/
- [ ] Icon appears in toolbar
- [ ] Safety indicators show on links
- [ ] Popup opens and functions
- [ ] Backend communication works

### ✅ All Browsers:
- [ ] Backend running on localhost:5001
- [ ] PNG icons created and placed
- [ ] No CORS errors in console
- [ ] Extensions communicate with API
- [ ] Real-time protection active

---

## 📞 Getting Help

### Check Browser Console:
- Press F12 on any webpage
- Look for LinkGuard-related errors
- Check Network tab for API calls

### Extension-Specific Debugging:
- **Chrome**: Right-click extension icon → "Inspect popup"
- **Firefox**: about:debugging → Extension details
- **Edge**: Right-click extension icon → "Inspect popup"

### Common Solutions:
1. Restart browser
2. Reload extension
3. Clear browser cache
4. Check backend is running
5. Verify PNG icons exist

**Your LinkGuard extensions are now ready to protect users across all major browsers!** 🛡️