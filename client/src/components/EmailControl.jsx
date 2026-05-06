/**
 * Email Control Component
 * Allows manual sending of test email alerts
 */

import React, { useState } from 'react';
import { sendTestEmail, sendTestTelegram } from '../services/apiService';

const EmailControl = ({ data }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await sendTestEmail(email);
      setMessage('✓ Email sent successfully!');
      setMessageType('success');
      setEmail('');

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTelegram = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      await sendTestTelegram();
      setMessage('✓ Telegram message sent successfully!');
      setMessageType('success');

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 border border-gray-700 shadow-2xl">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Premium Content */}
            <div className="text-center">
              <div className="mb-4">
                <span className="text-5xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Premium Feature</h2>
              <p className="text-gray-300 mb-6">
                Email alerts are available in our premium version. Unlock advanced features and get exclusive benefits!
              </p>

              {/* Feature List */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-200 mb-2">✓ Send custom email alerts</p>
                <p className="text-sm text-gray-200 mb-2">✓ Schedule notifications</p>
                <p className="text-sm text-gray-200">✓ Advanced analytics</p>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95"
              >
                Upgrade to Premium
              </button>

              <p className="text-xs text-gray-400 mt-4">Free version includes Telegram alerts</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Control Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-md mx-auto">
          {/* Message Display */}
          {message && (
            <div
              className={`mb-3 p-3 rounded text-sm font-medium transition-all ${
                messageType === 'success'
                  ? 'bg-green-900/50 text-green-200'
                  : 'bg-red-900/50 text-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {/* Email Form - Opaque/Disabled */}
          <form onSubmit={(e) => { e.preventDefault(); setShowPremiumModal(true); }} className="flex gap-2 mb-3">
            <div
              onClick={() => setShowPremiumModal(true)}
              className="relative flex-1 cursor-pointer opacity-50 hover:opacity-60 transition-opacity"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address..."
                className="w-full px-10 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm pointer-events-none"
                disabled={true}
              />
              {/* Lock Icon */}
              <span
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400"
                title="Premium feature"
              >
                🔒
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed opacity-50"
            >
              {isLoading ? '...' : 'Email'}
            </button>
          </form>

          {/* Telegram Button - Normal */}
          <button
            onClick={handleSendTelegram}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Send Telegram Test'}
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailControl;
