# 🚀 LinkGuard Setup & Run Instructions

## 📋 Prerequisites

Before running LinkGuard, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **MongoDB** running (local or cloud)
- **Git** installed
- **Terminal/Command Prompt** access

## 🔥 Quick Start (3 Steps)

### 1. **Automated Setup**
```bash
npm run setup
```

### 2. **Configure Environment**
```bash
cd backend
# Edit .env file with your settings
notepad .env     # Windows
nano .env        # Linux/Mac
code .env        # VS Code
```

**Required .env configuration:**
```env
# Database (Required)
MONGODB_URI=mongodb://localhost:27017/link_safety_checker

# Security (Required)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# API Keys (Optional but recommended)
GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

### 3. **Start Application**
```bash
cd ..
npm run dev
```

**🎉 Your app will be running at:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🛠️ Manual Setup (Step by Step)

### Step 1: Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install

# Return to root
cd ..
```

### Step 2: Setup MongoDB

#### **Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow official MongoDB installation guide

# Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### **Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string
4. Use in your .env file

### Step 3: Get API Keys (Optional)

#### **Google Safe Browsing API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "Safe Browsing API"
4. Create API Key in Credentials
5. Copy key to .env file

#### **VirusTotal API**
1. Sign up at [VirusTotal](https://www.virustotal.com/)
2. Go to your profile → API Key
3. Copy key to .env file

### Step 4: Configure Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/link_safety_checker
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/link_safety_checker

# Security
JWT_SECRET=change_this_to_a_very_long_random_string_in_production
JWT_EXPIRES_IN=7d

# API Keys (Optional)
GOOGLE_SAFE_BROWSING_API_KEY=AIzaSyBvOkBw0QxcDefghijklmnopQrStUvWxYz
VIRUSTOTAL_API_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Step 5: Test Your Setup
```bash
cd backend
node test-apis.js
```

**Expected output:**
```
🛡️  LinkGuard API Testing Suite (Simplified)

🔍 Testing MongoDB Connection
✅ MongoDB connection successful!

🔍 Testing Google Safe Browsing API
✅ Google Safe Browsing API is working!

🔍 Testing VirusTotal API
✅ VirusTotal API is working!

Summary: 3/3 services working
✅ Core functionality available - MongoDB is connected
🚀 LinkGuard is ready to run!
```

### Step 6: Start Development Servers
```bash
# From root directory
npm run dev
```

This starts both servers:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

---

## 🎯 Available Scripts

```bash
# Setup everything automatically
npm run setup

# Start both frontend and backend
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend  
npm run dev:frontend

# Test API connections
npm run test:apis

# Build for production
npm run build

# Start production server
npm start
```

---

## 🚨 Troubleshooting

### **MongoDB Connection Issues**
```bash
# Check if MongoDB is running
# Windows: 
sc query MongoDB

# macOS/Linux:
brew services list | grep mongodb
# OR
sudo systemctl status mongod

# Start MongoDB if not running
# Windows: net start MongoDB
# macOS: brew services start mongodb-community  
# Linux: sudo systemctl start mongod
```

### **Port Already in Use**
```bash
# Kill process on port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

### **API Key Issues**
```bash
# Test individual APIs
cd backend
node test-apis.js

# Check .env file exists and has correct format
ls -la .env
cat .env
```

### **Dependencies Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json  
rm -rf frontend/node_modules frontend/package-lock.json

# Reinstall everything
npm run setup
```

---

## 🌟 First Time Usage

1. **Open your browser** → http://localhost:5173
2. **Test the scanner** with a URL like `https://google.com`
3. **Create an account** to save scan history
4. **Explore the dashboard** to see statistics
5. **Try bulk scanning** with multiple URLs

---

## 🔒 Production Deployment

### **Environment Variables for Production**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=very_long_random_string_for_production
GOOGLE_SAFE_BROWSING_API_KEY=your_production_api_key
VIRUSTOTAL_API_KEY=your_production_api_key
```

### **Build and Deploy**
```bash
# Build frontend
npm run build

# Start production server
npm start
```

---

## 💡 Tips for Best Experience

1. **Use API Keys** - Significantly improves threat detection
2. **MongoDB Atlas** - Easier than local MongoDB setup
3. **Chrome/Firefox** - Best browser compatibility
4. **Fast Internet** - For real-time API calls
5. **Keep Updated** - Regular npm updates

---

## 🆘 Need Help?

- **Check console** for error messages
- **Verify .env file** has correct format
- **Ensure MongoDB** is running
- **Test APIs individually** with test script
- **Check firewall** isn't blocking ports 5000/5173

**🛡️ Your beautiful LinkGuard application is ready to protect against malicious links!**