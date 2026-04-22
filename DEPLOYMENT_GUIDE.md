# 🌐 Complete Deployment Guide - LinkGuard

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment Options](#backend-deployment)
3. [Frontend Deployment Options](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Steps](#post-deployment)

---

## 🔧 Prerequisites

### What You Need:
- ✅ MongoDB Atlas account (already configured)
- ✅ Google Safe Browsing API Key
- ✅ VirusTotal API Key
- ✅ GitHub account (for deployment)
- ✅ Domain name (optional but recommended)

---

## 🖥️ Backend Deployment

### **Option 1: Render.com (Recommended - FREE)**

#### Why Render?
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in SSL certificates
- ✅ Easy environment variable management
- ✅ No credit card required for free tier

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/linkguard.git
   git push -u origin main
   ```

2. **Go to [Render.com](https://render.com)** and sign up

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

4. **Configure Service**
   - **Name**: `linkguard-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

5. **Add Environment Variables** (in Render dashboard)
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   GOOGLE_SAFE_BROWSING_API_KEY=your_key
   VIRUSTOTAL_API_KEY=your_key
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100
   ```

6. **Deploy!** - Render will automatically deploy

7. **Your Backend URL**: `https://linkguard-backend.onrender.com`

---

### **Option 2: Railway.app (FREE)**

#### Steps:

1. **Go to [Railway.app](https://railway.app)** and sign up

2. **New Project** → **Deploy from GitHub repo**

3. **Configure**
   - Select your repository
   - Root directory: `backend`
   - Add environment variables (same as above)

4. **Deploy** - Railway handles the rest

5. **Your Backend URL**: `https://linkguard-backend.up.railway.app`

---

### **Option 3: Heroku (Paid after Nov 2022)**

#### Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create linkguard-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set GOOGLE_SAFE_BROWSING_API_KEY=your_key
   heroku config:set VIRUSTOTAL_API_KEY=your_key
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

### **Option 4: Vercel (Serverless)**

See `vercel.json` configuration file included in the project.

---

## 🎨 Frontend Deployment

### **Option 1: Vercel (Recommended - FREE)**

#### Why Vercel?
- ✅ Built for React/Vite apps
- ✅ Automatic deployments
- ✅ Free SSL
- ✅ Global CDN
- ✅ Zero configuration

#### Steps:

1. **Go to [Vercel.com](https://vercel.com)** and sign up

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variable**
   ```
   VITE_API_URL=https://linkguard-backend.onrender.com
   ```

5. **Deploy!** - Vercel will build and deploy

6. **Your Frontend URL**: `https://linkguard.vercel.app`

---

### **Option 2: Netlify (FREE)**

#### Steps:

1. **Go to [Netlify.com](https://netlify.com)** and sign up

2. **New Site from Git**
   - Connect GitHub
   - Select repository

3. **Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

4. **Environment Variables**
   ```
   VITE_API_URL=https://linkguard-backend.onrender.com
   ```

5. **Deploy!**

6. **Your Frontend URL**: `https://linkguard.netlify.app`

---

### **Option 3: GitHub Pages (FREE)**

See deployment script included in the project.

---

### **Option 4: Cloudflare Pages (FREE)**

#### Steps:

1. **Go to [Cloudflare Pages](https://pages.cloudflare.com)**

2. **Create Project** → Connect GitHub

3. **Build Settings**
   - **Framework**: `Vite`
   - **Build command**: `npm run build`
   - **Build output**: `dist`
   - **Root directory**: `frontend`

4. **Deploy!**

---

## 🔐 Environment Variables

### Backend Environment Variables:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables:
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 🔗 Connecting Frontend to Backend

After deploying both:

1. **Update Frontend Environment Variable**
   - In Vercel/Netlify dashboard
   - Set `VITE_API_URL` to your backend URL
   - Redeploy frontend

2. **Update Backend CORS**
   - Add your frontend URL to allowed origins
   - See `backend/server.js` CORS configuration

---

## ✅ Post-Deployment Checklist

### Backend:
- [ ] Backend URL is accessible
- [ ] MongoDB connection works
- [ ] API endpoints respond correctly
- [ ] Environment variables are set
- [ ] CORS allows frontend domain

### Frontend:
- [ ] Frontend loads correctly
- [ ] Can connect to backend API
- [ ] All pages work
- [ ] Authentication works
- [ ] Scanning functionality works

### Testing:
- [ ] Register a new user
- [ ] Login works
- [ ] Scan a URL
- [ ] View scan history
- [ ] Check dashboard

---

## 🐛 Troubleshooting

### Backend Issues:

**"Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud hosting)
- Verify connection string is correct
- Check MongoDB Atlas cluster is running

**"API not responding"**
- Check logs in hosting platform dashboard
- Verify environment variables are set
- Check if service is running

### Frontend Issues:

**"Cannot connect to backend"**
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running

**"Build failed"**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for errors

---

## 🎯 Recommended Setup

**Best Free Combination:**
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel (Free tier)
- **Database**: MongoDB Atlas (Free tier)

**Total Cost**: $0/month 🎉

---

## 🚀 Quick Deploy Commands

### Deploy Backend to Render:
1. Push to GitHub
2. Connect Render to GitHub
3. Configure and deploy

### Deploy Frontend to Vercel:
```bash
npm install -g vercel
cd frontend
vercel
```

---

## 📞 Need Help?

If you encounter issues:
1. Check hosting platform logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check browser console for errors

---

**Ready to deploy? Let's go! 🚀**
