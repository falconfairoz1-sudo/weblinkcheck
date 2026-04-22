# 🔧 LinkGuard Extension Debug Guide

## 🚨 Common Extension Errors & Fixes

### Error 1: Extension Not Loading
**Symptoms**: Extension doesn't appear in toolbar, errors in chrome://extensions/

**Solutions**:
1. **Check PNG Icons**:
   ```bash
   # Icons MUST exist:
   browser-extension/icons/icon16.png
   browser-extension/icons/icon32.png  
   browser-extension/icons/icon48.png
   browser-extension/icons/icon128.png
   ```

2. **Create Icons**:
   - Open `browser-extension/icons/svg-to-png-converter.html`
   - Download all 4 PNG files
   - Place in `browser-extension/icons/` folder

### Error 2: Popup Not Opening
**Symptoms**: Click extension icon, nothing happens

**Solutions**:
1. **Check Console Errors**:
   - Right-click extension icon
   - Select "Inspect popup"
   - Check Console tab for errors

2. **Common Fixes**:
   - Ensure `popup.html` exists
   - Check `popup.js` for syntax errors
   - Verify CSS file paths

### Error 3: Dashboard Not Opening
**Symptoms**: Click "Open Dashboard" button, nothing happens

**Solutions**:
1. **Check Backend Running**:
   ```bash
   cd backend
   npm run dev
   # Should show: Server running on port 5001
   ```

2. **Fix Dashboard URL**:
   - Update popup.js with correct URL
   - Default should be: http://localhost:5173

### Error 4: No Safety Indicators
**Symptoms**: Visit websites, no green/red icons appear on links

**Solutions**:
1. **Check Backend API**:
   ```bash
   # Test API directly:
   curl -X POST http://localhost:5001/api/scan \
     -H "Content-Type: application/json" \
     -d '{"url":"https://google.com"}'
   ```

2. **Check CORS Settings**:
   - Add to backend server.js:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173', 'chrome-extension://*'],
     credentials: true
   }));
   ```

## 🔍 Step-by-Step Debugging

### Step 1: Check Extension Loading
```bash
# 1. Go to chrome://extensions/
# 2. Find LinkGuard extension
# 3. Check for error messages
# 4. If errors, note them down
```

### Step 2: Check Backend Connection
```bash
# 1. Open browser console (F12)
# 2. Go to Network tab
# 3. Click extension icon
# 4. Look for failed API calls
```

### Step 3: Check Popup Errors
```bash
# 1. Right-click extension icon
# 2. Select "Inspect popup"
# 3. Check Console for errors
# 4. Check Network tab for failed requests
```

### Step 4: Test API Manually
```bash
# Open browser console and run:
fetch('http://localhost:5001/api/scan', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({url: 'https://google.com'})
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## 🛠️ Quick Fixes

### Fix 1: Reload Extension
```bash
# 1. Go to chrome://extensions/
# 2. Find LinkGuard
# 3. Click "Reload" button
# 4. Test again
```

### Fix 2: Clear Extension Data
```bash
# 1. Go to chrome://extensions/
# 2. Click "Details" on LinkGuard
# 3. Click "Extension options"
# 4. Clear any stored data
```

### Fix 3: Check File Permissions
```bash
# Make sure all files are readable:
# - manifest.json
# - background.js
# - content.js
# - popup.html/css/js
# - All PNG icons
```

## 📋 Troubleshooting Checklist

- [ ] PNG icons exist in icons/ folder
- [ ] Backend running on localhost:5001
- [ ] No errors in chrome://extensions/
- [ ] Extension icon visible in toolbar
- [ ] Popup opens when clicking icon
- [ ] No console errors in popup
- [ ] API calls succeed in Network tab
- [ ] CORS configured in backend
- [ ] All files have correct permissions

## 🚀 Test Commands

### Test Backend API:
```bash
curl http://localhost:5001/api/scan \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

### Test Extension Popup:
```javascript
// Run in popup console:
chrome.runtime.sendMessage({action: 'getSettings'}, console.log);
```

### Test Content Script:
```javascript
// Run in webpage console:
console.log(document.querySelectorAll('.linkguard-indicator').length);
```