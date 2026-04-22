import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Link<span className="logo-accent">Guard</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Scanner</Link>
          <Link to="/content-scan" className={`nav-link ${isActive('/content-scan') ? 'active' : ''}`}>Content Scanner</Link>
          <Link to="/qr-scanner" className={`nav-link ${isActive('/qr-scanner') ? 'active' : ''}`}>QR Scanner</Link>
          <Link to="/monitor" className={`nav-link ${isActive('/monitor') ? 'active' : ''}`}>Monitor</Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
        </div>

        {/* Auth */}
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">
                <span className="user-dot"></span>
                {user.username}
              </span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>🔍 Scanner</Link>
        <Link to="/content-scan" className="mobile-link" onClick={() => setMenuOpen(false)}>🔍 Content Scanner</Link>
        <Link to="/qr-scanner" className="mobile-link" onClick={() => setMenuOpen(false)}>📷 QR Scanner</Link>
        <Link to="/monitor" className="mobile-link" onClick={() => setMenuOpen(false)}>👁️ Monitor</Link>
        <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
        <Link to="/history" className="mobile-link" onClick={() => setMenuOpen(false)}>📁 History</Link>
        {user ? (
          <>
            <span className="mobile-user">👤 {user.username}</span>
            <button className="mobile-link mobile-logout" onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>🔑 Login</Link>
            <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>✨ Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
