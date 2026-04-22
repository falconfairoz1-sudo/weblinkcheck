# 🚀 New Features Documentation

## Overview
This document describes the 5 new user-focused features added to LinkGuard to enhance user safety and experience.

---

## 1. 📷 QR Code Scanner

### Description
Scan QR codes before visiting them to detect phishing and malware threats. This feature helps users avoid QR code-based attacks (quishing).

### Features
- Upload QR code images (JPG, PNG, GIF)
- Drag-and-drop support
- Automatic URL extraction
- Full security analysis of extracted URLs
- Mobile-friendly interface

### Usage
1. Navigate to `/qr-scanner`
2. Upload or drag-drop a QR code image
3. System extracts the URL and performs full security scan
4. View detailed risk assessment

### API Endpoint
```
POST /api/qr
Content-Type: multipart/form-data
Body: qrImage (file)
```

### Frontend Component
- `frontend/src/pages/QRScanner.jsx`
- `frontend/src/styles/qrscanner.css`

### Backend Files
- `backend/controllers/qrController.js`
- `backend/routes/qrRoutes.js`

### Dependencies
- `jimp` - Image processing
- `jsqr` - QR code decoding
- `multer` - File upload handling

---

## 2. 👁️ URL Monitoring Service

### Description
Continuously monitor saved URLs and receive alerts when their security status changes. Perfect for tracking important links over time.

### Features
- Add URLs to monitoring list
- Choose check intervals (hourly, daily, weekly)
- Email notifications on status changes
- Track risk score trends
- View status change history
- Automatic background scanning

### Usage
1. Navigate to `/monitor`
2. Add URL with desired check interval
3. Enable/disable email notifications
4. System automatically rescans URLs
5. Receive alerts when status changes

### API Endpoints
```
POST /api/monitor - Add new monitor
GET /api/monitor - Get all monitors
DELETE /api/monitor/:id - Remove monitor
```

### Cron Job
- Runs every hour
- Checks all active monitors
- Sends email alerts on changes
- Located in `backend/jobs/monitorCron.js`

### Frontend Component
- `frontend/src/pages/Monitor.jsx`
- `frontend/src/styles/monitor.css`

### Backend Files
- `backend/controllers/monitorController.js`
- `backend/routes/monitorRoutes.js`
- `backend/models/Monitor.js`
- `backend/jobs/monitorCron.js`

### Dependencies
- `node-cron` - Scheduled tasks

---

## 3. 📧 Email Notifications

### Description
Instant email alerts for high-risk URL detections and monitoring status changes. Keeps users informed about security threats.

### Features
- Welcome email on registration
- High-risk URL alerts (score ≥ 70)
- Monitor status change notifications
- Professional HTML email templates
- Configurable SMTP settings

### Email Types

#### Welcome Email
- Sent on user registration
- Lists available features
- Encourages engagement

#### High-Risk Alert
- Triggered when scan score ≥ 70
- Shows URL, risk score, and status
- Includes security recommendations

#### Monitor Alert
- Sent when monitored URL status changes
- Shows previous vs new status
- Includes risk score changes

### Configuration
Add to `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### For Gmail Users
1. Enable 2-Factor Authentication
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use App Password (not regular password)

### Backend Files
- `backend/services/emailService.js`
- Integrated in `authController.js` (welcome)
- Integrated in `scanController.js` (high-risk)
- Integrated in `monitorController.js` (status change)

### Dependencies
- `nodemailer` - Email sending

---

## 4. 📄 PDF Report Export

### Description
Generate professional PDF reports of scan results. Perfect for sharing with IT teams, management, or keeping records.

### Features
- Professional PDF layout
- Includes all scan details
- Risk assessment summary
- API results breakdown
- Security warnings
- Downloadable from scan detail page

### Report Contents
- URL and scan metadata
- Risk score and status
- Heuristic analysis results
- Google Safe Browsing results
- VirusTotal detections
- Security warnings
- Disclaimer footer

### Usage
1. View any scan detail page
2. Click "📄 Export PDF" button
3. PDF downloads automatically

### API Endpoint
```
GET /api/report/pdf/:scanId
Response: application/pdf
```

### Backend Files
- `backend/controllers/reportController.js`
- `backend/routes/reportRoutes.js`

### Frontend Integration
- Added to `ScanDetail.jsx` action buttons

### Dependencies
- `pdfkit` - PDF generation

---

## 5. 📊 CSV History Export

### Description
Export complete scan history to CSV format for analysis, record-keeping, or compliance purposes.

### Features
- Export up to 1000 recent scans
- Includes key metrics
- Compatible with Excel/Google Sheets
- One-click download

### CSV Columns
- Date
- URL
- Status
- Risk Score
- Scan Type
- Google Safe Browsing Result
- VirusTotal Detections

### Usage
1. Navigate to History page
2. Click "Export CSV" button
3. CSV file downloads automatically

### API Endpoint
```
GET /api/report/csv
Response: text/csv
```

### Backend Files
- `backend/controllers/reportController.js` (generateCSVReport)
- `backend/routes/reportRoutes.js`

### Frontend Integration
- Added to `History.jsx` page

---

## Installation Instructions

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

New dependencies added:
- `jimp` - Image processing
- `jsqr` - QR code decoding
- `multer` - File uploads
- `node-cron` - Scheduled tasks
- `nodemailer` - Email sending
- `pdfkit` - PDF generation

### 2. Update Environment Variables
Add to `backend/.env`:
```env
# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3. Start the Application
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### 4. Access New Features
- QR Scanner: http://localhost:5173/qr-scanner
- URL Monitor: http://localhost:5173/monitor
- PDF Export: Available on scan detail pages
- CSV Export: Available on history page
- Email Alerts: Automatic (configure SMTP first)

