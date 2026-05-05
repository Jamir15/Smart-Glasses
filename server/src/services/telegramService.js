/**
 * Telegram Notification Service
 * Sends Telegram messages when air quality is bad
 * Includes cooldown to prevent spam
 */

import axios from 'axios';
import { getConfig } from '../utils/config.js';

const config = getConfig();

// Cooldown tracking (5 minutes = 300000 ms)
const COOLDOWN_MS = 5 * 60 * 1000;
let lastNotificationTime = 0;

/**
 * Check if enough time has passed since last notification
 */
const canSendNotification = () => {
  const now = Date.now();
  return now - lastNotificationTime >= COOLDOWN_MS;
};

/**
 * Send alert via Telegram
 */
export const sendTelegramAlert = async (eco2, tvoc, eco2Status, tvocStatus) => {
  // Check if bot is configured
  if (!config.telegram.botToken || !config.telegram.chatId) {
    console.log('Telegram not configured. Skipping notification.');
    return { success: false, reason: 'not_configured' };
  }

  // Check cooldown
  if (!canSendNotification()) {
    console.log('Telegram notification on cooldown. Skipping...');
    return { success: false, reason: 'cooldown' };
  }

  try {
    const message = `
🚨 *Air Quality Alert*

*eCO2 Level:*
• Value: ${eco2} ppm
• Status: ${eco2Status}

*TVOC Level:*
• Value: ${tvoc} ppb
• Status: ${tvocStatus}

⏰ Timestamp: ${new Date().toISOString()}
    `.trim();

    const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: config.telegram.chatId,
      text: message,
      parse_mode: 'Markdown',
    });

    if (response.data.ok) {
      lastNotificationTime = Date.now();
      console.log('Telegram message sent successfully');
      return { success: true, message: 'Telegram message sent' };
    } else {
      console.error('Telegram API error:', response.data.description);
      return { success: false, error: response.data.description };
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check if should send alert (based on cooldown)
 */
export const shouldSendAlert = () => canSendNotification();

/**
 * Get time until next alert can be sent (in seconds)
 */
export const getTimeUntilNextAlert = () => {
  const now = Date.now();
  const timePassed = now - lastNotificationTime;
  const timeRemaining = Math.max(0, COOLDOWN_MS - timePassed);
  return Math.ceil(timeRemaining / 1000);
};
