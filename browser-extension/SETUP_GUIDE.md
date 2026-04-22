# 🚀 LinkGuard Browser Extension - Complete Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Create PNG Icons (Required)
```bash
# 1. Open this file in your browser:
browser-extension/icons/svg-to-png-converter.html

# 2. Click "Download PNG" for each size
# 3. Save files as: icon16.png, icon32.png, icon48.png, icon128.png
# 4. Place all PNG files in browser-extension/icons/ folder
```

### Step 2: Start Your LinkGuard Backend
```bash
# Make sure your backend is running
cd backend
npm run dev

# Should show: Server running on port 5001
```

### Step 3: Load Extension in Chrome
```bash
# 1. Open Chrome and go to: chrome://extensions/
# 2. Enable "Developer mode" (toggle in top-right)
# 3. Click "Load unpacked"
# 4. Select the "browser-extension" folder
# 5. Extension should appear in toolbar
```

### Step 4: Test Extension
```bash
# 1. Click the LinkGuard icon in Chrome toolbar
# 2. Visit any website (like google.com)
# 3. You should see safety indicators on links
# 4. Extension popup should show page status
```

---

## 🔧 Detailed Setup Instructions

### Prerequisites Checklist
- [ ] Chrome browser installed
- [ ] LinkGuard backend running on localhost:5001
- [ ] Node.js and npm installed
- [ ] All extension files downloaded

### 1. Backend Setup (Must Be Running First)

#### Start Your LinkGuard Backend:
```bash
# Navigate to your backend folder
cd backend

# Install dependencies (if not done)
npm install

# Start the development server
npm run dev
```

#### Verify Backend is Running:
```bash
# You should see output like:
# Server running on port 5001
# Connected to MongoDB
# LinkGuard API ready

# Test API endpoint:
curl http://localhost:5001/api/scan -X POST -H "Content-Type: application/json" -d '{"url":"https://google.com"}'
```

### 2. Create Extension Icons

#### Method A: Use HTML Converter (Recommended)
```bash
# 1. Navigate to icons folder
cd browser-extension/icons/

# 2. Open converter in browser
# Double-click: svg-to-png-converter.html
# OR open in browser manually

# 3. Download all 4 PNG files:
# - Click "Download PNG" for 16x16 → Save as "icon16.png"
# - Click "Download PNG" for 32x32 → Save as "icon32.png"  
# - Click "Download PNG" for 48x48 → Save as "icon48.png"
# - Click "Download PNG" for 128x128 → Save as "icon128.png"

# 4. Move all PNG files to browser-extension/icons/ folder
```

#### Method B: Use Online Converter
```bash
# 1. Go to: https://convertio.co/svg-png/
# 2. Upload each SVG file (icon-16.svg, icon-32.svg, etc.)
# 3. Download converted PNG files
# 4. Rename to: icon16.png, icon32.png, icon48.png, icon128.png
```

### 3. Verify File Structure

Your folder should look like this:
```
browser-extension/
├── manifest.json
├── background.js
├── content.js
├── content.css
├── popup.html
├── popup.css
├── popup.js
├── icons/
│   ├── icon16.png     ← Required
│   ├── icon32.png     ← Required
│   ├── icon48.png     ← Required
│   ├── icon128.png    ← Required
│   └── (SVG files)    ← Optional
└── README.md
```

### 4. Load Extension in Chrome

#### Step-by-Step:
```bash
# 1. Open Chrome browser
# 2. Type in address bar: chrome://extensions/
# 3. Enable "Developer mode" (toggle switch in top-right)
# 4. Click "Load unpacked" button
# 5. Navigate to and select "browser-extension" folder
# 6. Click "Select Folder"
```

#### Success Indicators:
- Extension appears in extensions list
- LinkGuard icon appears in Chrome toolbar
- No error messages in extensions page

### 5. Configure Extension Settings

#### Open Extension Popup:
```bash
# 1. Click LinkGuard icon in Chrome toolbar
# 2. You should see popup with:
#    - Current page status
#    - Protection settings
#    - Statistics
```

#### Configure Settings:
```bash
# Enable these options:
☑️ Real-time Protection
☑️ Threat Notifications  
☐ Auto-block Dangerous (optional)
```

---

## 🐛 Common Errors & Solutions

### Error 1: "Extension failed to load"
**Cause**: Missing or incorrect manifest.json

**Solution**:
```bash
# Check manifest.json exists and is valid
# Verify all required files are present
# Make sure icons folder has PNG files
```

### Error 2: "Icons not found"
**Cause**: Missing PNG icon files

**Solution**:
```bash
# Create PNG files using converter tool
# Ensure exact filenames: icon16.png, icon32.png, icon48.png, icon128.png
# Place in browser-extension/icons/ folder
```

### Error 3: "Failed to fetch" in extension popup
**Cause**: Backend not running or wrong API URL

