# 🛡️ LinkGuard - AI-Powered Link Safety Checker

A comprehensive full-stack web application that analyzes URLs and determines whether they are safe, suspicious, or malicious using multi-layer security analysis and AI-powered threat detection.

## 🔷 Core Features

### 🛡️ Dual-Layer Security Analysis
- **Google Safe Browsing API** - Real-time threat detection
- **VirusTotal API** - Comprehensive malware scanning
- **AI Heuristics** - Custom pattern recognition and risk scoring

### 🔍 Advanced URL Analysis
- URL shortener detection (bit.ly, tinyurl, etc.)
- Suspicious keyword identification
- IP-based URL detection
- SSL certificate validation
- Subdomain abuse detection

### 📊 Intelligent Risk Scoring
- 0-100 risk score calculation
- AI-powered phishing probability
- Detailed threat explanations
- Confidence level indicators

### 👤 User Management
- JWT-based authentication
- Personal scan history
- Dashboard analytics
- Bulk URL scanning (up to 10 URLs)

### 📱 Modern UI/UX
- Dark mode cybersecurity theme
- Fully responsive design
- Real-time scanning animations
- Interactive risk gauge
- Detailed result breakdowns

## 🔷 Tech Stack

### Frontend
- **React 18** with Vite
- **Pure CSS** (no frameworks)
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Rate limiting** and security middleware

### Security APIs
- Google Safe Browsing API
- VirusTotal API v3

## 🔷 Project Structure

```
├── backend/
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # External API integrations
│   ├── utils/              # URL analysis utilities
│   └── server.js           # Express server
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS stylesheets
│   │   └── utils/          # Helper functions
│   └── index.html
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- API keys for external services

### 1. Clone Repository
```bash
git clone <repository-url>
cd linkguard
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### 4. Environment Configuration

Edit `backend/.env`:
```env
# Server
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/link_safety_checker

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# API Keys (optional but recommended)
GOOGLE_SAFE_BROWSING_API_KEY=your_google_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

### 5. Start Development
```bash
# Start both frontend and backend
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🔑 API Keys Setup

### Google Safe Browsing API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Safe Browsing API
3. Create credentials and copy API key

### VirusTotal API
1. Sign up at [VirusTotal](https://www.virustotal.com/)
2. Go to your profile and copy API key

> **Note:** The application works without API keys using heuristic analysis only, but external APIs provide enhanced threat detection.

## 🔷 Core Components

### URL Scanner
- Real-time URL validation
- Multi-API threat checking
- Heuristic pattern analysis
- Risk score calculation

### Dashboard
- User statistics
- Recent scan history
- Quick actions
- Security tips

### Bulk Scanner
- Process up to 10 URLs simultaneously
- Batch analysis results
- Export functionality

### Scan History
- Persistent scan storage
- Filtering and search
- Detailed scan reports

## 🔒 Security Features

### Input Validation
- XSS prevention
- SQL injection protection
- URL sanitization
- Rate limiting

### Authentication
- JWT token-based auth
- Password hashing (bcrypt)
- Session management
- Role-based access

### API Security
- Request rate limiting
- Input validation
- Error handling
- CORS configuration

## 📊 Heuristic Analysis

The AI-powered heuristic engine analyzes:

- **URL Structure**: Length, special characters, encoding
- **Domain Analysis**: TLD, subdomain patterns
- **Content Patterns**: Suspicious keywords, phishing indicators
- **Technical Indicators**: HTTPS usage, IP-based URLs
- **Behavioral Patterns**: Shortened URLs, redirect chains

## 🔷 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### URL Scanning
- `POST /api/scan` - Scan single URL
- `POST /api/scan/bulk` - Bulk scan URLs
- `GET /api/scan/stats` - Get scan statistics

### History
- `GET /api/history` - Get scan history
- `GET /api/history/:id` - Get specific scan
- `DELETE /api/history/:id` - Delete scan
- `DELETE /api/history/clear` - Clear all history

## 🔷 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Set production environment variables:
- `NODE_ENV=production`
- `MONGODB_URI` (production database)
- `JWT_SECRET` (strong secret key)
- API keys for external services

## 🔷 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔷 Acknowledgments

- Google Safe Browsing API
- VirusTotal API
- React and Node.js communities

---

**⚠️ Disclaimer:** This tool is for educational and security research purposes. Always verify results with multiple sources for critical security decisions.