import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Notifications from './components/Notifications';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import ScanDetail from './pages/ScanDetail';
import Monitor from './pages/Monitor';
import QRScanner from './pages/QRScanner';
import ScannerGuide from './pages/ScannerGuide';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import UrlExpander from './pages/UrlExpander';
import IpLookup from './pages/IpLookup';
import UrlComparison from './pages/UrlComparison';
import ThreatFeed from './pages/ThreatFeed';
import Bookmarks from './pages/Bookmarks';
import PasswordChecker from './pages/PasswordChecker';
import DomainInfo from './pages/DomainInfo';
import SSLChecker from './pages/SSLChecker';
import EmailHeaderAnalyzer from './pages/EmailHeaderAnalyzer';
import SubdomainFinder from './pages/SubdomainFinder';
import PingTool from './pages/PingTool';
import LeakedPasswordCheck from './pages/LeakedPasswordCheck';
import PhishingQuiz from './pages/PhishingQuiz';
import BulkDomainReputation from './pages/BulkDomainReputation';
import AdminDashboard from './pages/AdminDashboard';


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScanProvider>
          <div className="app-wrapper">
            <Navbar />
            <Notifications />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<History />} />
                <Route path="/scan/:id" element={<ScanDetail />} />
                <Route path="/monitor" element={<Monitor />} />
                <Route path="/qr-scanner" element={<QRScanner />} />
                <Route path="/scanner-guide" element={<ScannerGuide />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tools/url-expander" element={<UrlExpander />} />
                <Route path="/tools/ip-lookup" element={<IpLookup />} />
                <Route path="/tools/compare" element={<UrlComparison />} />
                <Route path="/tools/threat-feed" element={<ThreatFeed />} />
                <Route path="/tools/bookmarks" element={<Bookmarks />} />
                <Route path="/tools/password-checker" element={<PasswordChecker />} />
                <Route path="/tools/domain-info" element={<DomainInfo />} />
                <Route path="/tools/ssl-checker" element={<SSLChecker />} />
                <Route path="/tools/email-headers" element={<EmailHeaderAnalyzer />} />
                <Route path="/tools/subdomains" element={<SubdomainFinder />} />
                <Route path="/tools/ping" element={<PingTool />} />
                <Route path="/tools/leaked-password" element={<LeakedPasswordCheck />} />
                <Route path="/tools/phishing-quiz" element={<PhishingQuiz />} />
                <Route path="/tools/bulk-reputation" element={<BulkDomainReputation />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
        </ScanProvider>
      </AuthProvider>
    </ThemeProvider>
    
  );
}
