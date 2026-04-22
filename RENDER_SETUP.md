# 🚀 Render Backend Setup Guide

## The Problem
Your frontend on Vercel cannot access your backend on Render because CORS headers are missing.

## The Solution
Set environment variables on Render's dashboard (not just in your local .env file).

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com/
2. Sign in to your account
3. Find and click on your backend service (should be named something like "weblinkcheck" or "link-safety-checker")

### Step 2: Add Environment Variables
1. In the left sidebar, click **"Environment"**
2. You should see a list of environment variables
3. Click **"Add Environment Variable"** button
4. Add the following variables one by one:

#### Variable 1:
- **Key:** `NODE_ENV`
- **Value:** `production`

#### Variable 2:
- **Key:** `FRONTEND_URL`
- **Value:** `https://weblinkcheck.vercel.app`

5. After adding both variables, click **"Save Changes"**

### Step 3: Wait for Deployment
- Render will automatically redeploy your service
- This takes about 2-3 minutes
- You'll see a "Deploying..." status
- Wait until it shows "Live"

### Step 4: Test Your Backend
Open this URL in your browser:
```
https://weblinkcheck.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-04-22T...",
  "uptime": 123.456
}
```

### Step 5: Test Your Frontend
1. Go to: https://weblinkcheck.vercel.app
2. Open browser DevTools (Press F12)
3. Go to the **Console** tab
4. Try to login or scan a URL
5. You should **NOT** see any CORS errors

---

## ✅ Verification Checklist

Use this checklist to verify everything is working:

- [ ] Environment variables are set on Render dashboard
- [ ] Render service has redeployed successfully
- [ ] Health endpoint returns 200 OK: https://weblinkcheck.onrender.com/api/health
- [ ] Frontend loads without errors: https://weblinkcheck.vercel.app
- [ ] No CORS errors in browser console
- [ ] Login/Register works
- [ ] URL scanning works

---

## 🔍 How to Check Environment Variables on Render

1. Go to Render dashboard
2. Click on your service
3. Click "Environment" in the left sidebar
4. You should see these variables listed:
   ```
   NODE_ENV = production
   FRONTEND_URL = https://weblinkcheck.vercel.app
   MONGODB_URI = mongodb+srv://...
   JWT_SECRET = ...
   GOOGLE_SAFE_BROWSING_API_KEY = ...
   VIRUSTOTAL_API_KEY = ...
   ```

---

## 🐛 Troubleshooting

### Problem: Still getting CORS errors

**Solution 1: Clear Browser Cache**
- Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"
- Refresh the page with `Ctrl + Shift + R`

**Solution 2: Check Render Logs**
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for any error messages
5. You should see: `✅ MongoDB connected` and `🚀 Server running on...`

**Solution 3: Verify Environment Variables**
- Make sure `NODE_ENV=production` (not "development")
- Make sure `FRONTEND_URL=https://weblinkcheck.vercel.app` (exact URL, no trailing slash)

### Problem: Backend is slow (30-60 seconds to respond)

**This is normal for Render free tier:**
- Free services sleep after 15 minutes of inactivity
- First request wakes up the service (takes 30-60 seconds)
- Subsequent requests are fast
- **Solution:** Upgrade to paid plan ($7/month) or accept the delay

### Problem: 500 Internal Server Error

**Check these:**
1. MongoDB connection string is correct
2. All API keys are valid
3. Check Render logs for specific error messages

---

## 📱 Test CORS Configuration

I've created a test page for you. To use it:

1. Open the file `test-cors.html` in your browser
2. Click the test buttons
3. It will show you exactly what's working and what's not

Or you can test manually in browser console:

```javascript
// Test 1: Health Check
fetch('https://weblinkcheck.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Test 2: CORS Headers
fetch('https://weblinkcheck.onrender.com/api/health', {
  credentials: 'include'
})
  .then(r => {
    console.log('CORS Origin:', r.headers.get('access-control-allow-origin'));
    console.log('CORS Credentials:', r.headers.get('access-control-allow-credentials'));
    return r.json();
  })
  .then(console.log)
  .catch(console.error)
```

---

## 📞 Need More Help?

If you're still having issues after following all steps:

1. **Check the DEPLOYMENT_CHECKLIST.md** file for detailed troubleshooting
2. **Open test-cors.html** in your browser to diagnose the issue
3. **Check Render logs** for backend errors
4. **Check browser console** for frontend errors
5. Make sure you waited 2-3 minutes after setting environment variables

---

## 🎯 Quick Reference

### Backend URL
```
https://weblinkcheck.onrender.com
```

### Frontend URL
```
https://weblinkcheck.vercel.app
```

### Required Environment Variables on Render
```
NODE_ENV=production
FRONTEND_URL=https://weblinkcheck.vercel.app
```

### Required Environment Variables on Vercel
```
VITE_API_URL=https://weblinkcheck.onrender.com
```

---

## ✨ Success!

Once everything is working, you should be able to:
- ✅ Visit your frontend without CORS errors
- ✅ Register a new account
- ✅ Login successfully
- ✅ Scan URLs
- ✅ View scan history
- ✅ See all features working smoothly

Good luck! 🚀
