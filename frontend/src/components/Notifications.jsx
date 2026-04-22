import React, { useState, useEffect } from 'react';
import '../styles/notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const notification = { id, message, type };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose globally for use in other components
  useEffect(() => {
    window.showNotification = addNotification;
  }, []);

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <span className="notification-icon">{getIcon(notification.type)}</span>
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
