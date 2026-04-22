# CORS Configuration Fix

## Problem
The frontend deployed on Vercel cannot access the backend on Render due to CORS (Cross-Origin Resource Sharing) restrictions.

## Solution Applied

### 1. Backend Changes (server.js)
Updated CORS configuration to:
- Allow requests from the Vercel frontend URL
- Include proper HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Set proper headers for Authorization and Content-Type

### 2. Environment Variables (.env)
Added/Updated:
```
NODE_ENV=production
FRONTEND_URL=https://weblinkcheck.vercel.app
```

## Deployment Steps

### For Render (Backend)

1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your backend service
3. Go to "Environment" tab
4. Add/Update these environment variables:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://weblinkcheck.vercel.app
   ```
5. Click "Save Changes"
6. Render will automatically redeploy your backend

### For Vercel (Frontend)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Ensure this variable exists:
   ```
   VITE_API_URL=https://weblinkcheck.onrender.com
   ```
5. If you made changes, redeploy:
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"

## Testing

After deployment, test these endpoints:
1. Health check: https://weblinkcheck.onrender.com/api/health
2. Login from: https://weblinkcheck.vercel.app

## Common Issues

### Issue: Still getting CORS errors
**Solution**: 
- Clear browser cache
- Check that environment variables are set correctly on Render
- Verify the backend redeployed after environment variable changes

### Issue: 404 errors
**Solution**: 
- Verify the API URL in frontend .env is correct
- Check that backend is running: visit the health endpoint

### Issue: Timeout errors
**Solution**: 
- Render free tier services sleep after inactivity
- First request may take 30-60 seconds to wake up the service
- Subsequent requests will be fast

## Important Notes

1. **Render Environment Variables**: Must be set in Render dashboard, not just in the .env file
2. **Vercel Environment Variables**: Must be set in Vercel dashboard for production builds
3. **Redeploy**: Both services need to redeploy after environment variable changes
4. **HTTPS**: Both services use HTTPS in production, which is required for secure cookies
