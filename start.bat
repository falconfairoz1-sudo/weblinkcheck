@echo off
echo.
echo ===============================================
echo    🛡️  LinkGuard - AI Link Safety Checker
echo ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

if not exist "backend/node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
)

if not exist "frontend/node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist "backend/.env" (
    echo ⚙️  Creating .env file...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo ⚠️  IMPORTANT: Please edit backend/.env with your configuration!
    echo    - Set your MongoDB URI
    echo    - Add your API keys (optional but recommended)
    echo.
    echo Press any key to open .env file for editing...
    pause >nul
    notepad "backend\.env"
)

echo.
echo 🧪 Testing setup...
cd backend
call node test-apis.js
cd ..

echo.
echo 🚀 Starting LinkGuard...
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo.

call npm run dev