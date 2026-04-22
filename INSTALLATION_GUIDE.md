# 🚀 Installation Guide for New Features

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all new dependencies:
- `jimp@^0.22.10` - Image processing for QR codes
- `jsqr@^1.4.0` - QR code decoding
- `multer@^1.4.5-lts.1` - File upload handling
- `node-cron@^3.0.3` - Scheduled monitoring tasks
- `nodemailer@^6.9.8` - Email notifications
- `pdfkit@^0.14.0` - PDF report generation

### 2. Configure Email (Optional but Recommended)

Edit `backend/.env` and add:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### For Gmail Users:
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Generate an App Password
5. Use the App Password (not your regular password)

#### For Other Email Providers:
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, Port 587
- **Yahoo**: `smtp.mail.yahoo.com`, Port 587
- **Custom SMTP**: Use your provider's settings

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access New Features

Open your browser and navigate to:
- **Home**: http://localhost:5173/
- **QR Scanner**: http://localhost:5173/qr-scanner
- **URL Monitor**: http://localhost:5173/monitor
- **Dashboard**: http://localhost:5173/dashboard
- **History**: http://localhost:5173/history

---

## Feature-by-Feature Setup

### 📷 QR Code Scanner

**No additional setup required!**

1. Navigate to `/qr-scanner`
2. Upload or drag-drop a QR code image
3. System automatically extracts and scans the URL

**Supported formats**: JPG, PNG, GIF (max 5MB)

---

### 👁️ URL Monitoring

**Requires user authentication**

1. Create an account or log in
2. Navigate to `/monitor`
3. Add URLs with desired check intervals
4. Enable email notifications (requires SMTP configuration)

**Monitoring intervals**:
- Hourly (every 60 minutes)
- Daily (every 24 hours)
- Weekly (every 7 days)

**Cron job**: Automatically starts when server starts

---

### 📧 Email Notifications

**Setup Steps**:

1. Configure SMTP in `.env` (see step 2 above)
2. Restart backend server
3. Test by:
   - Registering a new account (welcome email)
   - Scanning a high-risk URL (alert email)
   - Adding a monitor (status change emails)

**Email types**:
- Welcome email on registration
- High-risk alerts (score ≥ 70)
- Monitor status changes

**Troubleshooting**:
- Check spam/junk folder
- Verify SMTP credentials
- Check firewall settings
- Review server logs

---

### 📄 PDF Report Export

**No additional setup required!**

1. View any scan detail page
2. Click "📄 Export PDF" button
3. PDF downloads automatically

**Report includes**:
- URL and scan metadata
- Risk assessment
- Heuristic analysis
- API results
- Security warnings

---

### 📊 CSV History Export

**Requires user authentication**

1. Log in to your account
2. Navigate to `/history`
3. Click "📊 Export CSV" button
4. CSV downloads automatically

**CSV includes**:
- Date, URL, Status
- Risk Score, Scan Type
- Google Safe Browsing result
- VirusTotal detections

---

## Verification Steps

### Test QR Code Scanner

1. Generate a test QR code: https://www.qr-code-generator.com/
2. Use URL: `https://example.com`
3. Upload to scanner
4. Verify URL extraction and analysis

### Test URL Monitoring

1. Add a safe URL (e.g., `https://google.com`)
2. Set interval to "hourly"
3. Wait 1 hour
4. Check monitor status updates

### Test Email Notifications

1. Configure SMTP settings
2. Register new test account
3. Check email for welcome message
4. Scan high-risk URL: `http://malware.testing.google.test/testing/malware/`
5. Check email for alert

### Test PDF Export

1. Perform any URL scan
2. View scan detail page
3. Click "Export PDF"
4. Open PDF and verify content

### Test CSV Export

1. Perform multiple scans
2. Go to History page
3. Click "Export CSV"
4. Open in Excel/Google Sheets

---

## Database Updates

The Monitor model is automatically created when you start the server. No manual database setup required.

**New collection**: `monitors`

**Indexes created automatically**:
- `user + isActive`
- `lastChecked + isActive`

---

## Environment Variables Reference

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/link_safety_checker

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# API Keys
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here
VIRUSTOTAL_API_KEY=your_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## Production Deployment

### Additional Steps for Production

1. **Set environment to production**:
```env
NODE_ENV=production
```

2. **Use strong JWT secret**:
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. **Configure production SMTP**:
- Use dedicated email service (SendGrid, Mailgun, AWS SES)
- Set up SPF/DKIM records
- Monitor email delivery

4. **Set up SSL/TLS**:
- Use HTTPS for frontend
- Configure reverse proxy (nginx)
- Enable secure cookies

5. **Monitor cron jobs**:
- Check logs regularly
- Set up error alerts
- Monitor email delivery rates

---

## Troubleshooting

### QR Code Scanner Issues

**Problem**: "No QR code found in image"
- Ensure image quality is good
- Try different image format
- Check QR code is not damaged

**Problem**: "File too large"
- Reduce image size (max 5MB)
- Compress image before upload

### Email Not Sending

**Problem**: "Email not configured"
- Add SMTP settings to `.env`
- Restart backend server

**Problem**: "Authentication failed"
- Use App Password for Gmail
- Check username/password
- Verify SMTP host and port

**Problem**: "Connection timeout"
- Check firewall settings
- Verify network connectivity
- Try different SMTP port (465 for SSL)

### Monitor Not Running

**Problem**: Monitors not checking
- Check server logs for cron job
- Verify MongoDB connection
- Check monitor `isActive` status

**Problem**: No email alerts
- Verify SMTP configuration
- Check `notifyOnChange` setting
- Review email service logs

### PDF Generation Fails

**Problem**: "Failed to generate PDF"
- Check scan exists in database
- Verify user has access
- Review server error logs

**Problem**: PDF download not starting
- Check browser popup blocker
- Try different browser
- Check network connection

### CSV Export Issues

**Problem**: Empty CSV file
- Ensure you have scan history
- Check user authentication
- Verify database connection

**Problem**: CSV not downloading
- Check browser settings
- Disable popup blocker
- Try different browser

---

## Performance Optimization

### For High Traffic

1. **Enable caching**:
- Redis for scan results
- CDN for static assets

2. **Database optimization**:
- Add indexes for common queries
- Use MongoDB Atlas for scaling

3. **Email queue**:
- Use job queue (Bull, BeeQueue)
- Batch email sending

4. **Monitor optimization**:
- Adjust check intervals
- Limit concurrent checks
- Use worker processes

---

## Security Considerations

### File Uploads (QR Scanner)
- File size limited to 5MB
- Only image types allowed
- Files processed in memory
- No permanent storage

### Email Service
- Use environment variables
- Never commit credentials
- Use App Passwords
- Enable 2FA

### PDF Generation
- User-specific access control
- No external dependencies
- Sanitized content
- Streamed responses

### Monitoring
- Rate-limited checks
- User-specific monitors
- Secure email delivery
- Audit logging

---

## Support

If you encounter issues:

1. Check server logs: `backend/logs/`
2. Review error messages
3. Verify configuration
4. Test with simple cases
5. Check network connectivity

For additional help, refer to:
- `FEATURES_DOCUMENTATION.md` - Detailed feature docs
- `README.md` - General project info
- Server logs - Runtime errors

---

## Next Steps

After installation:

1. ✅ Test all features
2. ✅ Configure email notifications
3. ✅ Set up monitoring for important URLs
4. ✅ Export your first PDF report
5. ✅ Share QR scanner with team

Enjoy the new features! 🎉
