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

        {/* Email Form */}
        <form onSubmit={handleSendEmail} className="flex gap-2 mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address..."
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Email'}
          </button>
        </form>

        {/* Telegram Button */}
        <button
          onClick={handleSendTelegram}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Send Telegram Test'}
        </button>
      </div>
    </div>
  );
};

export default EmailControl;
