import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/ScanContext';
import api from '../utils/api';
import '../styles/profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await api.put('/auth/update-profile', {
        username: formData.username,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      addNotification('Profile updated successfully', 'success');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.error || 'Error updating profile';
      addNotification(errorMessage, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    addNotification('Logged out successfully', 'success');
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="not-logged-in">
            <p>Please log in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-large">👤</div>
            <div className="avatar-info">
              <h2>{user.username}</h2>
              <p className="user-email">{user.email}</p>
              <p className="member-since">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Profile Info */}
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-group">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className="info-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
              <div className="info-group">
                <label>Account Status</label>
                <p className="status-active">✅ Active</p>
              </div>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-divider">
                <h3>Change Password (Optional)</h3>
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Leave empty if not changing password"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Leave empty if not changing password"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Leave empty if not changing password"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user.username,
                      email: user.email,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Actions */}
        <div className="account-actions">
          <h3>Account Actions</h3>
          <div className="actions-grid">
            <button className="action-btn logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
            <button className="action-btn delete-btn" onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                addNotification('Account deletion feature coming soon', 'info');
              }
            }}>
              🗑️ Delete Account
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="security-info">
          <h3>🔒 Security Information</h3>
          <div className="security-items">
            <div className="security-item">
              <span className="security-icon">✅</span>
              <div className="security-text">
                <p className="security-title">Password Protected</p>
                <p className="security-desc">Your account is secured with a password</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✅</span>
              <div className="security-text">
                <p className="security-title">Secure Connection</p>
                <p className="security-desc">All data is encrypted in transit</p>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">✅</span>
              <div className="security-text">
                <p className="security-title">Privacy Protected</p>
                <p className="security-desc">Your data is never shared with third parties</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
