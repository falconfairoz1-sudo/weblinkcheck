#!/bin/bash

echo ""
echo "==============================================="
echo "   🛡️  LinkGuard - AI Link Safety Checker"
echo "==============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating .env file..."
    cp "backend/.env.example" "backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env with your configuration!"
    echo "   - Set your MongoDB URI"
    echo "   - Add your API keys (optional but recommended)"
    echo ""
    echo "Press Enter to continue after editing .env file..."
    
    # Try to open .env file with available editors
    if command -v code &> /dev/null; then
        code "backend/.env"
    elif command -v nano &> /dev/null; then
        nano "backend/.env"
    elif command -v vim &> /dev/null; then
        vim "backend/.env"
    else
        echo "Please edit backend/.env manually"
    fi
    
    read -p ""
fi

echo ""
echo "🧪 Testing setup..."
cd backend
node test-apis.js
cd ..

echo ""
echo "🚀 Starting LinkGuard..."
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

npm run dev