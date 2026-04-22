@echo off
echo ========================================
echo LinkGuard Universal Browser Extension
echo ========================================
echo.

echo This script will help you install LinkGuard extension in all supported browsers.
echo.

echo Available installation options:
echo 1. Standalone Web App (No installation required)
echo 2. Chrome/Edge/Brave Extension
echo 3. Firefox Extension
echo 4. All Browsers
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto standalone
if "%choice%"=="2" goto chrome
if "%choice%"=="3" goto firefox
if "%choice%"=="4" goto all
goto invalid

:standalone
echo.
echo ========================================
echo Opening Standalone Web App
echo ========================================
echo.
echo The LinkGuard scanner will open in your default browser.
echo You can bookmark this page for easy access.
echo No installation required!
echo.
start "" "linkguard-universal.html"
echo Done! LinkGuard is now running in your browser.
goto end

:chrome
echo.
echo ========================================
echo Chrome/Edge/Brave Installation
echo ========================================
echo.
echo Follow these steps:
echo 1. Open Chrome/Edge/Brave browser
echo 2. Go to chrome://extensions/ or edge://extensions/
echo 3. Enable "Developer mode" (toggle in top right)
echo 4. Click "Load unpacked"
echo 5. Select this folder: %cd%
echo 6. The extension will appear in your toolbar
echo.
echo Opening extensions page...
start "" "chrome://extensions/"
echo.
echo Manual steps required - see instructions above.
goto end

:firefox
echo.
echo ========================================
echo Firefox Installation
echo ========================================
echo.
echo Follow these steps:
echo 1. Open Firefox browser
echo 2. Go to about:debugging
echo 3. Click "This Firefox"
echo 4. Click "Load Temporary Add-on"
echo 5. Select: manifest-universal.json
echo 6. The extension will be loaded temporarily
echo.
echo Opening debugging page...
start "" "firefox" "about:debugging"
echo.
echo Manual steps required - see instructions above.
goto end

:all
echo.
echo ========================================
echo Installing for All Browsers
echo ========================================
echo.
echo Opening standalone version...
start "" "linkguard-universal.html"
echo.
echo Opening Chrome extensions...
start "" "chrome://extensions/"
echo.
echo Opening Firefox debugging...
start "" "firefox" "about:debugging"
echo.
echo Please follow the manual installation steps for each browser.
echo See README-UNIVERSAL.md for detailed instructions.
goto end

:invalid
echo.
echo Invalid choice. Please run the script again and choose 1-4.
goto end

:end
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo For help and documentation, see:
echo - README-UNIVERSAL.md
echo - linkguard-universal.html (standalone version)
echo.
echo The extension provides:
echo ✓ Real-time URL protection
echo ✓ Malware and phishing detection  
echo ✓ Risk score analysis
echo ✓ Visual safety indicators
echo ✓ Works in all browsers
echo.
pause