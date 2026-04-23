import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
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



        {/* Auth */}
        <div className="navbar-auth">
          <ThemeToggle />
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.username}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout} title="Logout">
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Sign Up
              </Link>
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
        <div className="mobile-menu-header">
          {user && (
            <div className="mobile-user-info">
              <span className="mobile-user-avatar">👤</span>
              <span className="mobile-user-name">{user.username}</span>
            </div>
          )}
        </div>
        <nav className="mobile-nav-links">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>🔍 Scanner</Link>
          <Link to="/qr-scanner" className="mobile-link" onClick={() => setMenuOpen(false)}>📷 QR Scanner</Link>
          <Link to="/monitor" className="mobile-link" onClick={() => setMenuOpen(false)}>Monitor</Link>
          <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/history" className="mobile-link" onClick={() => setMenuOpen(false)}>History</Link>
          <Link to="/scanner-guide" className="mobile-link" onClick={() => setMenuOpen(false)}>📚 Guide</Link>
          {user && (
            <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
        <div className="mobile-menu-footer">
          {user && (
            <button className="mobile-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
