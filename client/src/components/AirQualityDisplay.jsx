/**
 * Air Quality Display Component
 * Main display component showing eCO2 or TVOC with large numbers
 * Tap on label to toggle between values
 */

import React, { useState } from 'react';
import { getStatusColorClass, getGlowClass } from '../utils/helpers';

const AirQualityDisplay = ({ data, isLoading }) => {
  const [displayMode, setDisplayMode] = useState('eco2'); // 'eco2' or 'tvoc'
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Determine which value and classification to display
  const isEco2Mode = displayMode === 'eco2';
  const currentValue = isEco2Mode ? data.eco2 : data.tvoc;
  const currentClassification = isEco2Mode ? data.eco2Classification : data.tvocClassification;
  const unit = isEco2Mode ? 'ppm' : 'ppb';
  const label = isEco2Mode ? 'eCO2' : 'TVOC';

  const statusColor = currentClassification.status;
  const displayStatus = currentValue === 0 ? 'offline' : statusColor;
  const colorClass = getStatusColorClass(displayStatus);
  const glowClass = getGlowClass(displayStatus);

  const handleToggle = () => {
    setDisplayMode(isEco2Mode ? 'tvoc' : 'eco2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center px-4 relative">
      {/* Info Menu Button */}
      <button
        onClick={() => setShowInfoModal(true)}
        className="fixed top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors z-40 shadow-lg"
        title="System Information"
      >
        ℹ
      </button>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
              <h2 className="text-2xl font-bold text-white">System Information</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* System Overview */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">About This System</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The Smart Glasses Air Quality Monitor is a real-time environmental monitoring system that tracks air quality levels using advanced sensors. It provides instant feedback on harmful air pollutants and alerts users when air quality deteriorates.
                </p>
              </div>

              {/* eCO2 Explanation */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-lg">eCO2</span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  <span className="font-semibold text-blue-400">Equivalent CO2 (eCO2)</span> is an estimate of CO2 concentration based on volatile organic compounds (VOCs) detected in the air. It's measured in <span className="font-semibold">ppm (parts per million)</span>.
                </p>
                <div className="bg-gray-700/50 rounded p-3 space-y-2">
                  <p className="text-xs text-gray-200"><span className="text-green-400 font-bold">Good:</span> 400-600 ppm</p>
                  <p className="text-xs text-gray-200"><span className="text-yellow-400 font-bold">Moderate:</span> 600-1000 ppm</p>
                  <p className="text-xs text-gray-200"><span className="text-orange-400 font-bold">Poor:</span> 1000-1500 ppm</p>
                  <p className="text-xs text-gray-200"><span className="text-red-400 font-bold">Bad:</span> 1500+ ppm</p>
                </div>
              </div>

              {/* TVOC Explanation */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-lg">TVOC</span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  <span className="font-semibold text-purple-400">Total Volatile Organic Compounds (TVOC)</span> measures the concentration of volatile chemicals in the air. It's measured in <span className="font-semibold">ppb (parts per billion)</span>.
                </p>
                <div className="bg-gray-700/50 rounded p-3 space-y-2">
                  <p className="text-xs text-gray-200"><span className="text-green-400 font-bold">Good:</span> 0-260 ppb</p>
                  <p className="text-xs text-gray-200"><span className="text-yellow-400 font-bold">Moderate:</span> 260-600 ppb</p>
                  <p className="text-xs text-gray-200"><span className="text-orange-400 font-bold">Poor:</span> 600-1000 ppb</p>
                  <p className="text-xs text-gray-200"><span className="text-red-400 font-bold">Bad:</span> 1000+ ppb</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Real-time air quality monitoring</span>
                  </li>
                  <li className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Telegram instant notifications</span>
                  </li>
                  <li className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Status indicators (Good, Moderate, Poor, Bad)</span>
                  </li>
                  <li className="text-gray-300 flex items-start gap-2">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>5-second data refresh rate</span>
                  </li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded font-bold transition-all transform hover:scale-105 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Display Card */}
      <div className={`transition-all duration-500 ease-in-out animate-transition ${glowClass} rounded-2xl bg-gray-800 p-8 md:p-12 w-full max-w-md`}>
        {/* Status Badge */}
        <div className={`text-center mb-8 px-4 py-2 rounded-full inline-block w-full ${colorClass}`}>
          <span className="font-bold text-lg">
            {currentValue === 0 ? 'OFFLINE' : statusColor.toUpperCase()}
          </span>
        </div>

        {/* Large Number Display */}
        <div className="text-center mb-6">
          <div
            className={`text-7xl md:text-8xl font-bold mb-4 animate-slide-in`}
            style={{
              color: currentValue === 0 ? '#9CA3AF' : currentClassification.color,
              textShadow: currentValue === 0 ? 'none' : `0 0 30px ${currentClassification.color}80`,
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