---

## Navigation Updates

### Desktop Navigation
- Scanner
- QR Scanner (NEW)
- Monitor (NEW)
- Dashboard
- History

### Mobile Navigation
- 🔍 Scanner
- 📷 QR Scanner (NEW)
- 👁️ Monitor (NEW)
- 📊 Dashboard
- 📁 History

---

## Database Schema Updates

### New Model: Monitor
```javascript
{
  user: ObjectId,
  url: String,
  checkInterval: String, // 'hourly', 'daily', 'weekly'
  notifyOnChange: Boolean,
  lastRiskScore: Number,
  lastStatus: String,
  lastChecked: Date,
  checksPerformed: Number,
  statusChanges: [{
    previousStatus: String,
    newStatus: String,
    previousRiskScore: Number,
    newRiskScore: Number,
    changedAt: Date
  }],
  isActive: Boolean
}
```

### Updated Scan Model
- Added `scanType` field for 'qr-code' scans

---

## Security Considerations

### QR Code Scanner
- File size limit: 5MB
- Allowed formats: image/*
- Files processed in memory (not stored)
- Same security analysis as regular scans

### Email Service
- Uses secure SMTP connection
- Supports TLS/SSL
- Non-blocking (doesn't fail requests)
- Graceful degradation if not configured

### PDF Generation
- Server-side rendering
- No external dependencies
- Sanitized content
- User-specific access control

### URL Monitoring
- Rate-limited background checks
- User-specific monitors
- Automatic cleanup of inactive monitors
- Email throttling to prevent spam

---

## Performance Considerations

### Cron Job
- Runs every hour
- Processes monitors in batches
- Respects API rate limits
- Logs execution time

### File Uploads
- Memory storage (temporary)
- Size limits enforced
- Type validation
- Automatic cleanup

### PDF Generation
- Streamed to response
- No disk storage
- Efficient memory usage

---

## Testing

### QR Code Scanner
1. Generate test QR code with URL
2. Upload to scanner
3. Verify URL extraction
4. Check security analysis

### URL Monitoring
1. Add test URL
2. Wait for scheduled check
3. Verify email notification
4. Check status history

### Email Notifications
1. Configure SMTP
2. Register new account
3. Scan high-risk URL
4. Check email inbox

### PDF Export
1. View scan detail
2. Click PDF export
3. Verify PDF content
4. Check formatting

### CSV Export
1. Create multiple scans
2. Click CSV export
3. Open in spreadsheet
4. Verify data accuracy

---

## Troubleshooting

### Email Not Sending
- Check SMTP credentials
- Verify firewall settings
- Use App Password for Gmail
- Check spam folder

### QR Code Not Detected
- Ensure image quality
- Check file format
- Verify QR code contains URL
- Try different image

### Monitor Not Running
- Check cron job logs
- Verify MongoDB connection
- Check server uptime
- Review error logs

### PDF Generation Fails
- Check scan exists
- Verify user permissions
- Review server logs
- Check disk space

---

## Future Enhancements

### Potential Additions
1. Browser extension for real-time protection
2. Webhook integrations (Slack, Discord, Teams)
3. Advanced analytics dashboard
4. Team/organization features
5. API for developers
6. Dark web monitoring
7. Custom ML model training
8. Scheduled report delivery

---

## Support

For issues or questions:
1. Check server logs
2. Review error messages
3. Verify configuration
4. Test with simple cases
5. Check network connectivity

---

## Changelog

### Version 2.0.0 (Current)
- ✅ Added QR Code Scanner
- ✅ Added URL Monitoring Service
- ✅ Added Email Notifications
- ✅ Added PDF Report Export
- ✅ Added CSV History Export
- ✅ Updated navigation
- ✅ Enhanced user experience

### Version 1.0.0
- Initial release
- Basic URL scanning
- User authentication
- Scan history
- Dashboard analytics
