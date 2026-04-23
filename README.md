# 🛡️ LinkGuard - AI-Powered Link Safety Checker

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com/yourusername/linkguard)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

A comprehensive, industry-ready web application for scanning and analyzing URLs for security threats using AI-powered heuristics, Google Safe Browsing, and VirusTotal APIs.

![LinkGuard Banner](https://via.placeholder.com/1200x400/4F9EFF/FFFFFF?text=LinkGuard+-+AI-Powered+Link+Safety+Checker)

## ✨ Features

### 🔍 Core Features
- **URL Scanner** - Real-time URL security analysis with AI heuristics
- **QR Scanner** - Scan QR codes and analyze embedded URLs
- **Monitor** - Continuous monitoring of URLs for security changes
- **Dashboard** - Comprehensive analytics and insights
- **History** - Complete scan history with filtering and search
- **Reports** - Professional PDF report generation

### 👤 User Management
- **Authentication** - Secure JWT-based authentication
- **Profile Management** - Edit profile, change password
- **Advanced Settings** - 15+ customization options
- **Theme Support** - Dark/Light mode with smooth transitions

### 📊 Advanced Features
- **Bulk Scanning** - Scan multiple URLs simultaneously
- **Advanced Analytics** - Detailed security insights
- **Multi-Format Export** - PDF, JSON, CSV, TXT
- **Real-time Notifications** - In-app and email alerts
- **Multi-language Support** - 5 languages (EN, ES, FR, DE, ZH)
- **Timezone Support** - 9 timezone options

### 🔐 Security APIs
- Google Safe Browsing API
- VirusTotal API
- AI-powered heuristics
- Custom pattern matching

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/linkguard.git
cd linkguard
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/link_safety_checker
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional API Keys
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here
VIRUSTOTAL_API_KEY=your_key_here

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create `frontend/.env.development`:
```env
VITE_API_URL=http://localhost:5001
```

5. **Start the application**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

6. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
linkguard/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── jobs/            # Cron jobs
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   ├── styles/      # CSS files
│   │   └── utils/       # Utility functions
│   ├── public/          # Static assets
│   └── index.html       # HTML template
├── .gitignore
├── README.md
└── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS3** - Styling with custom properties
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet.js** - Security headers
- **Express Validator** - Input validation

### External Services
- Google Safe Browsing API
- VirusTotal API
- Nodemailer (Email)
- jsPDF (PDF generation)

## 📖 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
PUT    /api/auth/update-profile    - Update user profile
```

### Scan Endpoints
```
POST   /api/scan                   - Scan a URL
GET    /api/scan/:id               - Get scan details
```

### History Endpoints
```
GET    /api/history                - Get scan history
DELETE /api/history/:id            - Delete scan
```

### Monitor Endpoints
```
POST   /api/monitor                - Create monitor
GET    /api/monitor                - Get all monitors
DELETE /api/monitor/:id            - Delete monitor
```

### Report Endpoints
```
POST   /api/report/generate        - Generate PDF report
```

## 🎨 Features Showcase

### URL Scanner
- Real-time security analysis
- AI-powered threat detection
- Risk score calculation
- Detailed security checks

### Dashboard
- Scan statistics
- Threat distribution charts
- Recent scans overview
- Quick actions

### Settings
- Theme customization
- Language selection
- Timezone configuration
- Notification preferences
- Privacy controls

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- XSS protection
- CORS configuration
- Security headers with Helmet.js
- Environment variable protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop optimization
- Touch-friendly interface

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

### Deployment Options

1. **Vercel (Frontend) + Render (Backend)**
2. **Heroku (Full Stack)**
3. **DigitalOcean / AWS / Azure**

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for detailed instructions.

## 📊 Performance

- Fast load times (< 2s)
- Optimized bundle size
- Efficient API responses
- Database query optimization
- Caching strategies

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Google Safe Browsing API
- VirusTotal API
- React community
- Node.js community
- All contributors

## 📞 Support

For support, email support@linkguard.app or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] API key management
- [ ] Webhook integrations
- [ ] Team collaboration
- [ ] Role-based access control
- [ ] Mobile app (React Native)
- [ ] Browser extension

## 📈 Status

**Production Ready** ✅

All features implemented and tested. Ready for deployment!

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
