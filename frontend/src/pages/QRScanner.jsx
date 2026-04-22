import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ResultCard from '../components/ResultCard';
import '../styles/qrscanner.css';

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file too large. Maximum size is 5MB');
      return;
    }

    setScanning(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('qrImage', file);

      const response = await api.post('/qr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.isUrl) {
        setResult(response.data);
      } else {
        setError(response.data.message || 'QR code does not contain a URL');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan QR code');
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="qr-scanner-page">
      <div className="qr-scanner-container">
        <div className="qr-header">
          <h1>🔍 QR Code Scanner</h1>
          <p>Upload a QR code image to extract and analyze the URL</p>
        </div>

        <div
          className={`qr-upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {scanning ? (
            <div className="qr-scanning">
              <div className="qr-spinner"></div>
              <p>Scanning QR code...</p>
            </div>
          ) : (
            <>
              <div className="qr-icon">📷</div>
              <h3>Drop QR code image here</h3>
              <p>or click to browse</p>
              <span className="qr-formats">Supports: JPG, PNG, GIF (Max 5MB)</span>
            </>
          )}
        </div>

        {error && (
          <div className="qr-error">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="qr-result-section">
            <div className="qr-extracted-url">
              <h3>Extracted URL:</h3>
              <div className="url-display">{result.url}</div>
            </div>

            <ResultCard
              url={result.url}
              riskScore={result.riskScore}
              status={result.status}
              googleSafeBrowsing={result.googleSafeBrowsing}
              virusTotal={result.virusTotal}
              heuristics={result.heuristicAnalysis}
              aiAnalysis={result.aiAnalysis}
              warnings={result.heuristicAnalysis?.warnings || []}
            />
          </div>
        )}

        <div className="qr-info-cards">
          <div className="qr-info-card">
            <div className="info-icon">🛡️</div>
            <h4>Stay Safe</h4>
            <p>Scan QR codes before visiting to detect phishing and malware</p>
          </div>
          <div className="qr-info-card">
            <div className="info-icon">⚡</div>
            <h4>Instant Analysis</h4>
            <p>Get immediate security assessment of the embedded URL</p>
          </div>
          <div className="qr-info-card">
            <div className="info-icon">🔒</div>
            <h4>Privacy First</h4>
            <p>Images are processed securely and not stored</p>
          </div>
        </div>
      </div>
    </div>
  );
}
