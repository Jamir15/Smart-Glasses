/**
 * Main App Component
 * Handles data fetching and component orchestration
 */

import React, { useState, useEffect, useCallback } from 'react';
import AirQualityDisplay from './components/AirQualityDisplay';
import EmailControl from './components/EmailControl';
import { fetchAirQualityData } from './services/apiService';
import './index.css';

const App = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data function
  const loadData = useCallback(async () => {
    try {
      const freshData = await fetchAirQualityData();
      setData(freshData);
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message);
      // Data remains unchanged on error
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    loadData().then(() => setIsLoading(false));
  }, [loadData]);

  // Poll for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="w-full h-screen flex flex-col">
      <AirQualityDisplay data={data} isLoading={isLoading} />
      <EmailControl data={data} />
    </div>
  );
};

export default App;
