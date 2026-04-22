@echo off
echo ========================================
echo   LinkGuard - AI-Powered Link Safety Checker
echo ========================================
echo.

REM Kill any existing processes on ports 5001 and 5173
echo Checking for existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1

echo.
echo Starting Backend Server (Port 5001)...
start "LinkGuard Backend" cmd /k "cd backend && node server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
start "LinkGuard Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo   Backend:  http://localhost:5001
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
