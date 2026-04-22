# 🚀 Quick API Setup Reference (Simplified)

## 🔥 Super Fast Setup (3 minutes)

### 1. **Automated Setup**
```bash
npm run setup
```

### 2. **Test Your APIs**
```bash
npm run test:apis
```

### 3. **Start Development**
```bash
npm run dev
```

---

## 🔑 API Keys Quick Links (Simplified)

| Service | Get API Key | Free Tier | Setup Time |
|---------|-------------|-----------|------------|
| **🔵 Google Safe Browsing** | [Console](https://console.cloud.google.com/) | 10K/day | 2 min |
| **🟢 VirusTotal** | [My API Key](https://www.virustotal.com/gui/my-apikey) | 500/day | 1 min |

*Note: PhishTank and WHOIS APIs removed for simplicity. This setup provides comprehensive threat detection.*

---

## ⚡ Copy-Paste Environment Setup

### 1. Copy your `.env` file:
```bash
cd backend
cp .env.example .env
```

### 2. Edit with your keys:
```env
# Database (Required)
MONGODB_URI=mongodb://localhost:27017/link_safety_checker

# Security (Required)
JWT_SECRET=change_this_to_a_random_string_in_production

# API Keys (Optional but recommended)
GOOGLE_SAFE_BROWSING_API_KEY=AIzaSyBvOkBw0QxcDefghijklmnopQrStUvWxYz
VIRUSTOTAL_API_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## 🎯 Priority Setup Order

### **Level 1: Essential (Required)**
1. ✅ **MongoDB** - Database connection
2. ✅ **JWT_SECRET** - Authentication security

### **Level 2: Enhanced Detection (Simplified)**
3. 🔵 **Google Safe Browsing** - Best threat detection
4. 🟢 **VirusTotal** - Malware scanning

*Complete coverage with just 2 APIs + AI Heuristics!*

---

## 🔥 One-Liner API Key Setup

### Google Safe Browsing (2 minutes)
```bash
# 1. Go to: https://console.cloud.google.com/
# 2. Create project → Enable "Safe Browsing API" → Create API Key
# 3. Copy key to .env file
```

### VirusTotal (1 minute)
```bash
# 1. Sign up: https://www.virustotal.com/
# 2. Go to profile → API Key → Copy
# 3. Paste in .env file
```

---

## 🧪 Test Your Setup

```bash
# Test all APIs at once
npm run test:apis

# Expected output:
# ✅ MongoDB
# ✅ Google Safe Browsing  
# ✅ VirusTotal
# 🚀 LinkGuard is ready to run!
```

---

## 🚨 Common Issues & Fixes

### ❌ "API key not configured"
```bash
# Check .env file exists and has correct keys
ls backend/.env
cat backend/.env | grep API_KEY
```

### ❌ "MongoDB connection failed"
```bash
# Start local MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
net start MongoDB                     # Windows

# Or use MongoDB Atlas (cloud)
# Get connection string from: https://cloud.mongodb.com/
```

### ❌ "Quota exceeded"
```bash
# Check API usage in dashboards:
# Google: https://console.cloud.google.com/apis/dashboard
# VirusTotal: https://www.virustotal.com/gui/user/YOUR_USERNAME
```

---

## 💡 Pro Tips

### **🎯 Simplified & Powerful**
- **2 APIs + AI Heuristics** = Comprehensive protection
- No complex API approvals or waiting periods
- Faster setup, same security level

### **🔒 Security**
- Never commit `.env` files to git
- Use different keys for dev/production
- Monitor API usage in dashboards

### **⚡ Performance**
- Built-in 1-hour caching for repeated URLs
- Rate limiting prevents quota exhaustion
- Parallel API calls for faster scanning

### **🚀 Production Ready**
- All security middleware included
- Error handling and logging
- Scalable architecture

---

## 🆘 Need Help?

### **Quick Fixes**
1. Run `npm run test:apis` to diagnose issues
2. Check `API_SETUP_GUIDE.md` for detailed instructions
3. Restart server after changing `.env` file

### **Still Stuck?**
- Check the console for error messages
- Verify API keys are copied correctly (no extra spaces)
- Ensure MongoDB is running
- Try testing APIs individually

---

## 🎉 What You Get

### **🛡️ Comprehensive Protection**
- **Google Safe Browsing**: Industry-leading threat detection
- **VirusTotal**: 70+ antivirus engines
- **AI Heuristics**: Custom pattern recognition
- **Risk Scoring**: 0-100 threat assessment

### **⚡ Lightning Fast**
- Real-time scanning in under 2 seconds
- Parallel API processing
- Smart caching system
- Responsive UI with live updates

### **🎯 Simple Setup**
- Only 2 API keys needed
- No approval waiting periods
- Works offline with heuristics
- Production-ready out of the box

---

**🛡️ LinkGuard: Maximum security with minimum complexity!**

*Simplified setup • Same protection • Faster deployment*