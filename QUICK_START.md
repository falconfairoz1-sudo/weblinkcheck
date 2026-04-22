# 🚀 Quick Start Guide - LinkGuard

## ✅ Problem Solved!
The "EADDRINUSE" error has been fixed by changing the backend port from **5000** to **5001**.

---

## 🎯 How to Start Your Application

### Option 1: Use the Batch Script (Easiest)
Simply double-click the `start-app.bat` file in the root directory. It will:
- Kill any existing processes on ports 5001 and 5173
- Start the backend server
- Start the frontend server
- Open both in separate command windows

### Option 2: Manual Start

#### Terminal 1 - Backend:
```bash
cd backend
node server.js
```
✅ Backend will run on: **http://localhost:5001**

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
✅ Frontend will run on: **http://localhost:5173**

---

## 🌐 Access Your Application

Open your browser and go to:
```
http://localhost:5173
```

The frontend will automatically proxy API requests to the backend on port 5001.

---

## 🔧 Configuration Changes Made

### 1. Backend Port Changed
- **File**: `backend/.env`
- **Old**: `PORT=5000`
- **New**: `PORT=5001`

### 2. Frontend Proxy Updated
- **File**: `frontend/vite.config.js`
- **Proxy target**: `http://localhost:5001`

---

## ❌ Troubleshooting

### If you still get "EADDRINUSE" error:

#### Check what's using the port:
```bash
netstat -ano | findstr :5001
```

#### Kill the process (replace PID with actual number):
```bash
taskkill /PID <PID> /F
```

### If frontend can't connect to backend:
1. Make sure backend is running on port 5001
2. Check `frontend/vite.config.js` proxy settings
3. Restart both servers

---

## 🎉 Your APIs Configured

✅ **Google Safe Browsing API** - Working  
✅ **VirusTotal API** - Working  
✅ **MongoDB Atlas** - Connected  
✅ **No PhishTank/WHOIS** - Removed for simplicity

---

## 📝 Quick Test

Once both servers are running, try scanning a URL:
```
https://www.google.com
```

You should see:
- ✅ Safe status
- Low risk score
- Analysis from Google Safe Browsing and VirusTotal
- AI heuristic analysis

---

## 🆘 Need Help?

If you encounter any issues:
1. Check both terminal windows for error messages
2. Verify MongoDB connection string in `backend/.env`
3. Ensure API keys are valid in `backend/.env`
4. Make sure ports 5001 and 5173 are not blocked by firewall

---

**Happy scanning! 🛡️**
