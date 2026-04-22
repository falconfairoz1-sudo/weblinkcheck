import React, { useState, useRef } from 'react';
import { useScan } from '../context/ScanContext';
import { isValidUrl } from '../utils/helpers';
import '../styles/inputbox.css';

export default function InputBox({ onResult }) {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState('');
  const { scanUrl, scanning } = useScan();
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setInputError('Please enter a URL to scan.');
      inputRef.current?.focus();
      return;
    }

    // Auto-prepend https:// if missing
    let finalUrl = trimmed;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
      setUrl(finalUrl);
    }

    if (!isValidUrl(finalUrl)) {
      setInputError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setInputError('');

    try {
      const result = await scanUrl(finalUrl);
      if (onResult) onResult(result);
    } catch (err) {
      setInputError(err.message);
    }
  };

  const handlePaste = (e) => {
    // Auto-submit on paste after a brief delay
    setTimeout(() => {
      const pasted = e.target.value.trim();
      if (pasted && isValidUrl(pasted.startsWith('http') ? pasted : 'https://' + pasted)) {
        setInputError('');
      }
    }, 100);
  };

  const handleClear = () => {
    setUrl('');
    setInputError('');
    inputRef.current?.focus();
  };

  const exampleUrls = [
    'https://google.com',
    'https://github.com',
    'http://suspicious-login-verify.tk'
  ];

  return (
    <div className="input-box-wrapper">
      <form className="scan-form" onSubmit={handleSubmit} noValidate>
        <div className={`input-container ${inputError ? 'has-error' : ''} ${scanning ? 'scanning' : ''}`}>
          <span className="input-icon">🔗</span>
          <input
            ref={inputRef}
            type="text"
            className="url-input"
            placeholder="Paste any URL to check safety... (e.g., https://example.com)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (inputError) setInputError('');
            }}
            onPaste={handlePaste}
            disabled={scanning}
            autoComplete="off"
            spellCheck="false"
            aria-label="URL to scan"
            aria-describedby={inputError ? 'input-error' : undefined}
          />
          {url && !scanning && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              aria-label="Clear input"
            >
              ✕
            </button>
          )}
        </div>

        {inputError && (
          <p className="input-error" id="input-error" role="alert">
            ⚠️ {inputError}
          </p>
        )}

        <button
          type="submit"
          className={`scan-btn ${scanning ? 'loading' : ''}`}
          disabled={scanning}
        >
          {scanning ? (
            <>
              <span className="spinner"></span>
              Analyzing URL...
            </>
          ) : (
            <>
              <span>🛡️</span>
              Check Safety
            </>
          )}
        </button>
      </form>

      {/* Example URLs */}
      <div className="example-urls">
        <span className="example-label">Try an example:</span>
        {exampleUrls.map((exUrl) => (
          <button
            key={exUrl}
            className="example-chip"
            onClick={() => {
              setUrl(exUrl);
              setInputError('');
            }}
            disabled={scanning}
          >
            {exUrl.replace(/^https?:\/\//, '').substring(0, 30)}
          </button>
        ))}
      </div>
    </div>
  );
}
