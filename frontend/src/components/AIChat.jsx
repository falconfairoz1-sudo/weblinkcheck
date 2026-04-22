import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import '../styles/aichat.css';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! 👋 Paste a link and I\'ll tell you if it\'s safe, whether you should click it, and what the site is about.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(2);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError('');

    // Add user message to chat
    const userMsg = {
      id: messageIdRef.current++,
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);

    try {
      const response = await api.post('/chat/analyze', {
        message: userMessage
      });

      const botMsg = {
        id: messageIdRef.current++,
        type: 'bot',
        text: response.data.analysis,
        timestamp: new Date(),
        metadata: response.data.metadata
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error('Chat error:', err);
      
      const errorMsg = {
        id: messageIdRef.current++,
        type: 'bot',
        text: '❌ Sorry, I couldn\'t analyze that. Please make sure you pasted a valid URL.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: 'Hi! 👋 Paste a link and I\'ll tell you if it\'s safe, whether you should click it, and what the site is about.',
        timestamp: new Date()
      }
    ]);
    messageIdRef.current = 2;
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Chat Assistant"
      >
        <span className="chat-icon">💬</span>
        {!isOpen && <span className="chat-badge">AI</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-icon-header">🤖</span>
              <div>
                <h3>AI Link Assistant</h3>
                <p>Instant link analysis</p>
              </div>
            </div>
            <div className="chat-controls">
              <button
                className="chat-clear-btn"
                onClick={handleClearChat}
                title="Clear chat"
              >
                🗑️
              </button>
              <button
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.type}`}>
                <div className="message-content">
                  <p>{msg.text}</p>
                  {msg.metadata && (
                    <div className="message-metadata">
                      {msg.metadata.isSafe !== undefined && (
                        <span className={`safety-badge ${msg.metadata.isSafe ? 'safe' : 'unsafe'}`}>
                          {msg.metadata.isSafe ? '✅ Safe' : '⚠️ Unsafe'}
                        </span>
                      )}
                      {msg.metadata.riskScore !== undefined && (
                        <span className="risk-score">Risk: {msg.metadata.riskScore}/100</span>
                      )}
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {loading && (
              <div className="message message-bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="chat-error">
              {error}
            </div>
          )}

          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="Paste a link here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || !input.trim()}
            >
              {loading ? '⏳' : '📤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
