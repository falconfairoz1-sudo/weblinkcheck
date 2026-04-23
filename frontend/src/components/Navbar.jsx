import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Link<span className="logo-accent">Guard</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <span className="nav-icon">🔍</span>
            Scanner
          </Link>
          <Link to="/qr-scanner" className={`nav-link ${isActive('/qr-scanner') ? 'active' : ''}`}>
            <span className="nav-icon">📷</span>
            QR Scanner
          </Link>
          {user && (
            <>
              <Link to="/monitor" className={`nav-link ${isActive('/monitor') ? 'active' : ''}`}>
                Monitor
              </Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                History
              </Link>
            </>
          )}
          <Link to="/scanner-guide" className={`nav-link ${isActive('/scanner-guide') ? 'active' : ''}`}>
            <span className="nav-icon">📚</span>
            Guide
          </Link>
        </div>

        {/* Auth Section */}
        <div className="navbar-auth">
          <ThemeToggle />
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-info" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="User Menu"
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.username}</span>
                <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
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
            <Link to="/profile" className="mobile-user-info" onClick={() => setMenuOpen(false)}>
              <span className="mobile-user-avatar">👤</span>
              <span className="mobile-user-name">{user.username}</span>
            </Link>
          )}
        </div>
        <nav className="mobile-nav-links">
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>🔍 Scanner</Link>
          <Link to="/qr-scanner" className="mobile-link" onClick={() => setMenuOpen(false)}>📷 QR Scanner</Link>
          {user && (
            <>
              <Link to="/monitor" className="mobile-link" onClick={() => setMenuOpen(false)}>📡 Monitor</Link>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
              <Link to="/history" className="mobile-link" onClick={() => setMenuOpen(false)}>📜 History</Link>
            </>
          )}
          <Link to="/scanner-guide" className="mobile-link" onClick={() => setMenuOpen(false)}>📚 Guide</Link>
          {user && (
            <>
              <div className="mobile-divider"></div>
              <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <Link to="/settings" className="mobile-link" onClick={() => setMenuOpen(false)}>⚙️ Settings</Link>
            </>
          )}
          {!user && (
            <>
              <div className="mobile-divider"></div>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>🔐 Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>✨ Sign Up</Link>
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
