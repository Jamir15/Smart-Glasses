/**
 * Air Quality Display Component
 * Main display component showing eCO2 or TVOC with large numbers
 * Tap on label to toggle between values
 */

import React, { useState } from 'react';
import { getStatusColorClass, getGlowClass } from '../utils/helpers';

const AirQualityDisplay = ({ data, isLoading }) => {
  const [displayMode, setDisplayMode] = useState('eco2'); // 'eco2' or 'tvoc'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-white text-lg mb-2">No data available</p>
          <p className="text-gray-400 text-sm">Waiting for sensor readings...</p>
        </div>
      </div>
    );
  }

  // Determine which value and classification to display
  const isEco2Mode = displayMode === 'eco2';
  const currentValue = isEco2Mode ? data.eco2 : data.tvoc;
  const currentClassification = isEco2Mode ? data.eco2Classification : data.tvocClassification;
  const unit = isEco2Mode ? 'ppm' : 'ppb';
  const label = isEco2Mode ? 'eCO2' : 'TVOC';

  const statusColor = currentClassification.status;
  const colorClass = getStatusColorClass(statusColor);
  const glowClass = getGlowClass(statusColor);

  const handleToggle = () => {
    setDisplayMode(isEco2Mode ? 'tvoc' : 'eco2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4">
      {/* Main Display Card */}
      <div className={`transition-all duration-500 ease-in-out animate-transition ${glowClass} rounded-2xl bg-gray-800 p-8 md:p-12 w-full max-w-md`}>
        {/* Status Badge */}
        <div className={`text-center mb-8 px-4 py-2 rounded-full inline-block w-full ${colorClass}`}>
          <span className="font-bold text-lg">{statusColor.toUpperCase()}</span>
        </div>

        {/* Large Number Display */}
        <div className="text-center mb-6">
          <div
            className={`text-7xl md:text-8xl font-bold mb-4 animate-slide-in`}
            style={{
              color: currentClassification.color,
              textShadow: `0 0 30px ${currentClassification.color}80`,
            }}
          >
            {currentValue}
          </div>

          {/* Unit */}
          <div className="text-2xl text-gray-400 font-semibold">
            {unit}
          </div>
        </div>

        {/* Toggle Label - Tap to Change */}
        <div className="mt-12 text-center">
          <button
            onClick={handleToggle}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <span className="text-xl">{label}</span>
            <span className="block text-sm mt-1 font-normal">Tap to switch</span>
          </button>
        </div>

        {/* Secondary Info */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            {isEco2Mode ? 'TVOC' : 'eCO2'}: {isEco2Mode ? data.tvoc : data.eco2} {isEco2Mode ? 'ppb' : 'ppm'}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Updated: {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm max-w-md">
        <p>Smart Glasses Air Quality Monitor</p>
      </div>
    </div>
  );
};

export default AirQualityDisplay;
