import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const ScanContext = createContext(null);

export function ScanProvider({ children }) {
  const [currentScan, setCurrentScan] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const scanUrl = async (url) => {
    setScanning(true);
    setError(null);
    setCurrentScan(null);
    try {
      const res = await api.post('/scan', { url });
      setCurrentScan(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Scan failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setScanning(false);
    }
  };

  const bulkScan = async (urls) => {
    setScanning(true);
    setError(null);
    try {
      const res = await api.post('/scan/bulk', { urls });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Bulk scan failed.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setScanning(false);
    }
  };

  const clearScan = () => {
    setCurrentScan(null);
    setError(null);
  };

  return (
    <ScanContext.Provider value={{ currentScan, scanning, error, scanUrl, bulkScan, clearScan }}>
      {children}
    </ScanContext.Provider>
  );
}

export const useScan = () => useContext(ScanContext);
