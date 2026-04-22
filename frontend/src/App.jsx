import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import ScanDetail from './pages/ScanDetail';
import YouTubeAIDetector from './pages/YouTubeAIDetector'

export default function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/scan/:id" element={<ScanDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/youtube-detector" element={<YouTubeAIDetector />} />
            </Routes>
          </main>
        </div>
      </ScanProvider>
    </AuthProvider>
  );
}