**Solution**:
```bash
# 1. Start backend server:
cd backend && npm run dev

# 2. Verify backend is running on port 5001
# 3. Check popup.js has correct API URL (http://localhost:5001/api)
```

### Error 4: "CORS error" in console
**Cause**: Backend CORS not configured for extension

**Solution**:
Add to your backend server.js:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'chrome-extension://*'],
  credentials: true
}));
```

### Error 5: "Content script injection failed"
**Cause**: Extension permissions or manifest issues

**Solution**:
```bash
# 1. Reload extension in chrome://extensions/
# 2. Check manifest.json permissions
# 3. Verify content.js file exists
```

### Error 6: Links not showing safety indicators
**Cause**: Content script not running or API issues

**Solution**:
```bash
# 1. Refresh the webpage
# 2. Check browser console for errors (F12)
# 3. Verify backend API is responding
# 4. Check extension is enabled in popup
```

---

## 🧪 Testing Your Extension

### Basic Functionality Test:
```bash
# 1. Visit google.com
# 2. Look for green checkmarks on links
# 3. Click extension icon - should show "Safe" status
# 4. Try visiting a test suspicious site
```

### Advanced Testing:
```bash
# 1. Test different websites:
#    - google.com (should be safe)
#    - facebook.com (should be safe)
#    - Any suspicious URLs from your LinkGuard tests

# 2. Check popup functionality:
#    - Current page status updates
#    - Settings toggles work
#    - Statistics show numbers

# 3. Test notifications:
#    - Enable notifications in popup
#    - Visit a high-risk URL
#    - Should see browser notification
```

---

## 🔧 Troubleshooting Commands

### Check Extension Status:
```bash
# 1. Go to chrome://extensions/
# 2. Find LinkGuard extension
# 3. Check for error messages
# 4. Click "Details" for more info
```

### View Extension Logs:
```bash
# 1. Right-click extension icon
# 2. Select "Inspect popup" 
# 3. Check Console tab for errors
# 4. Look for API call failures
```

### Test API Connection:
```bash
# Test your backend API directly:
curl -X POST http://localhost:5001/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'

# Should return JSON with scan results
```

### Reset Extension:
```bash
# If extension is broken:
# 1. Go to chrome://extensions/
# 2. Click "Remove" on LinkGuard
# 3. Reload extension using "Load unpacked"
# 4. Reconfigure settings
```

---

## ✅ Success Checklist

### Extension Loaded Successfully:
- [ ] Extension appears in chrome://extensions/
- [ ] LinkGuard icon visible in toolbar
- [ ] No error messages in extensions page
- [ ] Popup opens when clicking icon

### Backend Connection Working:
- [ ] Backend server running on port 5001
- [ ] API responds to test requests
- [ ] Extension popup shows current page status
- [ ] No "Failed to fetch" errors

### Visual Indicators Working:
- [ ] Links on websites show safety icons
- [ ] Green checkmarks appear on safe links
- [ ] Icons load within a few seconds
- [ ] Hover tooltips show threat details

### Settings & Features Working:
- [ ] Extension popup shows correct information
- [ ] Settings toggles work properly
- [ ] Statistics update correctly
- [ ] Notifications appear for threats

---

## 🚀 Quick Fix Commands

### Restart Everything:
```bash
# 1. Stop backend: Ctrl+C in terminal
# 2. Restart backend: npm run dev
# 3. Reload extension in chrome://extensions/
# 4. Refresh any open web pages
```

### Clear Extension Cache:
```bash
# 1. Go to chrome://extensions/
# 2. Click "Details" on LinkGuard
# 3. Click "Reload" button
# 4. Clear browser cache if needed
```

### Update API URL (if needed):
```javascript
// Edit browser-extension/background.js
// Change this line if your backend runs on different port:
this.apiUrl = 'http://localhost:5001/api'; // Update port if needed
```

---

## 📞 Getting Help

### If Extension Still Doesn't Work:

1. **Check Browser Console**:
   - Press F12 on any webpage
   - Look for LinkGuard-related errors
   - Note any red error messages

2. **Check Extension Console**:
   - Right-click extension icon
   - Select "Inspect popup"
   - Check Console tab for errors

3. **Verify Backend**:
   - Ensure backend runs without errors
   - Test API endpoints manually
   - Check CORS configuration

4. **Common Solutions**:
   - Restart Chrome browser
   - Reload extension
   - Clear browser cache
   - Check file permissions

### Still Need Help?
- Check the README.md file
- Review error messages carefully
- Test with a fresh Chrome profile
- Ensure all files are in correct locations

---

## 🎉 You're Ready!

Once everything is working, you should see:
- ✅ LinkGuard icon in Chrome toolbar
- ✅ Safety indicators on website links  
- ✅ Working popup with page status
- ✅ Real-time protection while browsing

**Your users now have real-time protection while browsing the web!** 🛡️