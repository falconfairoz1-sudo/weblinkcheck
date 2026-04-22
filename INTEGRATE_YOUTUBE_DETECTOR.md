# Quick Integration Guide - YouTube AI Detector

## Step-by-Step Integration (Without Touching Existing Code)

### Step 1: Get YouTube API Key (5 minutes)

1. Visit: https://console.cloud.google.com/
2. Create/select project
3. Enable "YouTube Data API v3"
4. Create API Key
5. Copy the key

### Step 2: Add API Key to Backend

Add this line to `backend/.env`:
```env
YOUTUBE_API_KEY=YOUR_API_KEY_HERE
```

### Step 3: Register Route in Server

Open `backend/server.js` and add this line **after** your existing routes (around line 30-40):

```javascript
// YouTube AI Detector routes (NEW)
app.use('/api/youtube', require('./routes/youtube'));
```

Example placement:
```javascript
// Existing routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scan', require('./routes/scan'));
app.use('/api/history', require('./routes/history'));

// YouTube AI Detector routes (ADD THIS)
app.use('/api/youtube', require('./routes/youtube'));

// Error handler
app.use(errorHandler);
```

### Step 4: Add Frontend Route

Open `frontend/src/App.jsx` and:

1. **Import the component** (at the top):
```javascript
import YouTubeAIDetector from './pages/YouTubeAIDetector';
```

2. **Add the route** (in your Routes section):
```jsx
<Route path="/youtube-detector" element={<YouTubeAIDetector />} />
```

Example:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/history" element={<History />} />
  <Route path="/scan/:id" element={<ScanDetail />} />
  
  {/* ADD THIS LINE */}
  <Route path="/youtube-detector" element={<YouTubeAIDetector />} />
</Routes>
```

### Step 5: Add Navigation Link (Optional)

Open `frontend/src/components/Navbar.jsx` and add a link in your navigation:

```jsx
<Link to="/youtube-detector" className="nav-link">
  🤖 YouTube AI Detector
</Link>
```

Example placement:
```jsx
<nav className="navbar-links">
  <Link to="/" className="nav-link">Home</Link>
  <Link to="/dashboard" className="nav-link">Dashboard</Link>
  <Link to="/history" className="nav-link">History</Link>
  
  {/* ADD THIS LINE */}
  <Link to="/youtube-detector" className="nav-link">YouTube AI</Link>
</nav>
```

### Step 6: Restart Servers

```bash
# Backend
cd backend
npm start

# Frontend (in new terminal)
cd frontend
npm run dev
```

### Step 7: Test It!

1. Open browser: `http://localhost:5173/youtube-detector`
2. Paste a YouTube URL
3. Click "Analyze Video"
4. View results!

## Test URLs

Try these to see it in action:

**AI-Generated Content Examples:**
- Videos with "AI-generated" in description
- Videos from AI tool channels (Synthesia, D-ID, etc.)
- Videos mentioning ChatGPT, Midjourney in description

**Regular Content:**
- Music videos
- Vlogs
- Gaming videos
- News channels

## Files Created (No Existing Files Modified)

✅ `backend/services/youtubeAIDetector.js` - Detection logic
✅ `backend/controllers/youtubeController.js` - API controller
✅ `backend/routes/youtube.js` - API routes
✅ `frontend/src/pages/YouTubeAIDetector.jsx` - UI component
✅ `frontend/src/styles/youtube-detector.css` - Styling
✅ `YOUTUBE_AI_DETECTOR_SETUP.md` - Full documentation
✅ `INTEGRATE_YOUTUBE_DETECTOR.md` - This guide

## Minimal Changes Required

Only 3 small additions to existing files:
1. `backend/.env` - Add API key (1 line)
2. `backend/server.js` - Add route (1 line)
3. `frontend/src/App.jsx` - Import + route (2 lines)

**That's it!** Your existing code remains untouched.

## Troubleshooting

**Backend won't start?**
- Check if `backend/routes/youtube.js` exists
- Verify the route line in `server.js` is correct

**Frontend shows 404?**
- Check if route is added to `App.jsx`
- Verify import path is correct

**API errors?**
- Check if `YOUTUBE_API_KEY` is in `.env`
- Restart backend after adding key
- Verify API key is valid in Google Cloud Console

**CORS errors?**
- Your existing CORS setup should work
- Backend should be running on port 5000
- Frontend should be running on port 5173

## What You Get

✨ **Beautiful UI** with glassmorphism effects
🎯 **AI Detection** with confidence scoring
📊 **Detailed Analysis** breakdown by category
🔍 **Indicator Detection** showing what was found
📈 **Video Statistics** (views, likes, comments)
🎨 **Modern Design** matching your existing UI
📱 **Fully Responsive** works on all devices

## Next Steps

After integration, you can:
- Customize detection patterns in `youtubeAIDetector.js`
- Add database storage for analysis history
- Create user-specific analysis tracking
- Add export functionality (PDF, CSV)
- Integrate with your existing scan history

Enjoy your new YouTube AI Detector! 🚀
