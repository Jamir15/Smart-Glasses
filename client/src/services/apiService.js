/**
 * API Service
 * Handles all communication with the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch latest air quality data from server
 */
export const fetchAirQualityData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // If data is null or missing, return default structure
    if (!result.data || result.data.eco2 === null || result.data.tvoc === null) {
      return {
        eco2: 0,
        tvoc: 0,
        eco2Classification: { status: 'good', color: '#10b981' },
        tvocClassification: { status: 'good', color: '#10b981' },
        timestamp: new Date().toISOString(),
      };
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

/**
 * Send test email alert
 */
export const sendTestEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipientEmail: email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send test Telegram alert
 */
export const sendTestTelegram = async () => {
  try {
    const response = await fetch(`${API_URL}/api/send-telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send Telegram message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram:', error);
    throw error;
  }
};
