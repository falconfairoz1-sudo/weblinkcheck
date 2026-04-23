import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
              </Routes>
            </main>
          </div>
        </ScanProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
