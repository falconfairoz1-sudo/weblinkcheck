import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/admindashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Guard — redirect non-admins immediately
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/', { replace: true });
    if (!user) navigate('/login', { replace: true });
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, scansRes] = await Promise.all([
        api.get('/scan/stats'),
        api.get('/admin/users'),
        api.get('/admin/scans')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setScans(scansRes.data.scans || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !isActive });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      window.showNotification?.(`User ${isActive ? 'banned' : 'unbanned'}`, 'success');
    } catch { window.showNotification?.('Action failed', 'error'); }
  };

  const handlePromote = async (userId) => {
    if (!confirm('Promote this user to admin?')) return;
    try {
      await api.put(`/admin/users/${userId}`, { role: 'admin' });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
      window.showNotification?.('User promoted to admin', 'success');
    } catch { window.showNotification?.('Action failed', 'error'); }
  };

  const handleDeleteScan = async (scanId) => {
    if (!confirm('Delete this scan?')) return;
    try {
      await api.delete(`/admin/scans/${scanId}`);
      setScans(prev => prev.filter(s => s._id !== scanId));
      window.showNotification?.('Scan deleted', 'success');
    } catch { window.showNotification?.('Delete failed', 'error'); }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>🛡️ Admin Panel</h1>
          <p>Manage users, scans, and platform settings</p>
        </div>
        <span className="admin-role-badge">Administrator</span>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview', 'users', 'scans'].map(t => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' && '📊 Overview'}
            {t === 'users' && `👥 Users (${users.length})`}
            {t === 'scans' && `🔍 Scans (${scans.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading"><div className="loading-spinner"></div><p>Loading...</p></div>
      ) : (
        <>
          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="admin-overview">
              <div className="admin-stats-grid">
                <StatCard icon="🔍" label="Total Scans" value={stats?.total || 0} color="#3b82f6" />
                <StatCard icon="✅" label="Safe" value={stats?.safe || 0} color="#10b981" />
                <StatCard icon="⚠️" label="Suspicious" value={stats?.suspicious || 0} color="#f59e0b" />
                <StatCard icon="❌" label="Malicious" value={stats?.malicious || 0} color="#ef4444" />
                <StatCard icon="👥" label="Total Users" value={users.length} color="#8b5cf6" />
                <StatCard icon="🛡️" label="Admins" value={users.filter(u => u.role === 'admin').length} color="#f59e0b" />
                <StatCard icon="🚫" label="Banned" value={users.filter(u => !u.isActive).length} color="#ef4444" />
                <StatCard icon="⚡" label="Scans Today" value={stats?.recentScans24h || 0} color="#06b6d4" />
              </div>

              <div className="admin-recent">
                <h2>Recent Users</h2>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Scans</th><th>Status</th><th>Joined</th></tr></thead>
                    <tbody>
                      {users.slice(0, 5).map(u => (
                        <tr key={u._id}>
                          <td><strong>{u.username}</strong></td>
                          <td>{u.email}</td>
                          <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                          <td>{u.totalScans || 0}</td>
                          <td><span className={`status-dot ${u.isActive ? 'active' : 'banned'}`}>{u.isActive ? 'Active' : 'Banned'}</span></td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Username</th><th>Email</th><th>Role</th><th>Scans</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className={!u.isActive ? 'row-banned' : ''}>
                      <td><strong>{u.username}</strong>{u._id === user.id && <span className="you-badge">You</span>}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                      <td>{u.totalScans || 0}</td>
                      <td><span className={`status-dot ${u.isActive ? 'active' : 'banned'}`}>{u.isActive ? 'Active' : 'Banned'}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-btns">
                          {u._id !== user.id && (
                            <>
                              <button className={`act-btn ${u.isActive ? 'ban' : 'unban'}`} onClick={() => handleToggleBan(u._id, u.isActive)}>
                                {u.isActive ? '🚫 Ban' : '✅ Unban'}
                              </button>
                              {u.role !== 'admin' && (
                                <button className="act-btn promote" onClick={() => handlePromote(u._id)}>⬆️ Promote</button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Scans ── */}
          {tab === 'scans' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>URL</th><th>Domain</th><th>Status</th><th>Risk</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {scans.map(s => (
                    <tr key={s._id}>
                      <td className="url-cell" title={s.url}>{s.url?.length > 45 ? s.url.substring(0, 42) + '...' : s.url}</td>
                      <td>{s.domain}</td>
                      <td><span className={`scan-status-badge status-${s.status}`}>{s.status}</span></td>
                      <td style={{ color: s.riskScore >= 60 ? '#ef4444' : s.riskScore >= 30 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>{s.riskScore}/100</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-btns">
                          <Link to={`/scan/${s._id}`} className="act-btn view">👁️ View</Link>
                          <button className="act-btn delete" onClick={() => handleDeleteScan(s._id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="admin-stat-card" style={{ '--c': color }}>
      <span className="asc-icon">{icon}</span>
      <div className="asc-val">{value.toLocaleString()}</div>
      <div className="asc-label">{label}</div>
    </div>
  );
}
