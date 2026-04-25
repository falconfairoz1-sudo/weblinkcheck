import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

const TOOL_GROUPS = [
  {
    label: 'URL & Domain',
    tools: [
      { path: '/tools/url-expander',    icon: '🔗', label: 'URL Expander' },
      { path: '/tools/compare',         icon: '⚖️', label: 'URL Comparison' },
      { path: '/tools/ip-lookup',       icon: '🌍', label: 'IP Lookup' },
      { path: '/tools/domain-info',     icon: '🌐', label: 'Domain Info' },
      { path: '/tools/ssl-checker',     icon: '🔒', label: 'SSL Checker' },
      { path: '/tools/subdomains',      icon: '🔎', label: 'Subdomain Finder' },
      { path: '/tools/ping',            icon: '📡', label: 'Ping Tool' },
      { path: '/tools/bulk-reputation', icon: '🏭', label: 'Bulk Reputation' },
    ]
  },
  {
    label: 'Security & Privacy',
    tools: [
      { path: '/tools/threat-feed',      icon: '📡', label: 'Threat Feed' },
      { path: '/tools/password-checker', icon: '🔑', label: 'Password Checker' },
      { path: '/tools/leaked-password',  icon: '🔓', label: 'Leaked Password' },
      { path: '/tools/email-headers',    icon: '📧', label: 'Email Headers' },
      { path: '/tools/phishing-quiz',    icon: '🎯', label: 'Phishing Quiz' },
      { path: '/tools/bookmarks',        icon: '🔖', label: 'Bookmarks' },
    ]
  }
];

// Flat list for mobile
const ALL_TOOLS = TOOL_GROUPS.flatMap(g => g.tools);

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toolsRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isToolsActive = () => location.pathname.startsWith('/tools/');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
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
            <span className="nav-icon">🔍</span>Scanner
          </Link>
          <Link to="/qr-scanner" className={`nav-link ${isActive('/qr-scanner') ? 'active' : ''}`}>
            <span className="nav-icon">📷</span>QR Scanner
          </Link>
          {user && (
            <>
              <Link to="/monitor" className={`nav-link ${isActive('/monitor') ? 'active' : ''}`}>Monitor</Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
            </>
          )}

          {/* Tools Mega-Menu */}
          <div className={`nav-dropdown-wrap ${isToolsActive() ? 'active' : ''}`} ref={toolsRef}>
            <button
              className={`nav-link nav-dropdown-trigger ${isToolsActive() ? 'active' : ''}`}
              onClick={() => setToolsOpen(!toolsOpen)}
            >
              <span className="nav-icon">🛠️</span>Tools
              <span className="dropdown-arrow">{toolsOpen ? '▲' : '▼'}</span>
            </button>
            {toolsOpen && (
              <div className="nav-mega-menu">
                <div className="mega-menu-inner">
                  {TOOL_GROUPS.map((group) => (
                    <div key={group.label} className="mega-menu-group">
                      <div className="mega-menu-group-label">{group.label}</div>
                      {group.tools.map((tool) => (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className={`mega-menu-item ${isActive(tool.path) ? 'active' : ''}`}
                          onClick={() => setToolsOpen(false)}
                        >
                          <span className="mega-item-icon">{tool.icon}</span>
                          <span className="mega-item-label">{tool.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mega-menu-footer">
                  <Link to="/scanner-guide#tools" className="mega-view-all" onClick={() => setToolsOpen(false)}>
                    📖 View all tools in Guide →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/scanner-guide" className={`nav-link ${isActive('/scanner-guide') ? 'active' : ''}`}>
            <span className="nav-icon">📚</span>Guide
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
                <span className="user-avatar">{user.role === 'admin' ? '🛡️' : '👤'}</span>
                <span className="user-name">
                  {user.username}
                  {user.role === 'admin' && <span className="admin-badge">Admin</span>}
                </span>
                <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin" className="dropdown-item admin-item" onClick={() => setDropdownOpen(false)}>
                        <span className="dropdown-icon">🛡️</span>Admin Panel
                      </Link>
                      <div className="dropdown-divider"></div>
                    </>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">👤</span>Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">⚙️</span>Settings
                  </Link>
                  <Link to="/tools/bookmarks" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">🔖</span>Bookmarks
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>Logout
                  </button>
                </div>
              )}
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
          <span></span><span></span><span></span>
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
          <div className="mobile-divider"></div>
          <div className="mobile-section-label">🛠️ Tools</div>
          {ALL_TOOLS.map((tool) => (
            <Link key={tool.path} to={tool.path} className="mobile-link mobile-tool-link" onClick={() => setMenuOpen(false)}>
              {tool.icon} {tool.label}
            </Link>
          ))}
          <div className="mobile-divider"></div>
          <Link to="/scanner-guide" className="mobile-link" onClick={() => setMenuOpen(false)}>📚 Guide</Link>
          {user && (
            <>
              <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <Link to="/settings" className="mobile-link" onClick={() => setMenuOpen(false)}>⚙️ Settings</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="mobile-link mobile-admin-link" onClick={() => setMenuOpen(false)}>🛡️ Admin Panel</Link>
              )}
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>🔐 Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>✨ Sign Up</Link>
            </>
          )}
        </nav>
        <div className="mobile-menu-footer">
          {user && (
            <button className="mobile-logout" onClick={handleLogout}>🚪 Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}
