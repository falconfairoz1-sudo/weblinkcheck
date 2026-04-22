import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import ScanDetail from './pages/ScanDetail';
import Monitor from './pages/Monitor';
import QRScanner from './pages/QRScanner';


export default function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <div className="app-wrapper">
          <Navbar />
          <AIChat />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/scan/:id" element={<ScanDetail />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/qr-scanner" element={<QRScanner />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />      
            </Routes>
          </main>
        </div>
      </ScanProvider>
    </AuthProvider>
  );
}
