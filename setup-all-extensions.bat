@echo off
echo ========================================
echo   🛡️ LinkGuard Extensions Setup
echo ========================================
echo.

echo This script will help you set up LinkGuard extensions for:
echo 🟦 Chrome
echo 🟧 Firefox  
echo 🟩 Microsoft Edge
echo.

:: Check if extension folders exist
if not exist "browser-extension" (
    echo ❌ Chrome extension folder not found
    echo Please make sure you have the browser-extension folder
    pause
    exit /b 1
)

if not exist "browser-extension-firefox" (
    echo ❌ Firefox extension folder not found
    echo Please make sure you have the browser-extension-firefox folder
    pause
    exit /b 1
)

if not exist "browser-extension-edge" (
    echo ❌ Edge extension folder not found
    echo Please make sure you have the browser-extension-edge folder
    pause
    exit /b 1
)

echo ✅ All extension folders found
echo.

:: Check for PNG icons
echo 📦 Checking for PNG icons...
set "icons_needed=0"

if not exist "browser-extension\icons\icon16.png" set "icons_needed=1"
if not exist "browser-extension\icons\icon32.png" set "icons_needed=1"
if not exist "browser-extension\icons\icon48.png" set "icons_needed=1"
if not exist "browser-extension\icons\icon128.png" set "icons_needed=1"

if %icons_needed%==1 (
    echo ⚠️ PNG icons not found!
    echo.
    echo You need to create PNG icons first:
    echo 1. Open: browser-extension\icons\svg-to-png-converter.html
    echo 2. Download all 4 PNG files
    echo 3. Place them in the icons folders
    echo.
    echo Press any key to open the icon converter...
    pause >nul
    start browser-extension\icons\svg-to-png-converter.html
    echo.
    echo After creating icons, run this script again.
    pause
    exit /b 1
)

echo ✅ PNG icons found
echo.

:: Copy icons to all extension folders
echo 📋 Copying icons to all extension folders...

:: Create icons folders if they don't exist
if not exist "browser-extension-firefox\icons" mkdir "browser-extension-firefox\icons"
if not exist "browser-extension-edge\icons" mkdir "browser-extension-edge\icons"

:: Copy icons
copy "browser-extension\icons\*.png" "browser-extension-firefox\icons\" >nul 2>&1
copy "browser-extension\icons\*.png" "browser-extension-edge\icons\" >nul 2>&1

echo ✅ Icons copied to all extension folders
echo.

:: Copy shared files
echo 📋 Copying shared files...

:: Copy CSS and HTML files
copy "browser-extension\content.css" "browser-extension-edge\" >nul 2>&1
copy "browser-extension\popup.html" "browser-extension-firefox\" >nul 2>&1
copy "browser-extension\popup.html" "browser-extension-edge\" >nul 2>&1
copy "browser-extension\popup.css" "browser-extension-firefox\" >nul 2>&1
copy "browser-extension\popup.css" "browser-extension-edge\" >nul 2>&1

echo ✅ Shared files copied
echo.

:: Check if backend is running
echo 🔍 Checking LinkGuard backend...
curl -s http://localhost:5001 >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Backend not running on localhost:5001
    echo.
    echo Starting LinkGuard backend...
    start "LinkGuard Backend" cmd /k "cd backend && npm run dev"
    echo Waiting for backend to start...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Backend is running
)

echo.
echo ========================================
echo   🚀 Extension Installation Guide
echo ========================================
echo.

echo 🟦 CHROME EXTENSION:
echo 1. Open Chrome
echo 2. Go to: chrome://extensions/
echo 3. Enable "Developer mode"
echo 4. Click "Load unpacked"
echo 5. Select "browser-extension" folder
echo.

echo 🟧 FIREFOX EXTENSION:
echo 1. Open Firefox
echo 2. Go to: about:debugging
echo 3. Click "This Firefox"
echo 4. Click "Load Temporary Add-on"
echo 5. Select "browser-extension-firefox\manifest.json"
echo.

echo 🟩 MICROSOFT EDGE EXTENSION:
echo 1. Open Microsoft Edge
echo 2. Go to: edge://extensions/
echo 3. Enable "Developer mode"
echo 4. Click "Load unpacked"
echo 5. Select "browser-extension-edge" folder
echo.

echo ========================================
echo   ✅ Setup Complete!
echo ========================================
echo.

echo 🧪 Testing Your Extensions:
echo 1. Install extensions using steps above
echo 2. Visit any website (like google.com)
echo 3. Look for safety indicators on links
echo 4. Click extension icon to open popup
echo.

echo 📚 For detailed help, see:
echo - BROWSER_EXTENSIONS_GUIDE.md
echo - browser-extension\README.md
echo.

echo Press any key to open the detailed guide...
pause >nul
start BROWSER_EXTENSIONS_GUIDE.md