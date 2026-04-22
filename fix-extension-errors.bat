@echo off
echo ========================================
echo   🔧 LinkGuard Extension Error Fixer
echo ========================================
echo.

echo This script will help fix common extension errors:
echo 1. Missing PNG icons
echo 2. Backend connection issues
echo 3. Extension loading problems
echo 4. Dashboard not opening
echo.

:: Check if extension folder exists
if not exist "browser-extension" (
    echo ❌ Extension folder not found
    echo Please make sure you're in the LinkGuard root directory
    pause
    exit /b 1
)

echo ✅ Extension folder found
echo.

:: Fix 1: Check and create PNG icons
echo 🔍 Checking PNG icons...
set "icons_missing=0"

if not exist "browser-extension\icons\icon16.png" (
    echo ❌ Missing: icon16.png
    set "icons_missing=1"
)
if not exist "browser-extension\icons\icon32.png" (
    echo ❌ Missing: icon32.png
    set "icons_missing=1"
)
if not exist "browser-extension\icons\icon48.png" (
    echo ❌ Missing: icon48.png
    set "icons_missing=1"
)
if not exist "browser-extension\icons\icon128.png" (
    echo ❌ Missing: icon128.png
    set "icons_missing=1"
)

if %icons_missing%==1 (
    echo.
    echo 🚨 CRITICAL: PNG icons are missing!
    echo This is the most common cause of extension errors.
    echo.
    echo Opening icon converter...
    start browser-extension\icons\svg-to-png-converter.html
    echo.
    echo INSTRUCTIONS:
    echo 1. Download all 4 PNG files from the converter
    echo 2. Save them in browser-extension\icons\ folder
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
) else (
    echo ✅ All PNG icons found
)

:: Fix 2: Check backend
echo.
echo 🔍 Checking backend connection...
curl -s http://localhost:5001 >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend not running on localhost:5001
    echo.
    echo Starting backend...
    start "LinkGuard Backend" cmd /k "cd backend && npm run dev"
    echo ⏳ Waiting for backend to start...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Backend is running
)

:: Fix 3: Check frontend
echo.
echo 🔍 Checking frontend connection...
curl -s http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend not running on localhost:5173
    echo.
    echo Starting frontend...
    start "LinkGuard Frontend" cmd /k "cd frontend && npm run dev"
    echo ⏳ Waiting for frontend to start...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Frontend is running
)

:: Fix 4: Test API connection
echo.
echo 🔍 Testing API connection...
curl -X POST http://localhost:5001/api/scan -H "Content-Type: application/json" -d "{\"url\":\"https://google.com\"}" >nul 2>&1
if errorlevel 1 (
    echo ❌ API test failed
    echo.
    echo Possible solutions:
    echo 1. Check backend logs for errors
    echo 2. Verify .env configuration
    echo 3. Check MongoDB connection
) else (
    echo ✅ API is working
)

echo.
echo ========================================
echo   🛠️ Extension Loading Instructions
echo ========================================
echo.

echo 1. Open Chrome and go to: chrome://extensions/
echo 2. Enable "Developer mode" (top-right toggle)
echo 3. Click "Reload" on LinkGuard extension (if already loaded)
echo 4. OR click "Load unpacked" and select "browser-extension" folder
echo.

echo ========================================
echo   🧪 Testing Your Extension
echo ========================================
echo.

echo After loading the extension:
echo 1. Open: browser-extension\test-popup.html
echo 2. Click all test buttons
echo 3. Check for any error messages
echo 4. Right-click extension icon → "Inspect popup" to see console
echo.

echo ========================================
echo   🔍 Common Error Solutions
echo ========================================
echo.

echo ❌ "Extension failed to load"
echo    → Create PNG icons using converter
echo    → Check manifest.json syntax
echo.

echo ❌ "Failed to fetch" errors
echo    → Start backend: cd backend ^&^& npm run dev
echo    → Check CORS in backend server.js
echo.

echo ❌ "Dashboard not opening"
echo    → Start frontend: cd frontend ^&^& npm run dev
echo    → Check popup.js for correct URL
echo.

echo ❌ "No safety indicators"
echo    → Wait 5-10 seconds after page load
echo    → Check browser console for errors
echo    → Verify extension is enabled
echo.

echo Press any key to open the test page...
pause >nul
start browser-extension\test-popup.html