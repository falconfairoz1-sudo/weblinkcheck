# Deployment Checklist - Fix CORS Issues

## Current Error
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://weblinkcheck.onrender.com/api/history?limit=5. (Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 200.
```

## Root Cause
The backend on Render doesn't have the correct environment variables set, so CORS is not allowing requests from your Vercel frontend.

---

## ✅ Step-by-Step Fix

### 1. Set Environment Variables on Render

**CRITICAL: You MUST do this on Render's dashboard**

1. Go to: https://dashboard.render.com/
2. Click on your backend service (weblinkcheck)
3. Click on **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add these variables:

   ```
   NODE_ENV=production
   FRONTEND_URL=https://weblinkcheck.vercel.app
   ```

6. **Click "Save Changes"**
7. Render will automatically redeploy (wait 2-3 minutes)

### 2. Verify Environment Variables on Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify this exists:
   ```
   VITE_API_URL=https://weblinkcheck.onrender.com
   ```
5. If you added it just now, go to **Deployments** and click **"Redeploy"**

---

## 🧪 Testing After Deployment

### Test 1: Health Check
Open this URL in your browser:
```
https://weblinkcheck.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-22T...",
  "uptime": 123.456
}
```

### Test 2: CORS Headers
Open browser DevTools (F12), go to Console, and run:
```javascript
fetch('https://weblinkcheck.onrender.com/api/health', {
  method: 'GET',
  headers: { 'Origin': 'https://weblinkcheck.vercel.app' }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected:** Should return the health check data without CORS errors

### Test 3: Frontend Login
1. Go to: https://weblinkcheck.vercel.app
2. Try to login or register
3. Open DevTools → Network tab
4. Check the request to `/api/auth/login`
5. Look at Response Headers - should include:
   ```
   access-control-allow-origin: https://weblinkcheck.vercel.app
   access-control-allow-credentials: true
   ```

---

## 🔍 Troubleshooting

### Issue: Still getting CORS errors after setting environment variables

**Solutions:**
1. **Clear browser cache**: Ctrl+Shift+Delete → Clear cached images and files
2. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Check Render logs**:
   - Go to Render dashboard
   - Click on your service
   - Click "Logs" tab
   - Look for any errors during startup
4. **Verify environment variables are set**:
   - In Render dashboard → Environment tab
   - Make sure `NODE_ENV=production` and `FRONTEND_URL=https://weblinkcheck.vercel.app` are listed

### Issue: 404 errors on API calls

**Solutions:**
1. Check that `VITE_API_URL` in Vercel is set correctly
2. Redeploy frontend on Vercel after changing environment variables
3. Verify backend is running: visit https://weblinkcheck.onrender.com/api/health

### Issue: Render service is sleeping (first request takes 30-60 seconds)

**This is normal for Render free tier:**
- Services sleep after 15 minutes of inactivity
- First request wakes up the service (30-60 seconds)
- Subsequent requests are fast
- **Solution**: Upgrade to paid plan or accept the cold start delay

### Issue: 500 Internal Server Error

**Solutions:**
1. Check Render logs for error messages
2. Verify MongoDB connection string is correct
3. Verify all API keys (Google Safe Browsing, VirusTotal) are valid

---

## 📋 Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://weblinkcheck.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GOOGLE_SAFE_BROWSING_API_KEY=your-key
VIRUSTOTAL_API_KEY=your-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (Vercel)
```env
VITE_API_URL=https://weblinkcheck.onrender.com
```

---

## ✨ Success Indicators

You'll know it's working when:
- ✅ No CORS errors in browser console
- ✅ Login/Register works
- ✅ URL scanning works
- ✅ History loads
- ✅ Network tab shows successful API calls (status 200)

---

## 🆘 Still Having Issues?

If you've followed all steps and still have issues:

1. **Check browser console** for specific error messages
2. **Check Render logs** for backend errors
3. **Verify all environment variables** are set correctly on both platforms
4. **Try incognito/private browsing** to rule out cache issues
5. **Wait 5 minutes** after setting environment variables for changes to propagate

---

## 📝 Quick Commands

### Check if backend is responding:
```bash
curl https://weblinkcheck.onrender.com/api/health
```

### Check CORS headers:
```bash
curl -H "Origin: https://weblinkcheck.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://weblinkcheck.onrender.com/api/auth/login
```

Expected to see in response:
```
access-control-allow-origin: https://weblinkcheck.vercel.app
access-control-allow-credentials: true
access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
```
